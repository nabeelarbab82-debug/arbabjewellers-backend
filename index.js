const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const contactRoutes = require("./routes/contactRoutes");
const companyRoutes = require("./routes/companyRoutes");
const emailTemplateRoutes = require("./routes/emailTemplateRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// API routes
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/admins", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", categoryRoutes);
app.use("/api/childcategories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/contacts", contactRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin/company", companyRoutes);
app.use("/api/admin/email-templates", emailTemplateRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Arbab Jewellers API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/admin/auth",
      categories: "/api/categories",
      products: "/api/products",
      orders: "/api/orders",
      newsletter: "/api/newsletter",
      contact: "/api/contact",
      company: "/api/company",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
