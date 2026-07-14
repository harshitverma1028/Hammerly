const Auction = require("../models/Auction");
const Item = require("../models/Item");
const Bid = require("../models/Bid");
const asyncHandler = require("../utils/asyncHandler");
const { DateTime } = require("luxon");

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Public
exports.getAuctions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};

  if (status) filter.status = status;

  const auctions = await Auction.find(filter)
    .populate({
      path: "item",
      populate: {
        path: "category",
        select: "name slug",
      },
    })
    .populate("highestBidder", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: auctions.length,
    auctions,
  });
});

// @desc    Get single auction
// @route   GET /api/auctions/:id
// @access  Public
exports.getAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id)
    .populate({
      path: "item",
      populate: {
        path: "category",
        select: "name slug",
      },
    })
    .populate("highestBidder", "name")
    .populate("winner", "name")
    .populate("participants", "name");

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "Auction not found",
    });
  }

  res.status(200).json({
    success: true,
    auction,
  });
});

// @desc    Get auction by item id
// @route   GET /api/auctions/item/:itemId
// @access  Public
exports.getAuctionByItem = asyncHandler(async (req, res) => {
  const auction = await Auction.findOne({
    item: req.params.itemId,
  })
    .populate({
      path: "item",
      populate: {
        path: "category",
        select: "name slug",
      },
    })
    .populate("highestBidder", "name")
    .sort({ createdAt: -1 });

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "No auction found for this item",
    });
  }

  res.status(200).json({
    success: true,
    auction,
  });
});

// @desc    Create auction
// @route   POST /api/auctions
// @access  Private/Admin
exports.createAuction = asyncHandler(async (req, res) => {
  const {
    item,
    startTime,
    endTime,
    startingBid,
    bidIncrement,
  } = req.body;

  if (
    !item ||
    !startTime ||
    !endTime ||
    !startingBid ||
    !bidIncrement
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const itemExists = await Item.findById(item);

  if (!itemExists) {
    return res.status(400).json({
      success: false,
      message: "Invalid item",
    });
  }

  const existingActive = await Auction.findOne({
    item,
    status: {
      $in: ["upcoming", "live"],
    },
  });

  if (existingActive) {
    return res.status(400).json({
      success: false,
      message: "This item already has an active auction",
    });
  }

  // Parse datetime-local values as IST
  const start = DateTime.fromISO(startTime, {
    zone: "Asia/Kolkata",
  }).toJSDate();

  const end = DateTime.fromISO(endTime, {
    zone: "Asia/Kolkata",
  }).toJSDate();

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  const status = start <= new Date() ? "live" : "upcoming";

  const auction = await Auction.create({
    item,
    startTime: start,
    endTime: end,
    startingBid: Number(startingBid),
    currentBid: Number(startingBid),
    bidIncrement: Number(bidIncrement),
    status,
  });

  res.status(201).json({
    success: true,
    auction,
  });
});

// @desc    Update auction
// @route   PUT /api/auctions/:id
// @access  Private/Admin
exports.updateAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "Auction not found",
    });
  }

  if (auction.totalBids > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot edit an auction that already has bids",
    });
  }

  if (req.body.startTime) {
    auction.startTime = DateTime.fromISO(req.body.startTime, {
      zone: "Asia/Kolkata",
    }).toJSDate();
  }

  if (req.body.endTime) {
    auction.endTime = DateTime.fromISO(req.body.endTime, {
      zone: "Asia/Kolkata",
    }).toJSDate();
  }

  if (auction.endTime <= auction.startTime) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  if (req.body.startingBid !== undefined) {
    auction.startingBid = Number(req.body.startingBid);
    auction.currentBid = Number(req.body.startingBid);
  }

  if (req.body.bidIncrement !== undefined) {
    auction.bidIncrement = Number(req.body.bidIncrement);
  }

  auction.status =
    auction.startTime <= new Date() ? "live" : "upcoming";

  await auction.save();

  res.status(200).json({
    success: true,
    auction,
  });
});

// @desc    Delete auction
// @route   DELETE /api/auctions/:id
// @access  Private/Admin
exports.deleteAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: "Auction not found",
    });
  }

  await Bid.deleteMany({
    auction: auction._id,
  });

  await auction.deleteOne();

  res.status(200).json({
    success: true,
    message: "Auction deleted",
  });
});