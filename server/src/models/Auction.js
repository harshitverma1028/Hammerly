const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
      min: 0,
    },
    currentBid: {
      type: Number,
      default: function () {
        return this.startingBid;
      },
    },
    bidIncrement: {
      type: Number,
      required: true,
      min: 1,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalBids: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "ended", "cancelled"],
      default: "upcoming",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

auctionSchema.index({ item: 1 });
auctionSchema.index({ status: 1 });

module.exports = mongoose.model("Auction", auctionSchema);
