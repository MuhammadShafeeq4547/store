const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");

// Import email controllers
const {
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
  sendWelcomeEmail,
  sendLowStockAlert,
  sendNewsletter,
  sendCustomEmail,
  getEmailStatistics,
  testEmailConfiguration
} = require('../controllers/emailController');

const router = express.Router();

// ============= EMAIL SYSTEM ADMIN ROUTES =============

// Email statistics and configuration
router.get('/statistics', protect, admin, getEmailStatistics);
router.post('/test-configuration', protect, admin, testEmailConfiguration);

// ============= ORDER-RELATED EMAILS =============
// Send order confirmation email
router.post('/order-confirmation/:orderId', protect, admin, sendOrderConfirmationEmail);

// Send order shipped notification
router.post('/order-shipped/:orderId', protect, admin, sendOrderShippedEmail);

// Send order delivered notification
router.post('/order-delivered/:orderId', protect, admin, sendOrderDeliveredEmail);

// Send order cancellation email
router.post('/order-cancelled/:orderId', protect, admin, sendOrderCancelledEmail);

// ============= CUSTOMER MANAGEMENT EMAILS =============
// Send welcome email to new users
router.post('/welcome/:userId', protect, admin, sendWelcomeEmail);

// ============= INVENTORY & ALERTS =============
// Send low stock alert to admin
router.post('/low-stock-alert', protect, admin, sendLowStockAlert);

// ============= MARKETING EMAILS =============
// Send newsletter to customers
router.post('/newsletter', protect, admin, sendNewsletter);

// Send custom email
router.post('/custom-email', protect, admin, sendCustomEmail);

module.exports = router;