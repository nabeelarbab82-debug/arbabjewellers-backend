const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Subscriber = require("../models/subscriberModel");

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get order counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });

    // Calculate revenue
    const revenueData = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get product counts
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 },
      isActive: true,
    });

    // Get subscriber count
    const totalSubscribers = await Subscriber.countDocuments({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
        },
        revenue: {
          total: totalRevenue,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          featured: featuredProducts,
          lowStock: lowStockProducts,
        },
        subscribers: {
          total: totalSubscribers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics",
      error: error.message,
    });
  }
};

// @desc    Get recent orders (Admin)
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private (Admin)
exports.getRecentOrders = async (req, res) => {
  try {
    const { limit } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 10)
      .select("orderNumber customerName email totalAmount status createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve recent orders",
      error: error.message,
    });
  }
};

// @desc    Get top products (Admin)
// @route   GET /api/admin/dashboard/top-products
// @access  Private (Admin)
exports.getTopProducts = async (req, res) => {
  try {
    const { limit } = req.query;

    // Aggregate orders to find top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: parseInt(limit) || 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          name: "$productDetails.name",
          images: "$productDetails.images",
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: topProducts.length,
      products: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve top products",
      error: error.message,
    });
  }
};

// @desc    Get sales chart data (Admin)
// @route   GET /api/admin/dashboard/sales-chart
// @access  Private (Admin)
exports.getSalesChartData = async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'

    let groupBy;
    let startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        };
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["completed", "processing", "ready"] },
        },
      },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve sales chart data",
      error: error.message,
    });
  }
};

// @desc    Get subscriber growth data (Admin)
// @route   GET /api/admin/dashboard/subscriber-growth
// @access  Private (Admin)
exports.getSubscriberGrowth = async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'

    let startDate = new Date();
    let groupBy;

    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" },
        };
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" },
        };
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = {
          $dateToString: { format: "%Y-%m", date: "$subscribedAt" },
        };
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" },
        };
    }

    const subscriberData = await Subscriber.aggregate([
      {
        $match: {
          subscribedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: subscriberData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve subscriber growth data",
      error: error.message,
    });
  }
};
