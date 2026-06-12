/**
 * Input Validation Middleware
 * Uses express-validator to sanitize and validate all inputs
 */

const { body, query, validationResult } = require('express-validator');

/**
 * Validation result handler
 * Checks for validation errors and returns them
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for authentication
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateRegister = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and numbers'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  handleValidationErrors
];

/**
 * Validation rules for products
 */
const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('price')
    .trim()
    .matches(/^\$?\d+(\.\d{2})?$/)
    .withMessage('Price must be a valid number'),
  body('category')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Category must be provided'),
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Subtitle must be less than 500 characters'),
  body('source')
    .optional()
    .trim()
    .isIn(['local', 'aliexpress', 'amazon', 'external'])
    .withMessage('Invalid source'),
  handleValidationErrors
];

/**
 * Validation rules for orders
 */
const validateOrder = [
  body('customerName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Customer name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .trim()
    .matches(/^\+?[0-9\s\-()]+$/)
    .withMessage('Invalid phone number'),
  body('address')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('total')
    .matches(/^\$?\d+(\.\d{2})?$/)
    .withMessage('Invalid total amount'),
  handleValidationErrors
];

/**
 * Validation rules for password reset
 */
const validatePasswordReset = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  handleValidationErrors
];

const validateResetPasswordWithToken = [
  body('token')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Invalid token'),
  body('newPassword')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and numbers'),
  handleValidationErrors
];

/**
 * Validation rules for search
 */
const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&]+$/)
    .withMessage('Invalid search characters'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validateProduct,
  validateOrder,
  validatePasswordReset,
  validateResetPasswordWithToken,
  validateSearch,
  handleValidationErrors
};
