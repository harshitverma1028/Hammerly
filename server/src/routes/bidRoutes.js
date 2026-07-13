const express = require("express");
const router = express.Router();
const { placeBid, getBidsForAuction } = require("../controllers/bidController");
const { protect } = require("../middleware/auth");

router.post("/", protect, placeBid);
router.get("/:auctionId", getBidsForAuction);

module.exports = router;
