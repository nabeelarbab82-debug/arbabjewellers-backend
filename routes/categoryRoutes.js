const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  getCategoriesByLevel,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllCategories);
router.get("/by-level/:level", getCategoriesByLevel);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
