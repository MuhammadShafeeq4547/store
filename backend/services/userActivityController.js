const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Product");
const ActivityLog = require("./ActivityLog");
const { sendWelcomeEmail } = require("../controllers/emailController");
const mongoose = require("mongoose");

// Get all users with filtering and pagination
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      search = "",
      status = "all",
      role = "all",
      dateFilter = "30days",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build the query
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Status filter
    if (status !== "all") {
      if (status === "active") {
        query.isActive = { $ne: false };
      } else if (status === "inactive") {
        query.isActive = false;
      } else if (status === "verified") {
        query.isEmailVerified = true;
      } else if (status === "unverified") {
        query.isEmailVerified = false;
      }
    }

    // Role filter
    if (role !== "all") {
      query.role = role;
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let dateThreshold = new Date();

      switch (dateFilter) {
        case "7days":
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case "30days":
          dateThreshold.setDate(now.getDate() - 30);
          break;
        case "90days":
          dateThreshold.setDate(now.getDate() - 90);
          break;
        case "1year":
          dateThreshold.setFullYear(now.getFullYear() - 1);
          break;
      }

      query.createdAt = { $gte: dateThreshold };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(query)
      .select("-password")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      },
      filters: {
        search,
        status,
        role,
        dateFilter,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

// Get recent users (for dashboard)
exports.getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent users"
    });
  }
};

// Search users (quick search)
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    })
      .select("-password")
      .limit(10);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users"
    });
  }
};

// Get user analytics data
exports.getUserAnalytics = async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.countDocuments();

    // Active users (logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // New users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Verified users
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // User registration trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format registration trend data
    const formattedTrend = registrationTrend.map(item => ({
      date: new Date(item._id.year, item._id.month - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      }),
      users: item.count
    }));

    // User status distribution
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const unverifiedUsers = totalUsers - verifiedUsers;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        verifiedUsers,
        inactiveUsers,
        unverifiedUsers,
        registrationTrend: formattedTrend,
        statusDistribution: [
          { name: "Active", value: activeUsers, color: "#10B981" },
          { name: "Inactive", value: inactiveUsers, color: "#EF4444" },
          { name: "Unverified", value: unverifiedUsers, color: "#F59E0B" }
        ]
      }
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics"
    });
  }
};

// Get detailed statistics about users
exports.getUserStatistics = async (req, res) => {
  try {
    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // User activity metrics
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const avgOrdersPerUser = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avgOrders: { $avg: "$orderCount" }
        }
      }
    ]);

    const avgSpendingPerUser = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$orderSummary.totalAmount" }
        }
      },
      {
        $group: {
          _id: null,
          avgSpending: { $avg: "$totalSpent" }
        }
      }
    ]);

    // User demographics (example)
    const userLocations = await User.aggregate([
      {
        $match: {
          "shippingInfo.country": { $exists: true }
        }
      },
      {
        $group: {
          _id: "$shippingInfo.country",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        activityMetrics: {
          activeUsers,
          percentageActive: (activeUsers / (await User.countDocuments())) * 100,
          avgOrdersPerUser: avgOrdersPerUser[0]?.avgOrders || 0,
          avgSpendingPerUser: avgSpendingPerUser[0]?.avgSpending || 0
        },
        demographics: {
          topLocations: userLocations
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics"
    });
  }
};

// Get detailed information about a specific user
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user basic info
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get user orders
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user reviews
    const reviews = await Review.find({ user: userId })
      .populate("product", "name images")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user activity logs
    const activityLogs = await ActivityLog.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Calculate user statistics
    const orderStats = await Order.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$orderSummary.totalAmount" },
          avgOrderValue: { $avg: "$orderSummary.totalAmount" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        orders,
        reviews,
        activityLogs,
        statistics: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          avgOrderValue: 0
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details"
    });
  }
};

// Update user status (active/inactive)
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Log the status change
    await ActivityLog.create({
      user: userId,
      action: `Account ${isActive ? "activated" : "deactivated"}`,
      details: `User account was ${isActive ? "activated" : "deactivated"} by admin`,
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status"
    });
  }
};

// Send welcome email to user
exports.sendWelcomeEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Log the email sent
    await ActivityLog.create({
      user: userId,
      action: "Welcome email sent",
      details: "Admin triggered welcome email",
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: "Welcome email sent successfully"
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send welcome email"
    });
  }
};

// Get user activity logs
exports.getUserActivityLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const logs = await ActivityLog.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalLogs = await ActivityLog.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs
      }
    });
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs"
    });
  }
};

