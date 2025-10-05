const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const leadRoutes = require('./leadRoutes');

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/leads', leadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    }
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'API test endpoint working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!(process.env.MONGODB_URI || process.env.DA_DATABASE_URL_MONGODB_URI),
      mongooseReady: mongoose.connection.readyState === 1
    }
  });
});

// Legacy data routes (for backward compatibility)
router.get('/data/dashboard', (req, res) => {
  res.json({
    message: 'Dashboard data',
    data: {
      totalUsers: 150,
      totalOrders: 45,
      revenue: 12500,
      growthRate: 15.2
    }
  });
});

router.get('/data/analytics', (req, res) => {
  res.json({
    message: 'Analytics data',
    analytics: {
      pageViews: 1250,
      uniqueVisitors: 890,
      bounceRate: 32.5,
      avgSessionDuration: '2m 45s'
    }
  });
});

module.exports = router;
