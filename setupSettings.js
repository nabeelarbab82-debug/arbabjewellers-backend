const mongoose = require("mongoose");
const Settings = require("./models/settingsModel");
require("dotenv").config();

const setupSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected...");

    // Check if settings already exist
    let settings = await Settings.findOne();

    const settingsData = {
      siteName: "Arbab Jewellers",
      currency: "PKR",
      shippingFee: 0,
      taxRate: 0,
      emailConfig: {
        service: process.env.EMAIL_SERVICE || "gmail",
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true" || false,
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "",
      },
    };

    if (settings) {
      // Update existing settings
      settings = await Settings.findByIdAndUpdate(settings._id, settingsData, {
        new: true,
      });
      console.log("✅ Settings updated successfully");
    } else {
      // Create new settings
      settings = await Settings.create(settingsData);
      console.log("✅ Settings created successfully");
    }

    console.log("\n📧 Email Configuration:");
    console.log(`   Service: ${settings.emailConfig.service}`);
    console.log(`   Host: ${settings.emailConfig.host}`);
    console.log(`   Port: ${settings.emailConfig.port}`);
    console.log(`   User: ${settings.emailConfig.user}`);
    console.log(`   From: ${settings.emailConfig.from}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up settings:", error);
    process.exit(1);
  }
};

setupSettings();
