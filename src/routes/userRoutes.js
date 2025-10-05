const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { updateUserRoleValidation, updateUserStatusValidation } = require('../validators/userValidators');
const validateRequest = require('../middleware/validateRequest');
const checkDatabaseConnection = require('../middleware/dbCheck');

// Get all users (admin only)
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  checkDatabaseConnection,
  userController.getAllUsers
);

// Get user by ID (admin only)
router.get(
  '/:id',
  authMiddleware,
  adminMiddleware,
  userController.getUserById
);

// Update user role (admin only)
router.put(
  '/:id/role',
  authMiddleware,
  adminMiddleware,
  checkDatabaseConnection,
  updateUserRoleValidation,
  validateRequest,
  userController.updateUserRole
);

// Toggle user active status (admin only)
router.put(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  checkDatabaseConnection,
  updateUserStatusValidation,
  validateRequest,
  userController.updateUserStatus
);

// Delete user (admin only)
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  checkDatabaseConnection,
  userController.deleteUser
);

module.exports = router;
