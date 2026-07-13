const cron = require("node-cron");
const Auction = require("../models/Auction");
const { emitAuctionEnded } = require("./socketService");

// Runs every 10 seconds to auto-transition auction statuses based on start/end time
const startScheduler = (io) => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const now = new Date();

      // Move upcoming -> live
      await Auction.updateMany(
        { status: "upcoming", startTime: { $lte: now } },
        { $set: { status: "live" } }
      );

      // Move live -> ended, set winner
      const endingAuctions = await Auction.find({ status: "live", endTime: { $lte: now } });

      for (const auction of endingAuctions) {
        auction.status = "ended";
        if (auction.highestBidder) {
          auction.winner = auction.highestBidder;
        }
        await auction.save();
        if (io) emitAuctionEnded(io, auction);
      }
    } catch (error) {
      console.error("Auction scheduler error:", error.message);
    }
  });
};

module.exports = startScheduler;
