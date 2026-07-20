const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const asyncHandler = require("../utils/asyncHandler");

// Maximum bid that instantly wins the auction
const MAX_WINNING_BID = 9999999999;

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
exports.placeBid = asyncHandler(async (req, res) => {
  const { auctionId, amount } = req.body;
  const userId = req.user._id;

  if (!auctionId || amount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Auction and amount are required",
    });
  }

  const bidAmount = Number(amount);

  if (isNaN(bidAmount) || bidAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid bid amount",
    });
  }

  const auction = await Auction.findById(auctionId);

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "Auction not found",
    });
  }

  const now = new Date();

  // Automatically update auction status based on time
  if (auction.status === "upcoming" && auction.startTime <= now) {
    auction.status = "live";
  }

  if (
    (auction.status === "live" || auction.status === "upcoming") &&
    auction.endTime <= now
  ) {
    auction.status = "ended";

    if (auction.highestBidder) {
      auction.winner = auction.highestBidder;
    }

    await auction.save();
  }

  // Auction already ended because someone reached max bid
  if (
    auction.status === "ended" &&
    auction.currentBid >= MAX_WINNING_BID
  ) {
    return res.status(400).json({
      success: false,
      message: "Auction has already ended. Winner has been declared.",
    });
  }

  if (auction.status !== "live") {
    return res.status(400).json({
      success: false,
      message: `Auction is not live. Current status: ${auction.status}`,
    });
  }

  // Prevent bids greater than max winning bid
  if (bidAmount > MAX_WINNING_BID) {
    return res.status(400).json({
      success: false,
      message: `Maximum allowed bid is ${MAX_WINNING_BID}.`,
    });
  }

  const minimumBid = auction.currentBid + auction.bidIncrement;

  if (bidAmount < minimumBid) {
    return res.status(400).json({
      success: false,
      message: `Bid must be at least ${minimumBid} (current bid + increment)`,
    });
  }

  // Create bid
  const bid = await Bid.create({
    auction: auctionId,
    user: userId,
    amount: bidAmount,
  });

  // Update auction
  auction.currentBid = bidAmount;
  auction.highestBidder = userId;
  auction.totalBids += 1;

  if (
    !auction.participants.some(
      (p) => p.toString() === userId.toString()
    )
  ) {
    auction.participants.push(userId);
  }

  // Instant win if max bid reached
  if (bidAmount === MAX_WINNING_BID) {
    auction.status = "ended";
    auction.winner = userId;
  }

  await auction.save();

  const populatedBid = await Bid.findById(bid._id).populate(
    "user",
    "name"
  );

  // Broadcast via Socket.IO
  const io = req.app.get("io");

  if (io) {
    io.to(`auction-${auctionId}`).emit("bid-updated", {
      auctionId,
      currentBid: auction.currentBid,
      highestBidder: {
        _id: userId,
        name: req.user.name,
      },
      totalBids: auction.totalBids,
      participants: auction.participants.length,
      bid: populatedBid,
      status: auction.status,
      winner:
        auction.status === "ended"
          ? {
              _id: userId,
              name: req.user.name,
            }
          : null,
    });
  }

  res.status(201).json({
    success: true,
    message:
      bidAmount === MAX_WINNING_BID
        ? "🎉 Congratulations! You reached the maximum bid and are the winner."
        : "Bid placed successfully.",
    bid: populatedBid,
    auction,
  });
});

// @desc    Get bid history for an auction
// @route   GET /api/bids/:auctionId
// @access  Public
exports.getBidsForAuction = asyncHandler(async (req, res) => {
  const bids = await Bid.find({
    auction: req.params.auctionId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bids.length,
    bids,
  });
});