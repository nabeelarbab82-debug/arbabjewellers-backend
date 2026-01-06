const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      trim: true,
      default: "",
    },
    nameUr: {
      type: String,
      trim: true,
      default: "",
    },
    nameAr: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    descriptionEn: {
      type: String,
      trim: true,
      default: "",
    },
    descriptionUr: {
      type: String,
      trim: true,
      default: "",
    },
    descriptionAr: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    baseCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Base category is required"],
    },
    // Legacy field for backward compatibility
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    childCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    weight: {
      type: String,
      default: "",
    },
    purity: {
      type: String,
      trim: true,
      default: "",
    },
    material: {
      type: String,
      trim: true,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, subcategory: 1, childCategory: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
