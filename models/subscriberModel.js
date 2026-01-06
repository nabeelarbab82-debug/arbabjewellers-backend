const mongoose = require("mongoose");
const crypto = require("crypto");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    unsubscribeToken: {
      type: String,
      unique: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate tokens before saving
subscriberSchema.pre("save", function (next) {
  if (this.isNew) {
    this.verificationToken = crypto.randomBytes(32).toString("hex");
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// Index for better query performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1 });

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
