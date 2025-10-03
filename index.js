const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const connectDB = async () => {
  try {
    // Support both environment variable names for backward compatibility
    const mongoUri = process.env.MONGODB_URI || process.env.DA_DATABASE_URL_MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('🔗 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 MongoDB URI exists:', !!mongoUri);
    console.error('🌍 Environment:', process.env.NODE_ENV);
    
    // In production, don't exit but still log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Continuing without database connection in production mode');
    }
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔥 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Middleware
app.use(helmet()); // Security headers

// CORS configuration
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // More permissive CORS for development
  app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
  }));
} else {
  // Restrictive CORS for production
  const allowedOrigins = [
    'https://da-admin-five.vercel.app', // Production frontend
    'https://da-admin.vercel.app', // Alternative production URL
    process.env.FRONTEND_URL // Environment variable override
  ].filter(Boolean);

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
  }));
}

app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'DA Admin Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;