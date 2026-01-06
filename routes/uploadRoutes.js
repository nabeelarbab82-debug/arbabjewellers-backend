const express = require("express");
const router = express.Router();
const {
  uploadImage,
  uploadMultipleImages,
  deleteUploadedFile,
  getAllFiles,
  getFileById,
  saveFileMetadata,
} = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("../config/uploadthing");

// UploadThing routes
router.use(
  "/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
  })
);

// Save file metadata after UploadThing upload
router.post("/save-metadata", saveFileMetadata);

// Legacy upload routes (using UploadThing internally)
router.post("/image", uploadImage);
router.post("/images", uploadMultipleImages);

// Get all files (protected)
router.get("/files", protect, getAllFiles);

// Get single file by ID (public)
router.get("/file/:id", getFileById);

// Delete route (protected) - now uses file ID instead of filename
router.delete("/:id", protect, deleteUploadedFile);

module.exports = router;
