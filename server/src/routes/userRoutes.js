const express = require("express");
const router = express.Router();
const { getUsers, deleteUser, getMyBids, getWonAuctions } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/my-bids", protect, getMyBids);
router.get("/won-auctions", protect, getWonAuctions);
router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
