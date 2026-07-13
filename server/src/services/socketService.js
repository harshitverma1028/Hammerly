const Auction = require("../models/Auction");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-auction", (auctionId) => {
      socket.join(`auction-${auctionId}`);
    });

    socket.on("leave-auction", (auctionId) => {
      socket.leave(`auction-${auctionId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

// Called by the scheduler when an auction ends, to notify connected clients
const emitAuctionEnded = (io, auction) => {
  io.to(`auction-${auction._id}`).emit("auction-ended", {
    auctionId: auction._id,
    winner: auction.winner,
    highestBidder: auction.highestBidder,
    currentBid: auction.currentBid,
    status: auction.status,
  });
};

module.exports = { initSocket, emitAuctionEnded };
