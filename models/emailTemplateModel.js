const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "order-confirmation",
        "order-status-update",
        "promotional",
        "welcome-subscriber",
      ],
    },
    subject: {
      type: String,
      required: [true, "Email subject is required"],
      trim: true,
    },
    htmlContent: {
      type: String,
      required: [true, "Email content is required"],
    },
    variables: [
      {
        name: String,
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

module.exports = EmailTemplate;
