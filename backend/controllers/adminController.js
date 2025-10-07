const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// ============= DASHBOARD OVERVIEW =============

// Get admin dashboard data
exports.getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          orderStatus: { $nin: ['cancelled', 'refunded'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderSummary.totalAmount' }
        }
      }
    ]);

    // This week's stats
    const weeklyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          orderStatus: { $nin: ['cancelled', 'refunded'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderSummary.totalAmount' }
        }
      }
    ]);

    // Monthly stats
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: { $nin: ['cancelled', 'refunded'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderSummary.totalAmount' }
        }
      }
    ]);

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activities (latest 10 orders)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('trackingNumber orderStatus orderSummary.totalAmount createdAt shippingInfo.fullName');

    // Low stock products (less than 10 items)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock images price')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        todayStats: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0
        },
        weeklyStats: {
          orders: weeklyOrders,
          revenue: weeklyRevenue[0]?.total || 0
        },
        monthlyStats: {
          orders: monthlyOrders,
          revenue: monthlyRevenue[0]?.total || 0
        },
        totalCounts: {
          users: totalUsers,
          products: totalProducts,
          orders: totalOrders
        },
        orderStatusStats,
        recentOrders,
        lowStockProducts
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data"
    });
  }
};

// ============= ORDER MANAGEMENT =============

// Get orders with advanced filtering
exports.getOrdersWithFilters = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      dateFrom,
      dateTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Search filter
    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { 'shippingInfo.fullName': { $regex: search, $options: 'i' } },
        { 'shippingInfo.email': { $regex: search, $options: 'i' } },
        { 'shippingInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        hasMore: parseInt(page) < Math.ceil(totalOrders / parseInt(limit))
      },
      filters: {
        status,
        dateFrom,
        dateTo,
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders"
    });
  }
};

// Update multiple order fields (admin)
exports.updateOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { 
      orderStatus, 
      trackingNumber, 
      courierService, 
      courierTrackingNumber,
      expectedDeliveryDate,
      notes 
    } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update fields if provided
    if (orderStatus) {
      const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status"
        });
      }
      order.orderStatus = orderStatus;
      
      if (orderStatus === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierService) order.courierService = courierService;
    if (courierTrackingNumber) order.courierTrackingNumber = courierTrackingNumber;
    if (expectedDeliveryDate) order.expectedDeliveryDate = new Date(expectedDeliveryDate);
    if (notes) order.notes = notes;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order
    });

  } catch (error) {
    console.error("Error updating order details:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order details"
    });
  }
};

// Bulk update order status (admin)
exports.bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, status, note } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs are required"
      });
    }

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const updateData = { orderStatus: status };
    
    if (status === "delivered") {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    if (status === "cancelled") {
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = req.user.id;
      updateData.cancellationReason = note || "Bulk cancelled by admin";
    }

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully`,
      data: {
        updated: result.modifiedCount,
        total: orderIds.length
      }
    });

  } catch (error) {
    console.error("Error bulk updating orders:", error);
    res.status(500).json({
      success: false,
      message: "Error updating orders"
    });
  }
};

// ============= REVENUE & ANALYTICS =============

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'month', year = new Date().getFullYear() } = req.query;

    let matchQuery = {
      orderStatus: { $nin: ['cancelled', 'refunded'] },
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${parseInt(year) + 1}-01-01`)
      }
    };

    let groupBy;
    if (period === 'month') {
      groupBy = { $month: '$createdAt' };
    } else if (period === 'week') {
      groupBy = { $week: '$createdAt' };
    } else {
      groupBy = { $dayOfYear: '$createdAt' };
    }

    const revenueData = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$orderSummary.totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$orderSummary.totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          productName: { $first: '$orderItems.name' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueData,
        topProducts,
        period,
        year
      }
    });

  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue analytics"
    });
  }
};

// ============= CUSTOMER MANAGEMENT =============

// Get customer orders and details
exports.getCustomerDetails = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get customer info
    const customer = await User.findById(customerId).select('-password');
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // Get customer's orders
    const orders = await Order.find({ user: customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments({ user: customerId });

    // Customer statistics
    const customerStats = await Order.aggregate([
      { $match: { user: mongoose.Types.ObjectId(customerId) } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$orderSummary.totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$orderSummary.totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        customer,
        orders,
        stats: customerStats[0] || { totalSpent: 0, totalOrders: 0, averageOrderValue: 0 },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / parseInt(limit)),
          totalOrders
        }
      }
    });

  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer details"
    });
  }
};

// ============= REPORTS =============

// Generate sales report
exports.generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    let matchQuery = {
      orderStatus: { $nin: ['cancelled', 'refunded'] }
    };

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    // Sales summary
    const salesSummary = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$orderSummary.totalAmount' },
          totalOrders: { $sum: 1 },
          totalDiscount: { $sum: '$orderSummary.discount' },
          totalShipping: { $sum: '$orderSummary.shippingCost' },
          averageOrderValue: { $avg: '$orderSummary.totalAmount' }
        }
      }
    ]);

    // Daily breakdown
    const dailyBreakdown = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          dailyRevenue: { $sum: '$orderSummary.totalAmount' },
          dailyOrders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Payment method breakdown
    const paymentMethodStats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$paymentMethod.type',
          count: { $sum: 1 },
          revenue: { $sum: '$orderSummary.totalAmount' }
        }
      }
    ]);

    // Shipping method breakdown
    const shippingMethodStats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$shippingMethod.name',
          count: { $sum: 1 },
          revenue: { $sum: '$orderSummary.shippingCost' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: salesSummary[0] || {},
        dailyBreakdown,
        paymentMethodStats,
        shippingMethodStats,
        reportPeriod: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present'
        }
      }
    });

  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({
      success: false,
      message: "Error generating sales report"
    });
  }
};

// Get inventory alerts
exports.getInventoryAlerts = async (req, res) => {
  try {
    // Low stock products (less than 5 items)
    const lowStockProducts = await Product.find({ 
      stock: { $lt: 5, $gt: 0 } 
    }).select('name stock price images category');

    // Out of stock products
    const outOfStockProducts = await Product.find({ 
      stock: { $lte: 0 } 
    }).select('name stock price images category');

    // Products with pending orders but low stock
    const productsWithPendingOrders = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['pending', 'confirmed', 'processing'] }
        }
      },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          pendingQuantity: { $sum: '$orderItems.quantity' },
          productName: { $first: '$orderItems.name' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          $expr: { $lt: ['$product.stock', '$pendingQuantity'] }
        }
      },
      {
        $project: {
          productName: 1,
          currentStock: '$product.stock',
          pendingQuantity: 1,
          shortfall: { $subtract: ['$pendingQuantity', '$product.stock'] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        lowStockProducts,
        outOfStockProducts,
        productsWithPendingOrders,
        alertCounts: {
          lowStock: lowStockProducts.length,
          outOfStock: outOfStockProducts.length,
          pendingShortfall: productsWithPendingOrders.length
        }
      }
    });

  } catch (error) {
    console.error("Error fetching inventory alerts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory alerts"
    });
  }
};

// ============= ORDER TRACKING =============

// Update tracking information
exports.updateTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierService, courierTrackingNumber, expectedDeliveryDate, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update tracking info
    if (courierService) order.courierService = courierService;
    if (courierTrackingNumber) order.courierTrackingNumber = courierTrackingNumber;
    if (expectedDeliveryDate) order.expectedDeliveryDate = new Date(expectedDeliveryDate);
    if (status) order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Tracking information updated successfully",
      data: {
        orderId: order._id,
        trackingNumber: order.trackingNumber,
        courierService: order.courierService,
        courierTrackingNumber: order.courierTrackingNumber,
        expectedDeliveryDate: order.expectedDeliveryDate,
        status: order.orderStatus
      }
    });

  } catch (error) {
    console.error("Error updating tracking info:", error);
    res.status(500).json({
      success: false,
      message: "Error updating tracking information"
    });
  }
};

// ============= EXPORT FUNCTIONS =============

// Export orders to CSV (basic implementation)
exports.exportOrders = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let query = {};
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 });

    // Format data for CSV
    const csvData = orders.map(order => ({
      orderNumber: order.trackingNumber,
      customerName: order.shippingInfo.fullName,
      customerEmail: order.shippingInfo.email,
      customerPhone: order.shippingInfo.phone,
      totalAmount: order.orderSummary.totalAmount,
      status: order.orderStatus,
      paymentMethod: order.paymentMethod.type,
      shippingMethod: order.shippingMethod.name,
      orderDate: order.createdAt.toISOString().split('T')[0],
      itemCount: order.orderItems.length
    }));

    res.status(200).json({
      success: true,
      data: csvData,
      message: `${csvData.length} orders exported successfully`
    });

  } catch (error) {
    console.error("Error exporting orders:", error);
    res.status(500).json({
      success: false,
      message: "Error exporting orders"
    });
  }
};