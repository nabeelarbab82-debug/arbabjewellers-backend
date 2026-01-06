const express = require("express");
const router = express.Router();
const {
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  loginValidation,
  validate,
} = require("../middleware/validationMiddleware");

// Public routes
router.post("/login", loginValidation, validate, login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);

module.exports = router;
