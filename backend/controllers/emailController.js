const nodemailer = require('nodemailer');
const Order = require("../models/Order");
const User = require("../models/User"); // Updated to match your user model
const Product = require("../models/Product");

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// ============= EMAIL TEMPLATES =============

const emailTemplates = {
  orderConfirmation: (order, customer) => ({
    subject: `Order Confirmation - ${order.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${customer.name || order.shippingInfo.fullName},</p>
        <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.trackingNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.orderSummary.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.type}</p>
        </div>

        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Shipping Address</h3>
          <p>${order.shippingInfo.fullName}<br>
          ${order.shippingInfo.address}<br>
          ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}<br>
          ${order.shippingInfo.country}</p>
        </div>

        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Order Items</h3>
          ${order.orderItems.map(item => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: $${item.price}</p>
              <p>Subtotal: $${item.quantity * item.price}</p>
            </div>
          `).join('')}
        </div>

        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>Your Store Team</p>
      </div>
    `
  }),

  orderShipped: (order, trackingInfo) => ({
    subject: `Your Order Has Shipped - ${order.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Order Has Shipped!</h2>
        <p>Dear ${order.shippingInfo.fullName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> ${order.trackingNumber}</p>
          <p><strong>Courier Service:</strong> ${trackingInfo.courierService || 'Standard Shipping'}</p>
          <p><strong>Tracking Number:</strong> ${trackingInfo.courierTrackingNumber || 'Will be updated soon'}</p>
          <p><strong>Expected Delivery:</strong> ${trackingInfo.expectedDeliveryDate ? new Date(trackingInfo.expectedDeliveryDate).toLocaleDateString() : 'Within 3-5 business days'}</p>
        </div>

        <p>You can track your package using the tracking number provided above.</p>
        <p>Best regards,<br>Your Store Team</p>
      </div>
    `
  }),

  orderDelivered: (order) => ({
    subject: `Order Delivered - ${order.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Delivered Successfully!</h2>
        <p>Dear ${order.shippingInfo.fullName},</p>
        <p>Your order has been delivered successfully!</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Delivery Details</h3>
          <p><strong>Order Number:</strong> ${order.trackingNumber}</p>
          <p><strong>Delivered On:</strong> ${new Date(order.deliveredAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.orderSummary.totalAmount}</p>
        </div>

        <p>We hope you're satisfied with your purchase. If you have any issues, please contact our support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>Your Store Team</p>
      </div>
    `
  }),

  orderCancelled: (order, reason) => ({
    subject: `Order Cancelled - ${order.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Cancellation Notice</h2>
        <p>Dear ${order.shippingInfo.fullName},</p>
        <p>We regret to inform you that your order has been cancelled.</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Cancellation Details</h3>
          <p><strong>Order Number:</strong> ${order.trackingNumber}</p>
          <p><strong>Cancelled On:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Reason:</strong> ${reason || 'Administrative decision'}</p>
          <p><strong>Refund Amount:</strong> $${order.orderSummary.totalAmount}</p>
        </div>

        <p>If payment was processed, a full refund will be issued within 3-5 business days.</p>
        <p>We apologize for any inconvenience caused.</p>
        <p>Best regards,<br>Your Store Team</p>
      </div>
    `
  }),

  welcomeEmail: (user) => ({
    subject: 'Welcome to Our Store!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Store!</h2>
        <p>Dear ${user.name},</p>
        <p>Welcome to our online store! We're excited to have you as part of our community.</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Your Account Details</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Account Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <p>You can now browse our products, add items to your wishlist, and enjoy exclusive member benefits.</p>
        <p>Happy shopping!</p>
        <p>Best regards,<br>Your Store Team</p>
      </div>
    `
  }),

  lowStockAlert: (products) => ({
    subject: 'Low Stock Alert - Immediate Attention Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Low Stock Alert</h2>
        <p>The following products are running low on stock and need immediate attention:</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Low Stock Products</h3>
          ${products.map(product => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>${product.name}</strong></p>
              <p>Current Stock: <span style="color: #d32f2f; font-weight: bold;">${product.stock}</span></p>
              <p>Price: $${product.price}</p>
            </div>
          `).join('')}
        </div>

        <p>Please restock these items as soon as possible to avoid stockouts.</p>
        <p>Admin Dashboard Team</p>
      </div>
    `
  }),

  newsletterTemplate: (subject, content, products = []) => ({
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <div style="margin: 20px 0;">
          ${content}
        </div>
        
        ${products.length > 0 ? `
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Featured Products</h3>
          ${products.map(product => `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center;">
              <div style="flex: 1;">
                <h4 style="margin: 0;">${product.name}</h4>
                <p style="margin: 5px 0; color: #666;">${product.description || 'Premium quality product'}</p>
                <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #2e7d32;">$${product.price}</p>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <p>Best regards,<br>Your Store Team</p>
      </div>
    `
  })
};

// ============= EMAIL FUNCTIONS =============

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const customer = order.user || { name: order.shippingInfo.fullName };
    const emailTemplate = emailTemplates.orderConfirmation(order, customer);

    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: order.shippingInfo.email || order.user?.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    res.status(200).json({
      success: true,
      message: "Order confirmation email sent successfully"
    });

  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending order confirmation email"
    });
  }
};

// Send order shipped email
exports.sendOrderShippedEmail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierService, courierTrackingNumber, expectedDeliveryDate } = req.body;

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const trackingInfo = {
      courierService,
      courierTrackingNumber,
      expectedDeliveryDate
    };

    const emailTemplate = emailTemplates.orderShipped(order, trackingInfo);
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: order.shippingInfo.email || order.user?.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    res.status(200).json({
      success: true,
      message: "Order shipped email sent successfully"
    });

  } catch (error) {
    console.error("Error sending order shipped email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending order shipped email"
    });
  }
};

// Send order delivered email
exports.sendOrderDeliveredEmail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const emailTemplate = emailTemplates.orderDelivered(order);
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: order.shippingInfo.email || order.user?.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    res.status(200).json({
      success: true,
      message: "Order delivered email sent successfully"
    });

  } catch (error) {
    console.error("Error sending order delivered email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending order delivered email"
    });
  }
};

// Send order cancelled email
exports.sendOrderCancelledEmail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const emailTemplate = emailTemplates.orderCancelled(order, reason);
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: order.shippingInfo.email || order.user?.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    res.status(200).json({
      success: true,
      message: "Order cancellation email sent successfully"
    });

  } catch (error) {
    console.error("Error sending order cancellation email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending order cancellation email"
    });
  }
};

// Send welcome email to new users
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

    const emailTemplate = emailTemplates.welcomeEmail(user);
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    res.status(200).json({
      success: true,
      message: "Welcome email sent successfully"
    });

  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending welcome email"
    });
  }
};

// Send low stock alert to admin
exports.sendLowStockAlert = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;

    const lowStockProducts = await Product.find({ 
      stock: { $lt: parseInt(threshold), $gt: 0 } 
    }).select('name stock price');

    if (lowStockProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No low stock products found"
      });
    }

    const emailTemplate = emailTemplates.lowStockAlert(lowStockProducts);
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });

    res.status(200).json({
      success: true,
      message: `Low stock alert sent for ${lowStockProducts.length} products`
    });

  } catch (error) {
    console.error("Error sending low stock alert:", error);
    res.status(500).json({
      success: false,
      message: "Error sending low stock alert"
    });
  }
};

// Send newsletter to customers
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, content, userSegment = 'all', productIds = [] } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required"
      });
    }

    let users = [];
    
    // Get users based on segment
    if (userSegment === 'all') {
      users = await User.find().select('email name'); // Removed role filter since your model might not have roles
    } else if (userSegment === 'active') {
      // Users who have placed orders in last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const activeUserIds = await Order.distinct('user', {
        createdAt: { $gte: threeMonthsAgo }
      });
      
      users = await User.find({ 
        _id: { $in: activeUserIds }
      }).select('email name');
    }

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users found for the selected segment"
      });
    }

    // Get featured products if provided
    let featuredProducts = [];
    if (productIds.length > 0) {
      featuredProducts = await Product.find({ 
        _id: { $in: productIds } 
      }).select('name price description images');
    }

    const emailTemplate = emailTemplates.newsletterTemplate(subject, content, featuredProducts);
    const transporter = createTransporter();

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send emails in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (user) => {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html
          });
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          emailsFailed++;
        }
      });

      await Promise.all(emailPromises);
      
      // Add delay between batches
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.status(200).json({
      success: true,
      message: "Newsletter sent successfully",
      data: {
        totalUsers: users.length,
        emailsSent,
        emailsFailed
      }
    });

  } catch (error) {
    console.error("Error sending newsletter:", error);
    res.status(500).json({
      success: false,
      message: "Error sending newsletter"
    });
  }
};

// Send custom email
exports.sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, content, isHtml = true } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: "To, subject, and content are required"
      });
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: subject
    };

    if (isHtml) {
      mailOptions.html = content;
    } else {
      mailOptions.text = content;
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Custom email sent successfully"
    });

  } catch (error) {
    console.error("Error sending custom email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending custom email"
    });
  }
};

// Get email statistics
exports.getEmailStatistics = async (req, res) => {
  try {
    // This would require implementing email tracking
    // For now, return basic stats
    const totalUsers = await User.countDocuments(); // Removed role filter
    const totalOrders = await Order.countDocuments();
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const activeUsers = await Order.distinct('user', {
      createdAt: { $gte: threeMonthsAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCustomers: totalUsers,
        activeCustomers: activeUsers.length,
        totalOrders: totalOrders,
        // These would come from email tracking implementation
        emailsSentThisMonth: 0,
        emailsOpenedThisMonth: 0,
        emailsClickedThisMonth: 0
      }
    });

  } catch (error) {
    console.error("Error fetching email statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching email statistics"
    });
  }
};

// Test email configuration
exports.testEmailConfiguration = async (req, res) => {
  try {
    const { testEmail = process.env.ADMIN_EMAIL } = req.body;

    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: testEmail,
      subject: 'Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Configuration Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p>If you receive this email, your SMTP settings are configured properly.</p>
          <p>Test sent at: ${new Date().toLocaleString()}</p>
          <p>Best regards,<br>Your Store Team</p>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: "Test email sent successfully"
    });

  } catch (error) {
    console.error("Error testing email configuration:", error);
    res.status(500).json({
      success: false,
      message: "Error testing email configuration",
      error: error.message
    });
  }
};