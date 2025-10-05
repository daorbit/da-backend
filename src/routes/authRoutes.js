const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const validateRequest = require('../middleware/validateRequest');
const checkDatabaseConnection = require('../middleware/dbCheck');

// Register/Signup endpoint
router.post(
  '/register',
  checkDatabaseConnection,
  registerValidation,
  validateRequest,
  authController.register
);

// Login endpoint
router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.login
);

// Get current user profile (protected route)
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout endpoint (optional - mainly for client-side token removal)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
