# Arbab Jewellers - Backend API

Complete backend API for Arbab Jewellers jewelry e-commerce website with admin panel, order management, newsletter, and email notifications.

## 🚀 Features

- **Admin Authentication** - JWT-based authentication for admin users
- **3-Level Category System** - Main categories, subcategories, and child categories
- **Product Management** - Full CRUD with images, featured products, stock management
- **Guest Order System** - No customer login required, direct checkout
- **Email Notifications** - Automated order confirmations and status updates
- **Newsletter System** - Email subscription with verification
- **Contact Management** - Contact form submissions with admin responses
- **Dashboard Analytics** - Sales stats, top products, order statistics
- **File Upload** - Image upload for products and categories
- **Email Templates** - Customizable email templates for all communications

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:

   - MongoDB connection string
   - JWT secret
   - Email credentials (Gmail recommended)
   - Frontend URL

5. Seed email templates:

   ```bash
   node seedEmailTemplates.js
   ```

6. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

## 📦 Required npm Packages

```bash
npm install express mongoose dotenv cors body-parser bcryptjs jsonwebtoken express-validator nodemailer multer
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── db.js                    # Database configuration
├── controllers/
│   ├── adminController.js       # Admin CRUD operations
│   ├── authController.js        # Authentication logic
│   ├── categoryController.js    # Category management
│   ├── companyController.js     # Company info management
│   ├── contactController.js     # Contact form handling
│   ├── dashboardController.js   # Dashboard analytics
│   ├── emailTemplateController.js # Email template management
│   ├── newsletterController.js  # Newsletter management
│   ├── orderController.js       # Order management
│   ├── productController.js     # Product CRUD
│   ├── settingsController.js    # Site settings
│   └── uploadController.js      # File upload handling
├── middleware/
│   ├── authMiddleware.js        # JWT authentication
│   ├── errorMiddleware.js       # Error handling
│   └── validationMiddleware.js  # Request validation
├── models/
│   ├── adminModel.js            # Admin schema
│   ├── categoryModel.js         # Category schema
│   ├── companyModel.js          # Company info schema
│   ├── contactModel.js          # Contact schema
│   ├── emailTemplateModel.js    # Email template schema
│   ├── orderModel.js            # Order schema
│   ├── productModel.js          # Product schema
│   ├── settingsModel.js         # Settings schema
│   └── subscriberModel.js       # Newsletter subscriber schema
├── routes/
│   ├── adminRoutes.js           # Admin routes
│   ├── authRoutes.js            # Auth routes
│   ├── categoryRoutes.js        # Category routes
│   ├── companyRoutes.js         # Company routes
│   ├── contactRoutes.js         # Contact routes
│   ├── dashboardRoutes.js       # Dashboard routes
│   ├── emailTemplateRoutes.js   # Email template routes
│   ├── newsletterRoutes.js      # Newsletter routes
│   ├── orderRoutes.js           # Order routes
│   ├── productRoutes.js         # Product routes
│   ├── settingsRoutes.js        # Settings routes
│   └── uploadRoutes.js          # Upload routes
├── utils/
│   ├── emailService.js          # Email sending logic
│   ├── fileUpload.js            # File upload utilities
│   ├── helpers.js               # Helper functions
│   └── slugGenerator.js         # URL slug generator
├── uploads/                     # Uploaded files directory
├── .env.example                 # Environment variables template
├── index.js                     # Main application file
├── package.json                 # Dependencies
└── seedEmailTemplates.js        # Email template seeder
```

## 🔑 API Endpoints

### Admin Authentication

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get admin profile
- `PUT /api/admin/auth/profile` - Update profile
- `PUT /api/admin/auth/change-password` - Change password

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:id/tree` - Get category tree
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders

- `POST /api/orders` - Create order (Guest)
- `GET /api/admin/orders` - Get all orders (Admin)
- `GET /api/admin/orders/:id` - Get order by ID (Admin)
- `PUT /api/admin/orders/:id/status` - Update order status (Admin)
- `GET /api/admin/orders/statistics` - Get order statistics (Admin)

### Newsletter

- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/verify/:token` - Verify subscription
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `GET /api/admin/newsletter/subscribers` - Get subscribers (Admin)
- `POST /api/admin/newsletter/send` - Send promotional email (Admin)

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/admin/contacts` - Get all contacts (Admin)
- `POST /api/admin/contacts/:id/reply` - Reply to inquiry (Admin)

### Dashboard

- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/recent-orders` - Get recent orders
- `GET /api/admin/dashboard/top-products` - Get top products
- `GET /api/admin/dashboard/sales-chart` - Get sales chart data

### File Upload

- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete file (Admin)

## 🔐 Authentication

All admin routes require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Get the token by logging in through `/api/admin/auth/login`

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication in your Google account
2. Generate an app-specific password
3. Use these credentials in `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   ```

## 🎨 Email Templates

Four email templates are included:

1. **Order Confirmation** - Sent when order is placed
2. **Order Status Update** - Sent when order status changes
3. **Promotional Email** - For marketing campaigns
4. **Welcome Subscriber** - Sent to new newsletter subscribers

Templates support variables like `{{customerName}}`, `{{orderNumber}}`, etc.

## 🚦 Initial Setup

### Create First Admin User

```javascript
POST /api/admin/admins
{
  "name": "Super Admin",
  "email": "admin@arbabjewellers.com",
  "password": "securepassword",
  "role": "superadmin"
}
```

Note: This route will need to be temporarily made public or you'll need to create the first admin directly in MongoDB.

### Configure Settings

```javascript
PUT /api/admin/settings
{
  "siteName": "Arbab Jewellers",
  "currency": "PKR",
  "shippingFee": 200,
  "emailConfig": {
    "service": "gmail",
    "user": "your-email@gmail.com",
    "pass": "your-app-password",
    "from": "noreply@arbabjewellers.com"
  }
}
```

## 🐛 Common Issues

### Email Not Sending

- Check email credentials in `.env`
- For Gmail, use app-specific password
- Verify EMAIL_SERVICE and EMAIL_FROM are set

### File Upload Errors

- Ensure `uploads/` directory exists and has write permissions
- Check MAX_FILE_SIZE in `.env`

### Database Connection Failed

- Verify MongoDB is running
- Check MONGO_URI in `.env`

## 📝 Development

Run in development mode with auto-restart:

```bash
npm install -g nodemon
nodemon index.js
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT_SECRET
3. Configure proper CORS origins
4. Use environment-specific MongoDB URI
5. Set up SSL/HTTPS
6. Configure reverse proxy (nginx/apache)

## 📄 License

MIT

## 👥 Support

For support, email support@arbabjewellers.com

---

Made with ❤️ for Arbab Jewellers
