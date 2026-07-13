const express = require("express");
const router = express.Router();
const {
  getItems,
  getItem,
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getItems);
router.get("/category/:slug", getItemsByCategory);
router.get("/:id", getItem);
router.post("/", protect, adminOnly, upload.array("images", 6), createItem);
router.put("/:id", protect, adminOnly, upload.array("images", 6), updateItem);
router.delete("/:id", protect, adminOnly, deleteItem);

module.exports = router;
