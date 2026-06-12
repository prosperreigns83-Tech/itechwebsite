/**
 * Security Middleware
 * Implements Helmet, CORS, compression, and other security measures
 */

const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const express = require('express');

/**
 * Configure CORS to only allow specific origins
 */
function configureCors(app) {
  const allowedOrigins = [
    'http://localhost:5173',      // Local dev frontend
    'http://localhost:5174',      // Local dev frontend (Vite fallback port)
    'http://localhost:5175',      // additional vite port
    'http://localhost:5176',      // additional vite port (current run)
    'http://localhost:3000',      // Alternative local port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    process.env.FRONTEND_URL || '' // Production frontend URL
  ].filter(Boolean);

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const isLocalDev = /^(https?:\/\/localhost|https?:\/\/127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalDev || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600 // 1 hour
  };

  app.use(cors(corsOptions));
}

/**
 * Configure Helmet for security headers
 */
function configureHelmet(app) {
  app.use(helmet());
  
  // Additional security headers
  app.use((req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Feature policy
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    next();
  });
}

/**
 * Configure compression middleware
 */
function configureCompression(app) {
  app.use(compression({
    level: 6,           // Compression level
    threshold: 10 * 1024, // Only compress responses > 10KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));
}

/**
 * Add request ID to all requests for logging
 */
function addRequestId() {
  return (req, res, next) => {
    req.id = require('uuid').v4();
    res.setHeader('X-Request-ID', req.id);
    next();
  };
}

/**
 * Configure body parser limits to prevent DoS
 */
function configureBodyParser(app) {
  app.use(express.json({ 
    limit: '10mb',
    strict: true,
    type: 'application/json'
  }));
  
  app.use(express.urlencoded({ 
    limit: '10mb',
    extended: true
  }));
}

module.exports = {
  configureCors,
  configureHelmet,
  configureCompression,
  addRequestId,
  configureBodyParser
};
