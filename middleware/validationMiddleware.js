const { body, param, query, validationResult } = require("express-validator");

// Validation error handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Admin validation rules
exports.adminValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Login validation
exports.loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Category validation
exports.categoryValidation = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("level")
    .isInt({ min: 1, max: 3 })
    .withMessage("Level must be 1, 2, or 3"),
];

// Product validation
exports.productValidation = [
  body("nameEn")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name (English) is required"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),
  body().custom((value, { req }) => {
    // Ensure at least one of name or nameEn is provided
    if (!req.body.name && !req.body.nameEn) {
      throw new Error("Either name or nameEn is required");
    }
    return true;
  }),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number"),
  body("baseCategory")
    .notEmpty()
    .withMessage("Base category is required")
    .isMongoId()
    .withMessage("Invalid base category ID"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one product image is required"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("mainCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid main category ID"),
  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid sub category ID"),
];

// Order validation
exports.orderValidation = [
  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
];

// Contact validation
exports.contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

// Subscriber validation
exports.subscriberValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

// Email template validation
exports.emailTemplateValidation = [
  body("subject").trim().notEmpty().withMessage("Email subject is required"),
  body("htmlContent")
    .trim()
    .notEmpty()
    .withMessage("Email content is required"),
];
