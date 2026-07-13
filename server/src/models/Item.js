const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: "" },
      },
    ],
    brand: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
    },
    condition: {
      type: String,
      enum: ["new", "like-new", "excellent", "good", "fair", "poor"],
      default: "good",
    },
    authenticityCertificate: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
