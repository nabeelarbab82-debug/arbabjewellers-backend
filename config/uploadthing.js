const { createUploadthing } = require("uploadthing/server");

const f = createUploadthing();

// File router for UploadThing
const uploadRouter = {
  // Image uploader - accepts single image
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // You can add authentication here if needed
      // const admin = req.admin; // from auth middleware

      return {
        userId: req.admin ? req.admin._id : null,
        category: req.body?.category || "other",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Multiple images uploader - accepts up to 10 images
  multipleImagesUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      return {
        userId: req.admin ? req.admin._id : null,
        category: req.body?.category || "other",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Product images uploader
  productImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      return {
        userId: req.admin ? req.admin._id : null,
        category: "product",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Blog images uploader
  blogImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      return {
        userId: req.admin ? req.admin._id : null,
        category: "blog",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

module.exports = { uploadRouter };
