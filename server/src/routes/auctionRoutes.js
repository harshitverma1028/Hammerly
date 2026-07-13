const express = require("express");
const router = express.Router();
const {
  getAuctions,
  getAuction,
  getAuctionByItem,
  createAuction,
  updateAuction,
  deleteAuction,
} = require("../controllers/auctionController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getAuctions);
router.get("/item/:itemId", getAuctionByItem);
router.get("/:id", getAuction);
router.post("/", protect, adminOnly, createAuction);
router.put("/:id", protect, adminOnly, updateAuction);
router.delete("/:id", protect, adminOnly, deleteAuction);

module.exports = router;
