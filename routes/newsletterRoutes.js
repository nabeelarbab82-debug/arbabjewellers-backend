const express = require("express");
const router = express.Router();
const {
  subscribe,
  verifySubscription,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
  sendPromotionalEmail,
  sendTestEmail,
  getSubscriberStatistics,
} = require("../controllers/newsletterController");
const { protect } = require("../middleware/authMiddleware");
const {
  subscriberValidation,
  validate,
} = require("../middleware/validationMiddleware");

// Public routes
router.post("/subscribe", subscriberValidation, validate, subscribe);
router.get("/verify/:token", verifySubscription);
router.post("/unsubscribe", unsubscribe);

// Admin routes
router.get("/subscribers", protect, getAllSubscribers);
router.delete("/subscribers/:id", protect, deleteSubscriber);
router.post("/send", protect, sendPromotionalEmail);
router.post("/send-test", protect, sendTestEmail);
router.get("/statistics", protect, getSubscriberStatistics);

module.exports = router;
