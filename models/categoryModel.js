const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
      required: [true, "Category name (English) is required"],
      trim: true,
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
    image: {
      type: String,
      default: "",
    },
    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // 1=Main Category (Diamond), 2=Sub Category (Men/Women), 3=Base Category (Ring/Bracelet)
      default: 1,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for children
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Index for better query performance
categorySchema.index({ level: 1, parent: 1 });
categorySchema.index({ slug: 1 });

// Pre-save middleware to generate slug
categorySchema.pre("save", async function (next) {
  if (this.isModified("nameEn") && !this.slug) {
    this.slug = this.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
