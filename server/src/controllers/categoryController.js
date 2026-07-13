const Category = require("../models/Category");
const Item = require("../models/Item");
const asyncHandler = require("../utils/asyncHandler");
const { uploadBuffer, deleteImage } = require("../services/uploadService");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: categories.length, categories });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  res.status(200).json({ success: true, category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Category name is required" });
  }

  let image = { url: "", public_id: "" };
  if (req.file) {
    image = await uploadBuffer(req.file.buffer, "categories");
  }

  const category = await Category.create({ name, description, status, image });
  res.status(201).json({ success: true, category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const { name, description, status } = req.body;
  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (status) category.status = status;

  if (req.file) {
    if (category.image && category.image.public_id) {
      await deleteImage(category.image.public_id);
    }
    category.image = await uploadBuffer(req.file.buffer, "categories");
  }

  await category.save();
  res.status(200).json({ success: true, category });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const itemCount = await Item.countDocuments({ category: category._id });
  if (itemCount > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete category that has items. Delete the items first.",
    });
  }

  if (category.image && category.image.public_id) {
    await deleteImage(category.image.public_id);
  }

  await category.deleteOne();
  res.status(200).json({ success: true, message: "Category deleted" });
});
