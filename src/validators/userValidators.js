const { body } = require('express-validator');

/**
 * Validation rules for updating user role
 */
const updateUserRoleValidation = [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Invalid role value')
];

/**
 * Validation rules for updating user status
 */
const updateUserStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

module.exports = {
  updateUserRoleValidation,
  updateUserStatusValidation
};
