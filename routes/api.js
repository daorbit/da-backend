const express = require('express');
const router = express.Router();

// Users routes
const usersRouter = express.Router();

usersRouter.get('/', (req, res) => {
  res.json({
    message: 'Users endpoint',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

usersRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `User ${id}`,
    user: { id: parseInt(id), name: 'John Doe', email: 'john@example.com' }
  });
});

usersRouter.post('/', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: 'User created successfully',
    user: { id: Date.now(), name, email }
  });
});

// Auth routes
const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  // Mock authentication
  res.json({
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: { id: 1, email, name: 'Test User' }
  });
});

authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required'
    });
  }

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: Date.now(), name, email }
  });
});

// Data routes
const dataRouter = express.Router();

dataRouter.get('/dashboard', (req, res) => {
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

dataRouter.get('/analytics', (req, res) => {
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

// Mount sub-routers
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/data', dataRouter);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'API test endpoint working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  });
});

module.exports = router;