const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserShopingCart", required: true },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String }, // Product image URL
      },
    ],
    shippingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "Pakistan" },
    },
    shippingMethod: {
      name: { type: String, required: true }, // Standard, Express, Overnight
      price: { type: Number, required: true },
      estimatedDays: { type: String, required: true }, // "3-5 days", "1-2 days", "Next day"
    },
    paymentMethod: { 
      type: { type: String, required: true }, // "cash_on_delivery", "card", "bank_transfer"
      enum: ['cash_on_delivery', 'credit_card', 'bank_transfer', 'jazzcash', 'easypaisa'],
      details: { type: Object } // For storing payment specific details
    },
    orderSummary: {
      subtotal: { type: Number, required: true },
      shippingCost: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    trackingNumber: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    notes: { type: String }, // Special instructions from customer
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);