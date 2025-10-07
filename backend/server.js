import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ ES6 modules ke liye __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS Configuration - Railway ke liye important
app.use(cors({
  origin: ['https://your-frontend-domain.railway.app', 'http://localhost:3000'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ✅ IMPROVED HEALTH CHECK - Railway yahi check karega
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: '🚀 Server is running perfectly!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    service: 'MERN Ecommerce Backend'
  });
});

// ✅ ALTERNATE HEALTH ENDPOINT
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: '✅ Health check passed',
    timestamp: new Date().toISOString(),
    database: 'connected', // Agar database connected hai to
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Database connection
connectDB().then(() => {
  console.log('✅ Database connected successfully');
}).catch(err => {
  console.error('❌ Database connection error:', err);
});

// API Routes
app.use('/api/users', (await import('./routes/userRoutes.js')).default);
app.use('/api/products', (await import('./routes/productRoutes.js')).default);
app.use('/api/cart', (await import('./routes/cartRoutes.js')).default);
app.use("/api/orders", (await import('./routes/orderRoutes.js')).default);
app.use('/api/admin', (await import('./routes/adminRoutes.js')).default);
app.use('/api/users', (await import('./routes/passwordRoutes.js')).default);

// ✅ Static files - Frontend build serve karna
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ Catch-all route for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;

// ✅ Server start - Railway ko 0.0.0.0 pe listen karna important hai
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://0.0.0.0:${PORT}/`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
});

// ✅ Error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});