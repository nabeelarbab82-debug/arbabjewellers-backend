const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getSalesChartData,
  getSubscriberGrowth,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/recent-orders", getRecentOrders);
router.get("/top-products", getTopProducts);
router.get("/sales-chart", getSalesChartData);
router.get("/subscriber-growth", getSubscriberGrowth);

module.exports = router;
