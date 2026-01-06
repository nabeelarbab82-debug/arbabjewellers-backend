const express = require("express");
const router = express.Router();
const {
  getCompanyInfo,
  getCompanyInfoAdmin,
  updateCompany,
  updateAbout,
  updateContact,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/:section", getCompanyInfo);

// Admin routes - Unified endpoint for create/update
router
  .route("/")
  .get(protect, getCompanyInfoAdmin) // GET all company info for admin
  .put(protect, updateCompany); // PUT create or update company info

// Admin routes - Specific sections (kept for backward compatibility)
router.put("/about", protect, updateAbout);
router.put("/contact", protect, updateContact);
router.post("/testimonials", protect, addTestimonial);
router.put("/testimonials/:id", protect, updateTestimonial);
router.delete("/testimonials/:id", protect, deleteTestimonial);

module.exports = router;
