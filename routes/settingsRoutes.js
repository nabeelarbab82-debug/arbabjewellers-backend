const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

// Public route for getting settings
router.get("/public", getSettings);

// Protected routes require authentication
router.use(protect);

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
