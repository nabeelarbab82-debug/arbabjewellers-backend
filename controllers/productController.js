const Product = require("../models/productModel");
const { generateUniqueSlug } = require("../utils/slugGenerator");
const {
  paginate,
  buildFilterQuery,
  buildSortQuery,
} = require("../utils/helpers");
const mongoose = require("mongoose");

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      mainCategory,
      subCategory,
      baseCategory,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
      featured,
    } = req.query;

    // Build filter query
    const filterQuery = { isActive: true };

    // Apply all provided category filters (cumulative)
    if (mainCategory) {
      filterQuery.mainCategory = new mongoose.Types.ObjectId(mainCategory);
    }
    if (subCategory) {
      filterQuery.subCategory = new mongoose.Types.ObjectId(subCategory);
    }
    if (baseCategory) {
      filterQuery.baseCategory = new mongoose.Types.ObjectId(baseCategory);
    }

    if (featured === "true") filterQuery.isFeatured = true;
    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) filterQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) filterQuery.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Sort
    const sortQuery = {};
    sortQuery[sortBy] = order === "asc" ? 1 : -1;

    // Get products
    const products = await Product.find(filterQuery)
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug")
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Product.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug")
      .limit(parseInt(limit) || 10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve featured products",
      error: error.message,
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await Product.find({ isActive: true })
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug")
      .limit(parseInt(limit) || 10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve new arrivals",
      error: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const products = await Product.find({
      mainCategory: req.params.categoryId,
      isActive: true,
    })
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({
      mainCategory: req.params.categoryId,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const products = await Product.find({
      $text: { $search: q },
      isActive: true,
    })
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug")
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({
      $text: { $search: q },
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { limit } = req.query;

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      baseCategory: product.baseCategory,
      isActive: true,
    })
      .populate("mainCategory", "nameEn nameUr nameAr slug")
      .populate("subCategory", "nameEn nameUr nameAr slug")
      .populate("baseCategory", "nameEn nameUr nameAr slug")
      .limit(parseInt(limit) || 6)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve related products",
      error: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      nameEn,
      nameUr,
      nameAr,
      description,
      descriptionEn,
      descriptionUr,
      descriptionAr,
      price,
      salePrice,
      sku,
      images,
      mainCategory,
      subCategory,
      baseCategory,
      stock,
      isFeatured,
      isActive,
      weight,
      purity,
      material,
      tags,
      metaTitle,
      metaDescription,
    } = req.body;

    // Validate required fields
    if (!nameEn && !name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    if (!baseCategory) {
      return res.status(400).json({
        success: false,
        message: "Base category is required",
      });
    }

    // Validate images array
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Generate slug from name or nameEn
    const slug = await generateUniqueSlug(Product, nameEn || name);

    const product = await Product.create({
      name: name || nameEn,
      nameEn,
      nameUr,
      nameAr,
      description: description || descriptionEn,
      descriptionEn,
      descriptionUr,
      descriptionAr,
      slug,
      price,
      salePrice,
      sku,
      images, // Array of UploadThing URLs
      mainCategory,
      subCategory,
      baseCategory,
      stock: stock || 0,
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
      weight,
      purity,
      material,
      tags,
      metaTitle,
      metaDescription,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      nameEn,
      nameUr,
      nameAr,
      description,
      descriptionEn,
      descriptionUr,
      descriptionAr,
      price,
      salePrice,
      sku,
      images,
      mainCategory,
      subCategory,
      baseCategory,
      stock,
      isFeatured,
      isActive,
      weight,
      purity,
      material,
      tags,
      metaTitle,
      metaDescription,
    } = req.body;

    // Update slug if name changed
    const newName = nameEn || name;
    if (newName && newName !== product.name && newName !== product.nameEn) {
      product.slug = await generateUniqueSlug(Product, newName, product._id);
    }

    if (name !== undefined) product.name = name;
    if (nameEn !== undefined) product.nameEn = nameEn;
    if (nameUr !== undefined) product.nameUr = nameUr;
    if (nameAr !== undefined) product.nameAr = nameAr;
    if (description !== undefined) product.description = description;
    if (descriptionEn !== undefined) product.descriptionEn = descriptionEn;
    if (descriptionUr !== undefined) product.descriptionUr = descriptionUr;
    if (descriptionAr !== undefined) product.descriptionAr = descriptionAr;
    if (price !== undefined) product.price = price;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (sku !== undefined) product.sku = sku;
    // Validate images if provided
    if (
      images !== undefined &&
      (!Array.isArray(images) || images.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    if (images !== undefined) product.images = images;
    if (mainCategory !== undefined) product.mainCategory = mainCategory;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (baseCategory !== undefined) product.baseCategory = baseCategory;
    if (stock !== undefined) product.stock = stock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;
    if (weight !== undefined) product.weight = weight;
    if (purity !== undefined) product.purity = purity;
    if (material !== undefined) product.material = material;
    if (tags !== undefined) product.tags = tags;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      product.metaDescription = metaDescription;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// @desc    Toggle featured status
// @route   PUT /api/admin/products/:id/toggle-featured
// @access  Private (Admin)
exports.toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${
        product.isFeatured ? "featured" : "unfeatured"
      } successfully`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
      error: error.message,
    });
  }
};

// @desc    Update product stock
// @route   PUT /api/admin/products/:id/stock
// @access  Private (Admin)
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update stock",
      error: error.message,
    });
  }
};
