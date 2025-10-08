const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes")
const passwordRoutes = require('./routes/passwordRoutes');

dotenv.config();

const app = express();

// CORS aur Middleware
app.use(cors());
// app.use(cors({
//   origin: '*',
//   methods: ['GET','POST','PUT','DELETE'],
//   credentials: true
// }));

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ✅ ROOT ENDPOINT - YAHI HEALTH CHECK HAI (Railway yahi check karega)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is healthy and running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'MERN Ecommerce Backend'
  });
});

// ✅ ALAG HEALTH ENDPOINT (optional)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Health check endpoint',
    timestamp: new Date().toISOString()
  });
});

// Database connection
connectDB().catch(err => {
  console.error('Database connection error:', err);
});

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use("/api/orders", orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', passwordRoutes);

// ✅ Static files (agar frontend build hai to)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ Catch-all route for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;

// ✅ Server start
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Root endpoint (Health check): http://0.0.0.0:${PORT}/`);
  console.log(`🌍 Health endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`🚀 Server ready!`);
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});