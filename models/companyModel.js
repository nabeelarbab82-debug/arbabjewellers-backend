const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    about: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },
    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
    },
    testimonials: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          default: 5,
        },
        image: {
          type: String,
          default: "",
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    workingHours: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
