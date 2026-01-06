# Product Image Upload Flow - UploadThing Integration

## Overview

This document explains how the product creation flow works with UploadThing image storage integration.

## Architecture

### Flow Diagram

```
Admin User → ProductModal → UploadThing Client → UploadThing CDN
                  ↓              ↓                     ↓
              Frontend API → Backend → Database (Store URLs)
```

## Components

### Frontend Components

#### 1. UploadThing Client Configuration

**File:** `frontend/src/lib/uploadthing.ts`

```typescript
import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: process.env.NEXT_PUBLIC_API_URL + "/upload/uploadthing",
  });
```

#### 2. ProductModal Component

**File:** `frontend/src/components/admin/ProductModal.tsx`

**Key Features:**

- Uses `useUploadThing("productImages")` hook for direct client-side uploads
- Uploads images directly to UploadThing CDN
- Stores returned URLs in product data
- Validates at least one image before product creation
- Saves file metadata to backend for tracking

**Upload Flow:**

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // 1. Get files from input
  const fileArray = Array.from(files);

  // 2. Upload directly to UploadThing
  const uploadedFiles = await startUpload(fileArray);

  // 3. Extract URLs
  const newImageUrls = uploadedFiles.map((file) => file.url);

  // 4. Update form state
  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...newImageUrls],
  }));

  // 5. Save metadata to backend
  await api.post("/upload/save-metadata", {
    files: uploadedFiles,
    category: "product",
  });
};
```

### Backend Components

#### 1. UploadThing Configuration

**File:** `backend/config/uploadthing.js`

Defines upload routes:

- `imageUploader` - Single image (max 4MB)
- `multipleImagesUploader` - Multiple images (max 10, 4MB each)
- `productImages` - Product-specific images (max 10, 4MB each)
- `blogImages` - Blog images (max 5, 4MB each)

#### 2. Upload Controller

**File:** `backend/controllers/uploadController.js`

**Key Endpoints:**

##### POST `/api/upload/save-metadata`

Saves uploaded file metadata to MongoDB after UploadThing upload

```javascript
{
  files: [{ key, name, url, size, type }],
  category: 'product'
}
```

##### POST `/api/upload/uploadthing` (UploadThing handler)

Direct UploadThing endpoint - handles actual file uploads

#### 3. Product Controller

**File:** `backend/controllers/productController.js`

**Create Product:** `POST /api/products`

```javascript
{
  nameEn: "Product Name",
  price: 1000,
  stock: 10,
  images: [
    "https://utfs.io/f/abc123...",
    "https://utfs.io/f/def456..."
  ],
  mainCategory: "category_id",
  subCategory: "subcategory_id",
  baseCategory: "basecategory_id",
  // ... other fields
}
```

**Validation:**

- At least one image required
- Images must be array of URLs
- Base category required
- Price must be positive

#### 4. Product Model

**File:** `backend/models/productModel.js`

```javascript
images: [
  {
    type: String, // UploadThing CDN URLs
  },
];
```

## Setup Instructions

### 1. UploadThing Account Setup

1. Go to [https://uploadthing.com](https://uploadthing.com)
2. Create an account or sign in
3. Create a new app
4. Get your credentials:
   - `UPLOADTHING_SECRET` (starts with `sk_live_...`)
   - `UPLOADTHING_APP_ID`

### 2. Backend Configuration

**Update `.env` file:**

```env
UPLOADTHING_SECRET=sk_live_your_secret_key_here
UPLOADTHING_APP_ID=your_app_id_here
```

**Install dependencies (already done):**

```bash
cd backend
npm install uploadthing
```

### 3. Frontend Configuration

**Update `.env.local` or `.env`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Install dependencies:**

```bash
cd frontend
npm install @uploadthing/react uploadthing
```

### 4. Start the Application

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run dev
```

## Usage Flow

### Creating a Product with Images

1. **Admin logs in** to the admin dashboard
2. **Navigate to Products** section
3. **Click "Add Product"** button
4. **Fill in product details:**

   - Name (English, Urdu, Arabic)
   - Description
   - Price and compare price
   - Stock quantity
   - Weight
   - Purity (e.g., 24K, 22K)
   - Select categories (3-level hierarchy)

5. **Upload Images:**

   - Click on upload area or drag and drop
   - Select multiple images (max 10)
   - Images upload directly to UploadThing
   - Progress shown with uploading state
   - Uploaded images shown as thumbnails
   - Can remove images before saving

6. **Submit Product:**
   - Validates all required fields
   - Ensures at least one image is uploaded
   - Sends product data with UploadThing URLs to backend
   - Backend saves product with image URLs in MongoDB

### Image Storage

**UploadThing CDN URLs format:**

```
https://utfs.io/f/{unique-file-key}
```

**Benefits:**

- Fast global CDN delivery
- Automatic image optimization
- Secure file storage
- No server storage needed
- Built-in file management

## API Endpoints

### Product Management

#### Create Product

```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nameEn": "Gold Ring",
  "price": 50000,
  "stock": 5,
  "images": [
    "https://utfs.io/f/abc123...",
    "https://utfs.io/f/def456..."
  ],
  "mainCategory": "647abc...",
  "subCategory": "647def...",
  "baseCategory": "647ghi...",
  "isFeatured": true
}
```

#### Update Product

```http
PUT /api/products/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nameEn": "Updated Gold Ring",
  "price": 55000,
  "images": [
    "https://utfs.io/f/abc123...",
    "https://utfs.io/f/new456..."
  ]
}
```

#### Get Products

```http
GET /api/products?page=1&limit=12
```

### Upload Management

#### Save File Metadata

```http
POST /api/upload/save-metadata
Content-Type: application/json

{
  "files": [
    {
      "key": "abc123",
      "name": "product-image.jpg",
      "url": "https://utfs.io/f/abc123...",
      "size": 234567,
      "type": "image/jpeg"
    }
  ],
  "category": "product"
}
```

## Image Display

### Frontend Image Utility

**File:** `frontend/src/lib/utils.ts`

The `getImageUrl()` function handles different image URL formats:

```typescript
export function getImageUrl(imagePath: string): string {
  // If already a full URL (UploadThing), return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Legacy: if relative path, construct full URL
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imagePath}`;
}
```

## Error Handling

### Frontend

- Shows toast notifications for upload errors
- Validates file types (images only)
- Disables upload button during upload
- Clears file input after upload
- Validates at least one image on submit

### Backend

- Validates image array exists
- Validates array is not empty
- Returns descriptive error messages
- Logs errors for debugging

## Security

### UploadThing Security

- Middleware validates admin authentication
- File size limits enforced (4MB per file)
- File count limits (max 10 for products)
- Only image files accepted
- Secure CDN URLs with unique keys

### Backend Security

- Admin authentication required for product creation
- JWT token validation
- Input validation and sanitization
- MongoDB injection protection

## Performance Optimization

1. **Image Optimization:**

   - UploadThing automatically optimizes images
   - CDN provides fast global delivery
   - Browser caching enabled

2. **Upload Performance:**

   - Direct client-to-UploadThing upload
   - No backend proxy needed
   - Parallel uploads supported

3. **Frontend Performance:**
   - Next.js Image component for optimization
   - Lazy loading of images
   - Proper image dimensions specified

## Troubleshooting

### Common Issues

#### 1. Upload Fails

**Problem:** Images not uploading
**Solutions:**

- Check UploadThing credentials in `.env`
- Verify file size < 4MB
- Check file type is image
- Ensure admin is authenticated
- Check browser console for errors

#### 2. Images Not Displaying

**Problem:** Images show broken link
**Solutions:**

- Verify UploadThing URLs are valid
- Check `getImageUrl()` function
- Verify CDN is accessible
- Check browser network tab

#### 3. Product Creation Fails

**Problem:** Product not saving
**Solutions:**

- Ensure at least one image uploaded
- Verify all required fields filled
- Check base category selected
- Verify price is positive number
- Check backend logs for errors

## Database Schema

### Product Collection

```javascript
{
  _id: ObjectId,
  nameEn: String,
  nameUr: String,
  nameAr: String,
  slug: String (unique),
  price: Number,
  stock: Number,
  images: [String], // Array of UploadThing URLs
  mainCategory: ObjectId (ref: Category),
  subCategory: ObjectId (ref: Category),
  baseCategory: ObjectId (ref: Category),
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### File Collection (Metadata)

```javascript
{
  _id: ObjectId,
  filename: String, // UploadThing key
  originalName: String,
  url: String, // UploadThing CDN URL
  size: Number,
  mimetype: String,
  category: String,
  uploadedBy: ObjectId (ref: Admin),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Best Practices

1. **Always upload images before saving product**
2. **Use descriptive file names for SEO**
3. **Optimize images before upload (optional, UploadThing also optimizes)**
4. **Store multiple images for different views**
5. **Set featured image as first in array**
6. **Test upload flow in staging before production**
7. **Monitor UploadThing dashboard for usage**
8. **Regular backup of file metadata**

## Future Enhancements

- [ ] Image cropping/resizing in frontend
- [ ] Drag-and-drop image reordering
- [ ] Bulk product upload with CSV
- [ ] Image gallery/library for reuse
- [ ] Automatic alt text generation
- [ ] Image compression before upload
- [ ] Video support for products
- [ ] 360-degree product views

## Support

For issues or questions:

- UploadThing: https://docs.uploadthing.com
- Backend API: Check server logs
- Frontend: Check browser console
- Database: Use MongoDB Compass for inspection
