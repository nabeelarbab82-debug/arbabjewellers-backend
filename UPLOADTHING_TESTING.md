# UploadThing API Testing Guide

## 🔧 Setup

1. **Get UploadThing Credentials:**

   - Go to https://uploadthing.com/
   - Sign up and create a new app
   - Copy your `Secret Key` and `App ID`
   - Add them to `.env`:
     ```env
     UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
     UPLOADTHING_APP_ID=xxxxxxxxxxxxx
     ```

2. **Restart your server:**
   ```bash
   npm start
   ```

## 📤 Test Upload Endpoints

### Method 1: Upload via Backend API (with file parsing)

```bash
curl -X POST http://localhost:5000/api/upload/images \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "category=product"
```

### Method 2: Save Metadata After Frontend Upload

After your frontend uploads to UploadThing directly, save the metadata:

```bash
curl -X POST http://localhost:5000/api/upload/save-metadata \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "files": [
      {
        "url": "https://utfs.io/f/abc123.jpg",
        "name": "product-image.jpg",
        "size": 245760,
        "key": "abc123",
        "type": "image/jpeg"
      }
    ],
    "category": "product"
  }'
```

### Get All Uploaded Files

```bash
curl -X GET "http://localhost:5000/api/upload/files?page=1&limit=20&category=product" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Single File

```bash
curl -X GET http://localhost:5000/api/upload/file/FILE_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete File

```bash
curl -X DELETE http://localhost:5000/api/upload/FILE_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Response Examples

### Successful Upload:

```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "count": 2,
  "urls": ["https://utfs.io/f/abc123.jpg", "https://utfs.io/f/def456.jpg"],
  "files": [
    {
      "_id": "65abc...",
      "filename": "abc123",
      "originalName": "product.jpg",
      "mimetype": "image/jpeg",
      "size": 245760,
      "url": "https://utfs.io/f/abc123.jpg",
      "uploadedBy": "65xyz...",
      "category": "product",
      "createdAt": "2026-01-05T...",
      "updatedAt": "2026-01-05T..."
    }
  ]
}
```

### Get Files Response:

```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "files": [
    {
      "_id": "65abc...",
      "filename": "abc123",
      "originalName": "product.jpg",
      "url": "https://utfs.io/f/abc123.jpg",
      "size": 245760,
      "category": "product",
      "uploadedBy": {
        "_id": "65xyz...",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2026-01-05T..."
    }
  ]
}
```

## 🧪 Testing with Postman

### 1. Upload Images:

- Method: `POST`
- URL: `http://localhost:5000/api/upload/images`
- Headers:
  - `Authorization`: `Bearer YOUR_JWT_TOKEN`
- Body: `form-data`
  - Key: `images`, Type: `File` (select multiple files)
  - Key: `category`, Type: `Text`, Value: `product`

### 2. Save Metadata:

- Method: `POST`
- URL: `http://localhost:5000/api/upload/save-metadata`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer YOUR_JWT_TOKEN`
- Body (raw JSON):
  ```json
  {
    "files": [
      {
        "url": "https://utfs.io/f/abc123.jpg",
        "name": "test.jpg",
        "size": 245760,
        "key": "abc123",
        "type": "image/jpeg"
      }
    ],
    "category": "product"
  }
  ```

## 🔐 Getting JWT Token

First, login to get your token:

```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { ... }
}
```

Use the token in subsequent requests.

## ✅ Integration Checklist

- [ ] UploadThing account created
- [ ] Environment variables added to `.env`
- [ ] Server restarted
- [ ] JWT token obtained via login
- [ ] Test upload endpoint with curl/Postman
- [ ] Verify files appear in UploadThing dashboard
- [ ] Test metadata save endpoint
- [ ] Test file retrieval endpoints
- [ ] Test file deletion
- [ ] Frontend integration completed

## 🐛 Common Issues

### 1. "Upload failed" Error

- Check UploadThing credentials in `.env`
- Verify UploadThing dashboard for API limits
- Check file size (max 4MB by default)

### 2. "No files uploaded" Error

- Ensure field name is `images` in form-data
- Check Content-Type header
- Verify file is properly attached

### 3. "Unauthorized" Error

- Check JWT token is valid
- Verify Authorization header format: `Bearer TOKEN`
- Token may have expired (check JWT_EXPIRE in .env)

### 4. Files uploaded but not in database

- Check MongoDB connection
- Verify File model exists
- Check server logs for database errors

## 📊 File Categories

Available categories:

- `product` - Product images
- `blog` - Blog post images
- `company` - Company/about page images
- `other` - General uploads

## 🎯 Best Practices

1. **Always specify category** when uploading
2. **Store UploadThing URLs** in your database (not local paths)
3. **Delete from both UploadThing and database** when removing files
4. **Use authentication** for upload endpoints in production
5. **Validate file types and sizes** on frontend before upload
6. **Optimize images** before upload to save bandwidth

## 🚀 Production Deployment

When deploying to production:

1. Use production UploadThing credentials
2. Update CORS settings in UploadThing dashboard
3. Add production domain to allowed origins
4. Use HTTPS for all requests
5. Implement rate limiting for upload endpoints
6. Monitor UploadThing usage in dashboard
