const express = require('express');
const router = express.Router();

const leadController = require('../controllers/leadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { createLeadValidation, updateLeadStatusValidation } = require('../validators/leadValidators');
const validateRequest = require('../middleware/validateRequest');
const checkDatabaseConnection = require('../middleware/dbCheck');

// Submit a new lead (public endpoint - no authentication required)
router.post(
  '/',
  checkDatabaseConnection,
  createLeadValidation,
  validateRequest,
  leadController.createLead
);

// Get all leads (admin only)
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  checkDatabaseConnection,
  leadController.getAllLeads
);

// Update lead status (admin only)
router.put(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  checkDatabaseConnection,
  updateLeadStatusValidation,
  validateRequest,
  leadController.updateLeadStatus
);

module.exports = router;
