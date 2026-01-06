# API Testing Guide - Postman Collection

## Setup

1. Create a new environment in Postman
2. Add these variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: (will be set after login)

## Authentication Tests

### 1. Admin Login

```
POST {{baseUrl}}/api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@arbabjewellers.com",
  "password": "admin123456"
}
```

**Save the token from response to use in other requests**

### 2. Get Admin Profile

```
GET {{baseUrl}}/api/admin/auth/profile
Authorization: Bearer {{token}}
```

### 3. Update Profile

```
PUT {{baseUrl}}/api/admin/auth/profile
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Updated Admin Name"
}
```

### 4. Change Password

```
PUT {{baseUrl}}/api/admin/auth/change-password
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "currentPassword": "admin123456",
  "newPassword": "newSecurePassword123"
}
```

## Category Management

### 5. Create Main Category

```
POST {{baseUrl}}/api/categories
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Rings",
  "description": "Beautiful rings collection",
  "level": 1,
  "isActive": true,
  "order": 1
}
```

### 6. Create Subcategory

```
POST {{baseUrl}}/api/categories
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Gold Rings",
  "description": "Gold rings subcategory",
  "level": 2,
  "parentCategory": "MAIN_CATEGORY_ID_HERE",
  "isActive": true
}
```

### 7. Get All Categories

```
GET {{baseUrl}}/api/categories
```

### 8. Get Category Tree

```
GET {{baseUrl}}/api/categories/CATEGORY_ID/tree
```

## Product Management

### 9. Create Product

```
POST {{baseUrl}}/api/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "24K Gold Ring",
  "description": "Beautiful 24K gold ring with traditional design",
  "price": 50000,
  "salePrice": 45000,
  "sku": "GR-001",
  "category": "CATEGORY_ID",
  "stock": 10,
  "isFeatured": true,
  "isActive": true,
  "weight": "5g",
  "material": "24K Gold",
  "tags": ["gold", "ring", "traditional"]
}
```

### 10. Get All Products

```
GET {{baseUrl}}/api/products?page=1&limit=20
```

### 11. Get Featured Products

```
GET {{baseUrl}}/api/products/featured?limit=10
```

### 12. Search Products

```
GET {{baseUrl}}/api/products/search?q=gold
```

### 13. Update Product

```
PUT {{baseUrl}}/api/products/PRODUCT_ID
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "price": 55000,
  "stock": 15
}
```

### 14. Toggle Featured

```
PUT {{baseUrl}}/api/products/PRODUCT_ID/toggle-featured
Authorization: Bearer {{token}}
```

## Order Management

### 15. Create Order (Public - No Auth)

```
POST {{baseUrl}}/api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "address": "123 Main Street, Lahore, Pakistan",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 1
    }
  ],
  "customerNotes": "Please call before delivery"
}
```

### 16. Get All Orders (Admin)

```
GET {{baseUrl}}/api/admin/orders?page=1&limit=20&status=pending
Authorization: Bearer {{token}}
```

### 17. Get Order Details

```
GET {{baseUrl}}/api/admin/orders/ORDER_ID
Authorization: Bearer {{token}}
```

### 18. Update Order Status

```
PUT {{baseUrl}}/api/admin/orders/ORDER_ID/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Status options:** pending, confirmed, processing, ready, completed, cancelled

### 19. Add Admin Note

```
POST {{baseUrl}}/api/admin/orders/ORDER_ID/notes
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "note": "Customer confirmed delivery address"
}
```

### 20. Get Order Statistics

```
GET {{baseUrl}}/api/admin/orders/statistics
Authorization: Bearer {{token}}
```

## Newsletter Management

### 21. Subscribe to Newsletter (Public)

```
POST {{baseUrl}}/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

### 22. Verify Subscription (Public)

```
GET {{baseUrl}}/api/newsletter/verify/VERIFICATION_TOKEN
```

### 23. Get All Subscribers (Admin)

```
GET {{baseUrl}}/api/admin/newsletter/subscribers
Authorization: Bearer {{token}}
```

### 24. Send Promotional Email (Admin)

```
POST {{baseUrl}}/api/admin/newsletter/send
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "subject": "Special Discount - 20% Off!",
  "htmlContent": "<h1>Special Offer</h1><p>Get 20% off on all gold jewelry!</p><a href='{{unsubscribeLink}}'>Unsubscribe</a>"
}
```

### 25. Send Test Email (Admin)

```
POST {{baseUrl}}/api/admin/newsletter/send-test
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "email": "test@example.com",
  "subject": "Test Email",
  "htmlContent": "<h1>Test</h1><p>This is a test email</p>"
}
```

## Contact Management

### 26. Submit Contact Form (Public)

```
POST {{baseUrl}}/api/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+92-300-1234567",
  "subject": "Product Inquiry",
  "message": "I want to know more about your gold rings collection"
}
```

### 27. Get All Contacts (Admin)

```
GET {{baseUrl}}/api/admin/contacts?status=new
Authorization: Bearer {{token}}
```

### 28. Reply to Contact (Admin)

```
POST {{baseUrl}}/api/admin/contacts/CONTACT_ID/reply
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "replyMessage": "Thank you for your inquiry. We will send you our catalog."
}
```

## Company Information

### 29. Get Company Info (Public)

```
GET {{baseUrl}}/api/company/about
GET {{baseUrl}}/api/company/contact
GET {{baseUrl}}/api/company/testimonials
```

### 30. Update About Section (Admin)

```
PUT {{baseUrl}}/api/admin/company/about
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "about": "Arbab Jewellers has been serving customers since 1990..."
}
```

### 31. Update Contact Info (Admin)

```
PUT {{baseUrl}}/api/admin/company/contact
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "email": "info@arbabjewellers.com",
  "phone": "+92-42-12345678",
  "address": "123 Mall Road, Lahore",
  "whatsapp": "+92-300-1234567",
  "socialLinks": {
    "facebook": "https://facebook.com/arbabjewellers",
    "instagram": "https://instagram.com/arbabjewellers"
  },
  "workingHours": "Mon-Sat: 10 AM - 8 PM"
}
```

### 32. Add Testimonial (Admin)

```
POST {{baseUrl}}/api/admin/company/testimonials
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Sarah Ahmed",
  "text": "Excellent quality and service!",
  "rating": 5
}
```

## Dashboard & Analytics

### 33. Get Dashboard Stats (Admin)

```
GET {{baseUrl}}/api/admin/dashboard/stats
Authorization: Bearer {{token}}
```

### 34. Get Recent Orders (Admin)

```
GET {{baseUrl}}/api/admin/dashboard/recent-orders?limit=10
Authorization: Bearer {{token}}
```

### 35. Get Top Products (Admin)

```
GET {{baseUrl}}/api/admin/dashboard/top-products?limit=5
Authorization: Bearer {{token}}
```

### 36. Get Sales Chart Data (Admin)

```
GET {{baseUrl}}/api/admin/dashboard/sales-chart?period=month
Authorization: Bearer {{token}}
```

**Period options:** week, month, year

## Settings Management

### 37. Get Settings (Admin)

```
GET {{baseUrl}}/api/admin/settings
Authorization: Bearer {{token}}
```

### 38. Update Settings (Admin)

```
PUT {{baseUrl}}/api/admin/settings
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "siteName": "Arbab Jewellers",
  "currency": "PKR",
  "shippingFee": 200,
  "taxRate": 0,
  "emailConfig": {
    "service": "gmail",
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your-email@gmail.com",
    "pass": "your-app-password",
    "from": "noreply@arbabjewellers.com"
  }
}
```

## Email Templates

### 39. Get All Templates (Admin)

```
GET {{baseUrl}}/api/admin/email-templates
Authorization: Bearer {{token}}
```

### 40. Get Template by Type (Admin)

```
GET {{baseUrl}}/api/admin/email-templates/order-confirmation
Authorization: Bearer {{token}}
```

### 41. Update Template (Admin)

```
PUT {{baseUrl}}/api/admin/email-templates/order-confirmation
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "subject": "Order Confirmed - {{orderNumber}}",
  "htmlContent": "<html>Your customized template here</html>",
  "isActive": true
}
```

## File Upload

### 42. Upload Single Image

```
POST {{baseUrl}}/api/upload/image
Content-Type: multipart/form-data
Form Data:
  - image: [select file]
```

### 43. Upload Multiple Images

```
POST {{baseUrl}}/api/upload/images
Content-Type: multipart/form-data
Form Data:
  - images: [select multiple files]
```

### 44. Delete File (Admin)

```
DELETE {{baseUrl}}/api/upload/FILENAME
Authorization: Bearer {{token}}
```

## Admin Management (Super Admin Only)

### 45. Create New Admin

```
POST {{baseUrl}}/api/admin/admins
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@arbabjewellers.com",
  "password": "securePassword123",
  "role": "admin"
}
```

### 46. Get All Admins

```
GET {{baseUrl}}/api/admin/admins
Authorization: Bearer {{token}}
```

### 47. Update Admin

```
PUT {{baseUrl}}/api/admin/admins/ADMIN_ID
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "isActive": false
}
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Common Query Parameters

- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search term
- `status` - Filter by status
- `category` - Filter by category ID
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

---

**Note:** Remember to replace placeholders like `PRODUCT_ID`, `CATEGORY_ID`, `ORDER_ID`, etc. with actual IDs from your database.
