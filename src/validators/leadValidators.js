const { body } = require('express-validator');

/**
 * Validation rules for lead submission
 */
const createLeadValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

/**
 * Validation rules for updating lead status
 */
const updateLeadStatusValidation = [
  body('status')
    .isIn(['new', 'contacted', 'qualified', 'converted', 'closed'])
    .withMessage('Invalid status value')
];

module.exports = {
  createLeadValidation,
  updateLeadStatusValidation
};
