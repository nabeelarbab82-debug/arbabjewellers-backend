const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  updateStock,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const {
  productValidation,
  validate,
} = require("../middleware/validationMiddleware");

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/search", searchProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post("/", protect, productValidation, validate, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id/toggle-featured", protect, toggleFeatured);
router.put("/:id/stock", protect, updateStock);

module.exports = router;
