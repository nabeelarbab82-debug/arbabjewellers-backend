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
    contactInfo: {
      email: {
        type: String,
        default: "arbabjewellersofficial@gmail.com",
      },
      phone1: {
        type: String,
        default: "0333-5861171",
      },
      phone2: {
        type: String,
        default: "0332-3026222",
      },
      phone3: {
        type: String,
        default: "051-6102658",
      },
      address1: {
        type: String,
        default:
          "Shop No.13-A Opposite Arena Cinema, Phase 4 Bahria Heights 3, Bahria Town Rawalpindi",
      },
      address2: {
        type: String,
        default: "Shop#75, Lalkurti, Rawalpindi Cantt",
      },
      googleMapsUrl: {
        type: String,
        default: "https://share.google/pn1nYXFUmMZ8dbYo7",
      },
    },
    socialMedia: {
      facebook: {
        url: {
          type: String,
          default: "https://web.facebook.com/profile.php?id=61585786391480",
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      instagram: {
        url: {
          type: String,
          default: "https://www.instagram.com/arbab_jeweller/",
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      youtube: {
        url: {
          type: String,
          default: "https://www.youtube.com/channel/UCeLpWAiVC4olmFe0_UiJ_fQ",
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      tiktok: {
        url: {
          type: String,
          default: "https://www.tiktok.com/@arbab_jeweller?lang=en",
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
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
  },
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
