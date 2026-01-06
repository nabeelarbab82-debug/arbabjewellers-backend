const EmailTemplate = require("./models/emailTemplateModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const emailTemplates = [
  {
    type: "order-confirmation",
    subject: "Order Confirmed - {{orderNumber}}",
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Arbab Jewellers</h1>
            <h2>Order Confirmation</h2>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Thank you for your order! We have received your order and will process it shortly.</p>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Items:</strong><br>{{items}}</p>
                <p><strong>Total Amount:</strong> {{totalAmount}}</p>
                <p><strong>Delivery Address:</strong><br>{{address}}</p>
            </div>
            
            <p>We will contact you soon to confirm your order and provide delivery details.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Arbab Jewellers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
    variables: [
      { name: "customerName", description: "Customer's name" },
      { name: "orderNumber", description: "Order number" },
      { name: "items", description: "List of ordered items" },
      { name: "totalAmount", description: "Total order amount" },
      { name: "address", description: "Delivery address" },
    ],
    isActive: true,
  },
  {
    type: "order-status-update",
    subject: "Order Status Updated - {{orderNumber}}",
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .status-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .status { font-size: 24px; font-weight: bold; color: #d4af37; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Arbab Jewellers</h1>
            <h2>Order Status Update</h2>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Your order status has been updated.</p>
            
            <div class="status-box">
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p class="status">{{status}}</p>
                <p>{{statusMessage}}</p>
            </div>
            
            <p>Thank you for choosing Arbab Jewellers!</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Arbab Jewellers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
    variables: [
      { name: "customerName", description: "Customer's name" },
      { name: "orderNumber", description: "Order number" },
      { name: "status", description: "Current order status" },
      { name: "statusMessage", description: "Status message" },
    ],
    isActive: true,
  },
  {
    type: "promotional",
    subject: "Special Offer from Arbab Jewellers",
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .cta { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 15px 30px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Arbab Jewellers</h1>
        </div>
        <div class="content">
            <h2>Exclusive Offer Just for You!</h2>
            <p>Dear Valued Customer,</p>
            <p>Add your promotional content here...</p>
            
            <div class="cta">
                <a href="#" class="btn">Shop Now</a>
            </div>
            
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
                If you no longer wish to receive these emails, you can 
                <a href="{{unsubscribeLink}}">unsubscribe here</a>.
            </p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Arbab Jewellers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
    variables: [{ name: "unsubscribeLink", description: "Unsubscribe link" }],
    isActive: true,
  },
  {
    type: "welcome-subscriber",
    subject: "Welcome to Arbab Jewellers Newsletter",
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .cta { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 15px 30px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Arbab Jewellers</h1>
        </div>
        <div class="content">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll be the first to know about:</p>
            <ul>
                <li>New jewelry collections</li>
                <li>Exclusive offers and discounts</li>
                <li>Special events and promotions</li>
                <li>Jewelry care tips</li>
            </ul>
            
            <div class="cta">
                <a href="{{verificationLink}}" class="btn">Verify Your Email</a>
            </div>
            
            <p>Welcome to the Arbab Jewellers family!</p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Arbab Jewellers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
    variables: [
      { name: "email", description: "Subscriber email" },
      { name: "verificationLink", description: "Email verification link" },
    ],
    isActive: true,
  },
];

const seedEmailTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Clear existing templates
    await EmailTemplate.deleteMany({});
    console.log("Existing templates cleared");

    // Insert new templates
    await EmailTemplate.insertMany(emailTemplates);
    console.log("Email templates seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding email templates:", error);
    process.exit(1);
  }
};

seedEmailTemplates();
