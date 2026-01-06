const mongoose = require("mongoose");
const Admin = require("./models/adminModel");
const Settings = require("./models/settingsModel");
const Company = require("./models/companyModel");
const dotenv = require("dotenv");

dotenv.config();

const setupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Create super admin
    const adminExists = await Admin.findOne({ role: "superadmin" });
    
    if (!adminExists) {
      const admin = await Admin.create({
        name: "Super Admin",
        email: "admin@arbabjewellers.com",
        password: "admin123456", // Change this password after first login
        role: "superadmin",
      });
      console.log("✓ Super Admin created:");
      console.log("  Email: admin@arbabjewellers.com");
      console.log("  Password: admin123456");
      console.log("  ⚠️  IMPORTANT: Change this password after first login!");
    } else {
      console.log("✓ Super Admin already exists");
    }

    // Create default settings
    const settingsExists = await Settings.findOne();
    
    if (!settingsExists) {
      await Settings.create({
        siteName: "Arbab Jewellers",
        currency: "PKR",
        shippingFee: 200,
        taxRate: 0,
      });
      console.log("✓ Default settings created");
    } else {
      console.log("✓ Settings already exist");
    }

    // Create default company info
    const companyExists = await Company.findOne();
    
    if (!companyExists) {
      await Company.create({
        about: "Welcome to Arbab Jewellers - Your trusted source for fine jewelry.",
        email: "info@arbabjewellers.com",
        phone: "+92-XXX-XXXXXXX",
        address: "Your Address Here",
        workingHours: "Mon-Sat: 10:00 AM - 8:00 PM",
      });
      console.log("✓ Default company information created");
    } else {
      console.log("✓ Company information already exists");
    }

    console.log("\n✅ Database setup completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Update email configuration in Settings via admin panel");
    console.log("2. Run: node seedEmailTemplates.js");
    console.log("3. Start the server: npm start");
    console.log("4. Login with admin credentials and change password");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
};

setupDatabase();
