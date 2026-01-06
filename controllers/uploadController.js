const File = require("../models/fileModel");
const { UTApi } = require("uploadthing/server");

// Initialize UploadThing API
const utapi = new UTApi();

// @desc    Save uploaded file metadata from UploadThing
// @route   POST /api/upload/save-metadata
// @access  Public/Private
exports.saveFileMetadata = async (req, res) => {
  try {
    const { files, category } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file data provided",
      });
    }

    // Save all file metadata to MongoDB
    const fileRecords = await Promise.all(
      files.map((file) =>
        File.create({
          filename: file.key || file.name,
          originalName: file.name,
          mimetype: file.type || "image/jpeg",
          size: file.size,
          path: file.url,
          url: file.url,
          uploadedBy: req.admin ? req.admin._id : null,
          category: category || "other",
        })
      )
    );

    res.status(200).json({
      success: true,
      message: "File metadata saved successfully",
      count: fileRecords.length,
      files: fileRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save file metadata",
      error: error.message,
    });
  }
};

// @desc    Upload single image using UploadThing (legacy endpoint for compatibility)
// @route   POST /api/upload/image
// @access  Public/Private
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = Array.isArray(req.files.images)
      ? req.files.images[0]
      : req.files.images;

    // Upload to UploadThing
    const uploadedFiles = await utapi.uploadFiles([file]);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    const uploadedFile = uploadedFiles[0];

    // Save file metadata to MongoDB
    const fileRecord = await File.create({
      filename: uploadedFile.data.key,
      originalName: file.name,
      mimetype: file.mimetype || "image/jpeg",
      size: file.size,
      path: uploadedFile.data.url,
      url: uploadedFile.data.url,
      uploadedBy: req.admin ? req.admin._id : null,
      category: req.body.category || "other",
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: uploadedFile.data.url,
      file: fileRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

// @desc    Upload multiple images using UploadThing
// @route   POST /api/upload/images
// @access  Public/Private
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Upload to UploadThing
    const uploadedFiles = await utapi.uploadFiles(files);

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    // Save all file metadata to MongoDB
    const fileRecords = await Promise.all(
      uploadedFiles.map((uploadedFile, index) =>
        File.create({
          filename: uploadedFile.data.key,
          originalName: files[index].name,
          mimetype: files[index].mimetype || "image/jpeg",
          size: files[index].size,
          path: uploadedFile.data.url,
          url: uploadedFile.data.url,
          uploadedBy: req.admin ? req.admin._id : null,
          category: req.body.category || "other",
        })
      )
    );

    const fileUrls = fileRecords.map((record) => record.url);

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      count: fileRecords.length,
      urls: fileUrls,
      files: fileRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

// @desc    Get all uploaded files
// @route   GET /api/upload/files
// @access  Private (Admin)
exports.getAllFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const files = await File.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await File.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: files.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

// @desc    Get single file by ID
// @route   GET /api/upload/file/:id
// @access  Public
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch file",
      error: error.message,
    });
  }
};

// @desc    Delete file from UploadThing and database
// @route   DELETE /api/upload/:id
// @access  Private (Admin)
exports.deleteUploadedFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found in database",
      });
    }

    // Delete from UploadThing using the file key
    try {
      await utapi.deleteFiles(file.filename);
    } catch (uploadThingError) {
      console.error("UploadThing deletion error:", uploadThingError);
      // Continue even if UploadThing deletion fails
    }

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};
