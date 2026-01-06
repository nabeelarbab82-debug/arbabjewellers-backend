const Category = require("../models/categoryModel");

// Helper function to build category tree
const buildCategoryTree = async (parentId = null) => {
  const categories = await Category.find({
    parent: parentId,
    isActive: true,
  }).sort({ order: 1, nameEn: 1 });

  const tree = await Promise.all(
    categories.map(async (category) => {
      const children = await buildCategoryTree(category._id);
      return {
        _id: category._id,
        nameEn: category.nameEn,
        nameUr: category.nameUr,
        nameAr: category.nameAr,
        slug: category.slug,
        descriptionEn: category.descriptionEn,
        descriptionUr: category.descriptionUr,
        descriptionAr: category.descriptionAr,
        image: category.image,
        level: category.level,
        parent: category.parent,
        order: category.order,
        children: children.length > 0 ? children : undefined,
      };
    })
  );

  return tree;
};

// @desc    Get all categories in tree structure
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const tree = await buildCategoryTree();

    res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get categories by level
// @route   GET /api/categories/by-level/:level
// @access  Public
exports.getCategoriesByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const { parent } = req.query;

    const query = { level: parseInt(level), isActive: true };
    if (parent) query.parent = parent;

    const categories = await Category.find(query)
      .populate("parent", "nameEn nameUr nameAr")
      .sort({ order: 1, nameEn: 1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parent",
      "nameEn nameUr nameAr level"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get children if not base level
    let children = [];
    if (category.level < 3) {
      children = await Category.find({
        parent: category._id,
        isActive: true,
      }).sort({ order: 1, nameEn: 1 });
    }

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        children,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const {
      nameEn,
      nameUr,
      nameAr,
      descriptionEn,
      descriptionUr,
      descriptionAr,
      parent,
      level,
      image,
      order,
    } = req.body;

    // Validate level based on parent
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
      if (parentCategory.level >= 3) {
        return res.status(400).json({
          success: false,
          message: "Cannot create subcategory under base category (level 3)",
        });
      }
      if (level !== parentCategory.level + 1) {
        return res.status(400).json({
          success: false,
          message: `Level must be ${parentCategory.level + 1} for this parent`,
        });
      }
    } else if (level !== 1) {
      return res.status(400).json({
        success: false,
        message: "Top level categories must be level 1",
      });
    }

    // Generate slug
    const slug = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await Category.create({
      nameEn,
      nameUr,
      nameAr,
      descriptionEn,
      descriptionUr,
      descriptionAr,
      slug,
      parent: parent || null,
      level,
      image,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const {
      nameEn,
      nameUr,
      nameAr,
      descriptionEn,
      descriptionUr,
      descriptionAr,
      image,
      order,
      isActive,
    } = req.body;

    if (nameEn) category.nameEn = nameEn;
    if (nameUr !== undefined) category.nameUr = nameUr;
    if (nameAr !== undefined) category.nameAr = nameAr;
    if (descriptionEn !== undefined) category.descriptionEn = descriptionEn;
    if (descriptionUr !== undefined) category.descriptionUr = descriptionUr;
    if (descriptionAr !== undefined) category.descriptionAr = descriptionAr;
    if (image !== undefined) category.image = image;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    // Update slug if name changed
    if (nameEn && nameEn !== category.nameEn) {
      category.slug = nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has children
    const childrenCount = await Category.countDocuments({
      parent: category._id,
    });
    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category with subcategories. Delete subcategories first.",
      });
    }

    // Check if products exist in this category
    const Product = require("../models/productModel");
    const productsCount = await Product.countDocuments({
      $or: [
        { mainCategory: category._id },
        { subCategory: category._id },
        { baseCategory: category._id },
      ],
    });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productsCount} product(s) are using this category.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
