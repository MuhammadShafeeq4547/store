const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");

// Import order controllers
const {
  getAllOrders,
  updateOrderStatus,
  getOrderStatistics
} = require("../controllers/orderController");

// Import admin controllers
const {
  getDashboardOverview,
  getOrdersWithFilters,
  updateOrderDetails,
  bulkUpdateOrderStatus,
  getRevenueAnalytics,
  getCustomerDetails,
  generateSalesReport,
  getInventoryAlerts,
  updateTrackingInfo,
  exportOrders
} = require("../controllers/adminController");

const router = express.Router();

// ============= DASHBOARD =============
// Admin dashboard overview
router.get("/dashboard", protect, admin, getDashboardOverview);

// Order statistics
router.get("/statistics", protect, admin, getOrderStatistics);

// Inventory alerts
router.get("/inventory-alerts", protect, admin, getInventoryAlerts);

// ============= ORDER MANAGEMENT =============
// Get all orders with advanced filtering
router.get("/orders", protect, admin, getOrdersWithFilters);

// Get single order details
router.get("/orders/:id", protect, admin, getAllOrders);

// Update order status
router.put("/orders/:id/status", protect, admin, updateOrderStatus);

// Update complete order details
router.put("/orders/:id/details", protect, admin, updateOrderDetails);

// Update tracking information
router.put("/orders/:id/tracking", protect, admin, updateTrackingInfo);

// Bulk update order status
router.put("/orders/bulk-update", protect, admin, bulkUpdateOrderStatus);

// ============= ANALYTICS & REPORTS =============
// Revenue analytics
router.get("/analytics/revenue", protect, admin, getRevenueAnalytics);

// Generate sales report
router.get("/reports/sales", protect, admin, generateSalesReport);

// Export orders
router.get("/export/orders", protect, admin, exportOrders);

// ============= CUSTOMER MANAGEMENT =============
// Get customer details and order history
router.get("/customers/:customerId", protect, admin, getCustomerDetails);

module.exports = router;