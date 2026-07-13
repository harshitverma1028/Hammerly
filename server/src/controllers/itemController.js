const Item = require("../models/Item");
const Category = require("../models/Category");
const Auction = require("../models/Auction");
const asyncHandler = require("../utils/asyncHandler");
const { uploadMultiple, deleteImage } = require("../services/uploadService");

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const filter = {};
  if (featured === "true") filter.featured = true;

  const items = await Item.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: items.length, items });
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category", "name slug");
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  // Attach auction info if it exists
  const auction = await Auction.findOne({ item: item._id }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, item, auction });
});

// @desc    Get items by category slug
// @route   GET /api/items/category/:slug
// @access  Public
exports.getItemsByCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const items = await Item.find({ category: category._id }).populate("category", "name slug").sort({ createdAt: -1 });
  res.status(200).json({ success: true, category, count: items.length, items });
});

// @desc    Create item
// @route   POST /api/items
// @access  Private/Admin
exports.createItem = asyncHandler(async (req, res) => {
  const { title, description, category, brand, location, year, condition, authenticityCertificate, featured, specifications } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ success: false, message: "Title, description and category are required" });
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(400).json({ success: false, message: "Invalid category" });
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    images = await uploadMultiple(req.files, "items");
  }

  let parsedSpecs = [];
  if (specifications) {
    parsedSpecs = typeof specifications === "string" ? JSON.parse(specifications) : specifications;
  }

  const item = await Item.create({
    title,
    description,
    category,
    images,
    brand,
    location,
    year,
    condition,
    authenticityCertificate: authenticityCertificate === "true" || authenticityCertificate === true,
    featured: featured === "true" || featured === true,
    specifications: parsedSpecs,
  });

  res.status(201).json({ success: true, item });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private/Admin
exports.updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  const fields = ["title", "description", "category", "brand", "location", "year", "condition"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });

  if (req.body.authenticityCertificate !== undefined) {
    item.authenticityCertificate = req.body.authenticityCertificate === "true" || req.body.authenticityCertificate === true;
  }
  if (req.body.featured !== undefined) {
    item.featured = req.body.featured === "true" || req.body.featured === true;
  }
  if (req.body.specifications) {
    item.specifications = typeof req.body.specifications === "string" ? JSON.parse(req.body.specifications) : req.body.specifications;
  }

  if (req.files && req.files.length > 0) {
    // Remove old images
    for (const img of item.images) {
      if (img.public_id) await deleteImage(img.public_id);
    }
    item.images = await uploadMultiple(req.files, "items");
  }

  await item.save();
  res.status(200).json({ success: true, item });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private/Admin
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  const activeAuction = await Auction.findOne({ item: item._id, status: { $in: ["upcoming", "live"] } });
  if (activeAuction) {
    return res.status(400).json({ success: false, message: "Cannot delete item with an active auction" });
  }

  for (const img of item.images) {
    if (img.public_id) await deleteImage(img.public_id);
  }

  await item.deleteOne();
  res.status(200).json({ success: true, message: "Item deleted" });
});
