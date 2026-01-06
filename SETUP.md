# Arbab Jewellers Backend - Quick Start Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string
- Email configuration (Gmail recommended)

### 3. Setup Database & Create Admin

```bash
node setupDatabase.js
```

This will create:

- Super Admin account (email: admin@arbabjewellers.com, password: admin123456)
- Default settings
- Default company information

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

### 4. Seed Email Templates

```bash
node seedEmailTemplates.js
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## First Login

1. Use Postman or any API client
2. POST to `http://localhost:5000/api/admin/auth/login`
3. Body:

```json
{
  "email": "admin@arbabjewellers.com",
  "password": "admin123456"
}
```

4. Copy the token from response
5. Use this token in Authorization header for all admin requests:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Change Admin Password

After first login, change your password:

POST to `http://localhost:5000/api/admin/auth/change-password`

```json
{
  "currentPassword": "admin123456",
  "newPassword": "your_new_secure_password"
}
```

## Configure Email Settings

PUT to `http://localhost:5000/api/admin/settings`

```json
{
  "emailConfig": {
    "service": "gmail",
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your-email@gmail.com",
    "pass": "your-app-specific-password",
    "from": "noreply@arbabjewellers.com"
  }
}
```

## Test the API

### Create a Category

POST to `http://localhost:5000/api/categories`

```json
{
  "name": "Rings",
  "description": "Beautiful rings collection",
  "level": 1,
  "isActive": true
}
```

### Create a Product

POST to `http://localhost:5000/api/products`

```json
{
  "name": "Gold Ring",
  "description": "24K Gold Ring",
  "price": 50000,
  "category": "CATEGORY_ID_HERE",
  "stock": 10,
  "isActive": true,
  "isFeatured": true
}
```

### Place an Order (Public - No Auth Required)

POST to `http://localhost:5000/api/orders`

```json
{
  "customerName": "John Doe",
  "email": "customer@example.com",
  "phone": "+92-XXX-XXXXXXX",
  "address": "123 Main St, City",
  "items": [
    {
      "productId": "PRODUCT_ID_HERE",
      "quantity": 1
    }
  ],
  "customerNotes": "Please deliver between 2-5 PM"
}
```

## Common Issues

### Can't connect to MongoDB

- Make sure MongoDB is running
- Check MONGO_URI in .env file

### Emails not sending

- For Gmail, enable 2-factor auth and create app-specific password
- Update emailConfig in settings

### Token expired or invalid

- Login again to get a new token
- Token expires after 30 days by default

## Production Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random string
- [ ] Configure proper email credentials
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS
- [ ] Configure CORS for your frontend domain
- [ ] Set up MongoDB with authentication
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging

## Need Help?

Check README.md for complete API documentation and endpoint details.

---

Happy coding! 🚀
