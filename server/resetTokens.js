const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'resetTokens.json');

function loadTokens() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data) || {};
    }
  } catch (err) {
    console.error('Error loading reset tokens:', err);
  }
  return {};
}

function saveTokens(tokens) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(tokens, null, 2));
  } catch (err) {
    console.error('Error saving reset tokens:', err);
  }
}

/**
 * Store a reset token with expiration (1 hour)
 */
function storeResetToken(email, token) {
  const tokens = loadTokens();
  const expiresAt = Date.now() + 3600000; // 1 hour from now
  
  tokens[token] = {
    email,
    expiresAt,
    used: false
  };
  
  saveTokens(tokens);
  return token;
}

/**
 * Verify a reset token
 */
function verifyResetToken(token) {
  const tokens = loadTokens();
  const tokenData = tokens[token];
  
  if (!tokenData) {
    return { valid: false, error: 'Invalid token' };
  }
  
  if (tokenData.used) {
    return { valid: false, error: 'Token already used' };
  }
  
  if (tokenData.expiresAt < Date.now()) {
    return { valid: false, error: 'Token expired' };
  }
  
  return { valid: true, email: tokenData.email };
}

/**
 * Mark token as used
 */
function invalidateToken(token) {
  const tokens = loadTokens();
  if (tokens[token]) {
    tokens[token].used = true;
    saveTokens(tokens);
  }
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens() {
  const tokens = loadTokens();
  const now = Date.now();
  let cleaned = false;
  
  Object.keys(tokens).forEach(token => {
    if (tokens[token].expiresAt < now) {
      delete tokens[token];
      cleaned = true;
    }
  });
  
  if (cleaned) {
    saveTokens(tokens);
  }
}

module.exports = {
  storeResetToken,
  verifyResetToken,
  invalidateToken,
  cleanupExpiredTokens
};
