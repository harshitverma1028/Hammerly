const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
exports.placeBid = asyncHandler(async (req, res) => {
  const { auctionId, amount } = req.body;
  const userId = req.user._id;

  if (!auctionId || amount === undefined) {
    return res.status(400).json({ success: false, message: "Auction and amount are required" });
  }

  const auction = await Auction.findById(auctionId);
  if (!auction) {
    return res.status(404).json({ success: false, message: "Auction not found" });
  }

  const now = new Date();

  // Auto-transition status based on time
  if (auction.status === "upcoming" && auction.startTime <= now) {
    auction.status = "live";
  }
  if ((auction.status === "live" || auction.status === "upcoming") && auction.endTime <= now) {
    auction.status = "ended";
    if (auction.highestBidder) auction.winner = auction.highestBidder;
    await auction.save();
  }

  if (auction.status !== "live") {
    return res.status(400).json({ success: false, message: `Auction is not live. Current status: ${auction.status}` });
  }

  const minimumBid = auction.currentBid + auction.bidIncrement;
  if (Number(amount) < minimumBid) {
    return res.status(400).json({
      success: false,
      message: `Bid must be at least ${minimumBid} (current bid + increment)`,
    });
  }

  const bid = await Bid.create({ auction: auctionId, user: userId, amount });

  auction.currentBid = amount;
  auction.highestBidder = userId;
  auction.totalBids += 1;
  if (!auction.participants.some((p) => p.toString() === userId.toString())) {
    auction.participants.push(userId);
  }
  await auction.save();

  const populatedBid = await Bid.findById(bid._id).populate("user", "name");

  // Broadcast via socket.io
  const io = req.app.get("io");
  if (io) {
    io.to(`auction-${auctionId}`).emit("bid-updated", {
      auctionId,
      currentBid: auction.currentBid,
      highestBidder: { _id: userId, name: req.user.name },
      totalBids: auction.totalBids,
      participants: auction.participants.length,
      bid: populatedBid,
    });
  }

  res.status(201).json({ success: true, bid: populatedBid, auction });
});

// @desc    Get bid history for an auction
// @route   GET /api/bids/:auctionId
// @access  Public
exports.getBidsForAuction = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ auction: req.params.auctionId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bids.length, bids });
});
