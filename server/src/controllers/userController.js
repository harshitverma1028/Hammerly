const User = require("../models/User");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (user.role === "admin") {
    return res.status(400).json({ success: false, message: "Cannot delete an admin account" });
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted" });
});

// @desc    Get my bids (auctions the current user has bid on)
// @route   GET /api/users/my-bids
// @access  Private
exports.getMyBids = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const myBids = await Bid.find({ user: userId }).distinct("auction");

  const auctions = await Auction.find({ _id: { $in: myBids } })
    .populate({ path: "item", populate: { path: "category", select: "name slug" } })
    .populate("highestBidder", "name")
    .sort({ createdAt: -1 });

  const results = await Promise.all(
    auctions.map(async (auction) => {
      const highestUserBid = await Bid.findOne({ auction: auction._id, user: userId }).sort({ amount: -1 });
      return {
        auction,
        myHighestBid: highestUserBid ? highestUserBid.amount : 0,
        isHighestBidder: auction.highestBidder && auction.highestBidder._id.toString() === userId.toString(),
      };
    })
  );

  res.status(200).json({ success: true, count: results.length, results });
});

// @desc    Get won auctions
// @route   GET /api/users/won-auctions
// @access  Private
exports.getWonAuctions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const auctions = await Auction.find({ winner: userId, status: "ended" })
    .populate({ path: "item", populate: { path: "category", select: "name slug" } })
    .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, count: auctions.length, auctions });
});
