# Frontend Integration Guide - UploadThing

This guide shows how to integrate UploadThing file uploads in your frontend.

## 📦 Installation

### For React/Next.js Frontend:

```bash
npm install uploadthing @uploadthing/react
```

## 🔧 Configuration Files

### 1. Create `uploadthing.ts` (or `.js`) in your frontend:

```typescript
// src/lib/uploadthing.ts or utils/uploadthing.ts
import { generateComponents } from "@uploadthing/react";

export const { UploadButton, UploadDropzone, Uploader } = generateComponents();
```

### 2. Create environment variables in frontend `.env`:

```env
NEXT_PUBLIC_UPLOADTHING_APP_ID=your_app_id_here
```

## 🎨 Frontend Components

### Simple Upload Button Component:

```tsx
// components/ImageUploader.tsx
"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import axios from "axios";

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key: string;
  type: string;
}

export default function ImageUploader({
  category = "product",
  onUploadComplete,
}: {
  category?: string;
  onUploadComplete?: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleUploadComplete = async (res: any) => {
    try {
      setUploading(true);

      // Save metadata to your backend
      const response = await axios.post(
        "http://localhost:5000/api/upload/save-metadata",
        {
          files: res.map((file: any) => ({
            url: file.url,
            name: file.name,
            size: file.size,
            key: file.key,
            type: file.type,
          })),
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const urls = response.data.files.map((f: any) => f.url);
      setUploadedFiles(response.data.files);

      if (onUploadComplete) {
        onUploadComplete(urls);
      }

      alert("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to save file metadata");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <UploadButton
        endpoint="multipleImagesUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />

      {uploading && <p>Saving file information...</p>}

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-32 object-cover rounded"
              />
              <p className="text-sm truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Dropzone Component:

```tsx
// components/ImageDropzone.tsx
"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import axios from "axios";

export default function ImageDropzone({
  onUploadComplete,
  category = "product",
}: {
  onUploadComplete?: (urls: string[]) => void;
  category?: string;
}) {
  return (
    <UploadDropzone
      endpoint="multipleImagesUploader"
      onClientUploadComplete={async (res) => {
        // Save to backend
        const response = await axios.post(
          "http://localhost:5000/api/upload/save-metadata",
          {
            files: res.map((file) => ({
              url: file.url,
              name: file.name,
              size: file.size,
              key: file.key,
              type: file.type,
            })),
            category,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const urls = response.data.files.map((f: any) => f.url);

        if (onUploadComplete) {
          onUploadComplete(urls);
        }
      }}
      onUploadError={(error: Error) => {
        alert(`Upload failed: ${error.message}`);
      }}
    />
  );
}
```

### Product Form with Image Upload:

```tsx
// components/ProductForm.tsx
"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import axios from "axios";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    nameEn: "",
    nameUr: "",
    nameAr: "",
    descriptionEn: "",
    price: "",
    images: [] as string[],
  });

  const handleImageUpload = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Product created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label>Product Name (English)</label>
        <input
          type="text"
          value={formData.nameEn}
          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label>Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label>Product Images</label>
        <ImageUploader
          category="product"
          onUploadComplete={handleImageUpload}
        />

        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {formData.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Create Product
      </button>
    </form>
  );
}
```

## 🔌 API Endpoints

### Upload Using UploadThing (Direct):

The frontend uploads directly to UploadThing, then saves metadata to your backend.

### Legacy Upload (Through Backend):

```typescript
// Upload through your backend API
const formData = new FormData();
formData.append("images", file);
formData.append("category", "product");

const response = await axios.post(
  "http://localhost:5000/api/upload/images",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Get All Files:

```typescript
const response = await axios.get(
  "http://localhost:5000/api/upload/files?page=1&limit=20&category=product",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Delete File:

```typescript
await axios.delete(`http://localhost:5000/api/upload/${fileId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 🎯 Usage Examples

### 1. Simple Upload Button:

```tsx
<UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    console.log("Files: ", res);
    alert("Upload Completed");
  }}
  onUploadError={(error) => {
    alert(`ERROR! ${error.message}`);
  }}
/>
```

### 2. Upload Dropzone:

```tsx
<UploadDropzone
  endpoint="multipleImagesUploader"
  onClientUploadComplete={(res) => {
    console.log("Files: ", res);
  }}
  onUploadError={(error) => {
    alert(`ERROR! ${error.message}`);
  }}
/>
```

### 3. Custom Upload with Preview:

```tsx
import { useUploadThing } from "@uploadthing/react";

function CustomUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("multipleImagesUploader");

  const handleUpload = async () => {
    const res = await startUpload(files);
    console.log("Uploaded files:", res);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

## 🔐 Authentication

Make sure to include the JWT token in your requests:

```typescript
const token = localStorage.getItem("token");

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

## 🎨 Styling

UploadThing components can be styled using Tailwind CSS or custom CSS:

```tsx
<UploadButton
  endpoint="imageUploader"
  className="ut-button:bg-blue-500 ut-button:hover:bg-blue-600"
  appearance={{
    button: "bg-blue-500 text-white px-4 py-2 rounded",
    allowedContent: "text-gray-600",
  }}
/>
```

## 📱 Response Format

After upload and saving metadata:

```json
{
  "success": true,
  "message": "File metadata saved successfully",
  "count": 2,
  "files": [
    {
      "_id": "65abc123...",
      "filename": "abc123.jpg",
      "originalName": "product.jpg",
      "url": "https://uploadthing.com/f/abc123.jpg",
      "size": 123456,
      "category": "product",
      "uploadedBy": "65xyz...",
      "createdAt": "2026-01-05T..."
    }
  ]
}
```

## 🚀 Quick Start Checklist

- [ ] Install `uploadthing` and `@uploadthing/react`
- [ ] Add `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` to backend `.env`
- [ ] Add `NEXT_PUBLIC_UPLOADTHING_APP_ID` to frontend `.env`
- [ ] Create `uploadthing.ts` utility file in frontend
- [ ] Use `UploadButton` or `UploadDropzone` components
- [ ] Call `/api/upload/save-metadata` after upload
- [ ] Display uploaded images in your UI

## 🔍 Troubleshooting

1. **Upload fails**: Check UploadThing dashboard for rate limits
2. **CORS issues**: UploadThing handles CORS automatically
3. **File size limits**: Default is 4MB, adjust in backend config
4. **Authentication**: Ensure token is included in metadata save request

## 📚 Resources

- UploadThing Docs: https://docs.uploadthing.com/
- UploadThing Dashboard: https://uploadthing.com/dashboard
- API Docs: Your backend at http://localhost:5000/
