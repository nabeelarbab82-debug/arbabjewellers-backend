# Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Setup
npm install
cp .env.example .env
node setupDatabase.js
node seedEmailTemplates.js

# Run
npm start              # Production
npm run dev           # Development with nodemon
```

## 🔑 Default Credentials

```
Email: admin@arbabjewellers.com
Password: admin123456
```

**⚠️ Change immediately!**

## 📡 Server Info

```
Development: http://localhost:5000
Welcome Page: http://localhost:5000/
API Base: http://localhost:5000/api
```

## 🗂️ Project Structure

```
controllers/  - Business logic (11 files)
models/       - Database schemas (9 files)
routes/       - API endpoints (12 files)
middleware/   - Auth, validation, errors
utils/        - Helpers, email, upload
uploads/      - File storage
```

## 📦 Key Endpoints

### Public (No Auth)

```
GET    /api/categories
GET    /api/products
POST   /api/orders
POST   /api/newsletter/subscribe
POST   /api/contact
GET    /api/company/:section
```

### Admin (Auth Required)

```
POST   /api/admin/auth/login
GET    /api/admin/dashboard/stats
GET    /api/admin/orders
PUT    /api/admin/orders/:id/status
POST   /api/products
PUT    /api/products/:id
```

## 🔐 Authentication

```javascript
// Headers
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

## 📧 Email Templates

```
1. order-confirmation
2. order-status-update
3. promotional
4. welcome-subscriber
```

## 🗄️ Database Collections

```
admins
categories
products
orders
subscribers
emailtemplates
contacts
companies
settings
```

## ⚙️ Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/arbab-jewellers
JWT_SECRET=your_secret
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📝 Common Tasks

### Create Category

```javascript
POST /api/categories
{
  "name": "Rings",
  "level": 1,
  "isActive": true
}
```

### Create Product

```javascript
POST /api/products
{
  "name": "Gold Ring",
  "price": 50000,
  "category": "categoryId",
  "stock": 10
}
```

### Place Order

```javascript
POST /api/orders
{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "address": "123 Main St",
  "items": [{
    "productId": "productId",
    "quantity": 1
  }]
}
```

### Update Order Status

```javascript
PUT /api/admin/orders/:id/status
{
  "status": "confirmed"
}
```

Status: pending → confirmed → processing → ready → completed/cancelled

## 🐛 Troubleshooting

### Server won't start

```bash
# Check MongoDB
mongod --version
# Check Node.js
node --version
# Check logs
npm start
```

### Database connection failed

```bash
# Verify MongoDB is running
# Check MONGO_URI in .env
```

### Email not sending

```bash
# Check email config in .env
# Verify SMTP settings
# Test with Gmail app password
```

### Token invalid

```bash
# Login again to get new token
# Check JWT_SECRET in .env
```

## 📊 Database Commands

```bash
# Backup
mongodump --uri="mongodb://localhost/arbab-jewellers"

# Restore
mongorestore --uri="mongodb://localhost/arbab-jewellers" dump/

# Drop database
mongo arbab-jewellers --eval "db.dropDatabase()"

# Re-setup
node setupDatabase.js
node seedEmailTemplates.js
```

## 🔍 Useful Queries

```javascript
// Find admin
db.admins.findOne({ email: "admin@arbabjewellers.com" });

// Count orders
db.orders.countDocuments({ status: "pending" });

// Get categories
db.categories.find({ level: 1 });

// Get products
db.products.find({ isActive: true });

// Get subscribers
db.subscribers.find({ isActive: true });
```

## 📈 API Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

## 🎯 Testing Checklist

- [ ] Install & setup
- [ ] Admin login works
- [ ] Create category
- [ ] Create product
- [ ] Upload image
- [ ] Place order
- [ ] Email received
- [ ] Newsletter subscription
- [ ] Contact form
- [ ] Dashboard stats

## 📚 Documentation Files

- README.md - Full documentation
- SETUP.md - Setup guide
- API_TESTING.md - All API examples
- DEPLOYMENT.md - Deploy guide
- FEATURES.md - Feature list
- PROJECT_COMPLETE.md - Summary
- QUICK_REFERENCE.md - This file

## 🆘 Need Help?

1. Check logs: `npm start`
2. Verify .env configuration
3. Test MongoDB connection
4. Review API_TESTING.md
5. Check error messages

## 🚀 Production Checklist

- [ ] Strong JWT_SECRET
- [ ] Change admin password
- [ ] Configure email
- [ ] Set NODE_ENV=production
- [ ] Use production MONGO_URI
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Enable backups

---

**Keep this card handy for quick reference!**
