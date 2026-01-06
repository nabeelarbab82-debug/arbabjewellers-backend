const express = require("express");
const router = express.Router();
const {
  getAllTemplates,
  getTemplateByType,
  updateTemplate,
  previewTemplate,
} = require("../controllers/emailTemplateController");
const { protect } = require("../middleware/authMiddleware");
const {
  emailTemplateValidation,
  validate,
} = require("../middleware/validationMiddleware");

// All routes require authentication
router.use(protect);

router.get("/", getAllTemplates);
router.get("/:type", getTemplateByType);
router.put("/:type", emailTemplateValidation, validate, updateTemplate);
router.post("/preview", previewTemplate);

module.exports = router;
