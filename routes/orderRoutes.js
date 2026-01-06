const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  addAdminNote,
  getOrderStatistics,
  sendOrderEmail,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const {
  orderValidation,
  validate,
} = require("../middleware/validationMiddleware");

// Public route
router.post("/", orderValidation, validate, createOrder);

// Admin routes
router.get("/", protect, getAllOrders);
router.get("/statistics", protect, getOrderStatistics);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);
router.post("/:id/notes", protect, addAdminNote);
router.post("/:id/send-email", protect, sendOrderEmail);

module.exports = router;
