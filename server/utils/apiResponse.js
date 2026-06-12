/**
 * Standardized API Response Utility
 * Ensures all API responses follow the same format
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} data - Response data
 * @param {string} message - Response message
 */
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} details - Additional error details
 */
function sendError(res, message, statusCode = 400, details = null) {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  });
}

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Response message
 */
function sendPaginated(res, data, total, page = 1, limit = 10, message = 'Success') {
  const totalPages = Math.ceil(total / limit);
  
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    timestamp: new Date().toISOString()
  });
}

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {Object} data - Created item
 * @param {string} message - Response message
 */
function sendCreated(res, data, message = 'Created successfully') {
  sendSuccess(res, data, message, 201);
}

/**
 * Middleware to attach response helpers to res object
 */
function attachResponseHelpers(req, res, next) {
  res.sendSuccess = (data, message, statusCode) => sendSuccess(res, data, message, statusCode);
  res.sendError = (message, statusCode, details) => sendError(res, message, statusCode, details);
  res.sendPaginated = (data, total, page, limit, message) => sendPaginated(res, data, total, page, limit, message);
  res.sendCreated = (data, message) => sendCreated(res, data, message);
  next();
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  attachResponseHelpers
};
