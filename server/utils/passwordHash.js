/**
 * Password Hashing Utility
 * Secure password hashing and verification using bcryptjs
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hash a password securely
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  try {
    // Validate password
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Generate salt and hash
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);

    return hashed;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} - True if password matches
 */
async function verifyPassword(password, hash) {
  try {
    // Validate inputs
    if (!password || typeof password !== 'string') {
      return false;
    }

    if (!hash || typeof hash !== 'string') {
      return false;
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Check if a string is already hashed
 * @param {string} str - String to check
 * @returns {boolean} - True if string looks like a bcrypt hash
 */
function isHashedPassword(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }
  // Bcrypt hashes start with $2a, $2b, or $2y
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(str);
}

module.exports = {
  hashPassword,
  verifyPassword,
  isHashedPassword
};
