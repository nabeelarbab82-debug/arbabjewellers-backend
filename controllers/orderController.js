const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Settings = require("../models/settingsModel");
const {
  generateOrderNumber,
  calculateOrderTotals,
} = require("../utils/helpers");
const { sendTemplateEmail } = require("../utils/emailService");
const {
  paginate,
  buildFilterQuery,
  buildSortQuery,
} = require("../utils/helpers");

// @desc    Create order (Guest checkout)
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, items, customerNotes } =
      req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Get settings for shipping fee
    const settings = await Settings.findOne();
    const shippingFee = settings?.shippingFee || 0;

    // Process items and get product details
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const price = product.salePrice > 0 ? product.salePrice : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.images[0] || "",
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate totals
    const { subtotal, totalAmount } = calculateOrderTotals(
      orderItems,
      shippingFee
    );

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await Order.create({
      orderNumber,
      customerName,
      email,
      phone,
      address,
      items: orderItems,
      subtotal,
      shippingFee,
      totalAmount,
      customerNotes,
    });

    // Send confirmation email
    await sendTemplateEmail("order-confirmation", email, {
      customerName,
      orderNumber,
      totalAmount: `Rs. ${totalAmount}`,
      items: orderItems
        .map(
          (item) =>
            `${item.name} x ${item.quantity} = Rs. ${
              item.price * item.quantity
            }`
        )
        .join(", "),
      address,
    });

    // Add email sent record
    order.emailsSent.push({
      type: "order-confirmation",
      sentAt: Date.now(),
    });
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page, limit, status, startDate, endDate, search } = req.query;

    // Build filter query
    const filterQuery = buildFilterQuery({
      status,
      startDate,
      endDate,
    });

    // Add search
    if (search) {
      filterQuery.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const { skip, limit: limitNum } = paginate(page, limit);

    // Get orders
    const orders = await Order.find(filterQuery)
      .populate("items.product", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Order.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private (Admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name slug images")
      .populate("adminNotes.addedBy", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Send status update email
    const statusMessages = {
      pending: "Your order is pending",
      confirmed: "Your order has been confirmed",
      processing: "Your order is being processed",
      ready: "Your order is ready for pickup/delivery",
      completed: "Your order has been completed",
      cancelled: "Your order has been cancelled",
    };

    await sendTemplateEmail("order-status-update", order.email, {
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      status: status.charAt(0).toUpperCase() + status.slice(1),
      statusMessage: statusMessages[status],
    });

    // Add email sent record
    order.emailsSent.push({
      type: "order-status-update",
      sentAt: Date.now(),
    });
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// @desc    Update order
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
exports.updateOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, shippingFee } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (customerName) order.customerName = customerName;
    if (email) order.email = email;
    if (phone) order.phone = phone;
    if (address) order.address = address;
    if (shippingFee !== undefined) {
      order.shippingFee = shippingFee;
      order.totalAmount = order.subtotal + shippingFee;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// @desc    Add admin note
// @route   POST /api/admin/orders/:id/notes
// @access  Private (Admin)
exports.addAdminNote = async (req, res) => {
  try {
    const { note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.adminNotes.push({
      note,
      addedBy: req.admin._id,
      addedAt: Date.now(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message,
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/admin/orders/statistics
// @access  Private (Admin)
exports.getOrderStatistics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $match: { status: { $in: ["completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get status distribution
    const statusDistribution = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        statusDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve statistics",
      error: error.message,
    });
  }
};

// @desc    Send email to customer
// @route   POST /api/admin/orders/:id/send-email
// @access  Private (Admin)
exports.sendOrderEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const { sendEmail } = require("../utils/emailService");
    await sendEmail(order.email, subject, message);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
