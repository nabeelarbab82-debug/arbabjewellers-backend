const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Arbab Jewellers",
    },
    logo: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "PKR",
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    emailConfig: {
      service: {
        type: String,
        default: "gmail",
      },
      host: {
        type: String,
        default: "",
      },
      port: {
        type: Number,
        default: 587,
      },
      secure: {
        type: Boolean,
        default: false,
      },
      user: {
        type: String,
        default: "",
      },
      pass: {
        type: String,
        default: "",
      },
      from: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
