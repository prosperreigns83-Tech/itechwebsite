const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL Database Connection
 * Configuration: Read from environment variables
 */
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'itech_store'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Query helper - Execute SQL queries
 */
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`✓ Query executed (${duration}ms):`, text.substring(0, 50) + '...');
    return result;
  } catch (err) {
    console.error('✗ Database error:', err.message);
    throw err;
  }
}

/**
 * Initialize database schema (create tables if they don't exist)
 */
async function initializeDatabase() {
  try {
    console.log('Initializing database schema...');
    
    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subtitle TEXT,
        image TEXT,
        source VARCHAR(50) DEFAULT 'local',
        description TEXT,
        stock INT DEFAULT 0,
        rating DECIMAL(3, 2),
        reviews INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Products table ready');
    
    // Create product_sources table for tracking different sources
    await query(`
      CREATE TABLE IF NOT EXISTS product_sources (
        id SERIAL PRIMARY KEY,
        source_name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        api_url TEXT,
        sync_interval INT DEFAULT 3600,
        last_sync TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Product sources table ready');
    
    // Insert default sources if they don't exist
    const sources = ['local', 'aliexpress', 'amazon', 'external'];
    for (const source of sources) {
      await query(
        'INSERT INTO product_sources (source_name) VALUES ($1) ON CONFLICT DO NOTHING',
        [source]
      );
    }
    
    console.log('✓ Database schema initialized successfully');
  } catch (err) {
    console.error('✗ Error initializing database:', err.message);
    throw err;
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('✓ Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  initializeDatabase,
  testConnection
};
