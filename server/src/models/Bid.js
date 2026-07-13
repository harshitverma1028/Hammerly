const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

bidSchema.index({ auction: 1, createdAt: -1 });

module.exports = mongoose.model("Bid", bidSchema);
