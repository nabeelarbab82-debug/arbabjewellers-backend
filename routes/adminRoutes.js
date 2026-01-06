const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  adminValidation,
  validate,
} = require("../middleware/validationMiddleware");

// All routes require authentication and super admin role
router.use(protect);
router.use(authorize("superadmin"));

router.get("/", getAllAdmins);
router.post("/", adminValidation, validate, createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
