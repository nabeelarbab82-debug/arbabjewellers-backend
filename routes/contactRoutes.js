const express = require("express");
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  replyToContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");
const {
  contactValidation,
  validate,
} = require("../middleware/validationMiddleware");

// Public route
router.post("/", contactValidation, validate, submitContact);

// Admin routes
router.get("/", protect, getAllContacts);
router.get("/:id", protect, getContactById);
router.put("/:id/status", protect, updateContactStatus);
router.post("/:id/reply", protect, replyToContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
