/**
 * Database Migration Script
 * Run this ONCE to import existing products from JSON to PostgreSQL
 * 
 * Usage: node migrate-to-postgresql.js
 */

const fs = require('fs');
const path = require('path');
const { initializeDatabase, testConnection } = require('./database');
const { bulkImportProducts } = require('./productManagerPSQL');

async function migrateProducts() {
  try {
    console.log('🔄 Starting migration to PostgreSQL...\n');
    
    // Step 1: Test database connection
    console.log('Step 1: Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database. Make sure PostgreSQL is running.');
    }
    console.log('✓ Database connection successful\n');
    
    // Step 2: Initialize schema
    console.log('Step 2: Creating tables and schema...');
    await initializeDatabase();
    console.log('✓ Schema initialized\n');
    
    // Step 3: Load products from JSON
    console.log('Step 3: Loading products from JSON file...');
    const productsFile = path.join(__dirname, 'products.json');
    if (!fs.existsSync(productsFile)) {
      console.warn('⚠️  products.json not found. No products to import.');
      return;
    }
    
    const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    let allProducts = [];
    
    for (const [source, products] of Object.entries(productsData)) {
      if (Array.isArray(products)) {
        allProducts = allProducts.concat(
          products.map(p => ({ ...p, source: source }))
        );
      }
    }
    
    console.log(`✓ Loaded ${allProducts.length} products from JSON\n`);
    
    // Step 4: Import to PostgreSQL
    console.log('Step 4: Importing products to PostgreSQL...');
    if (allProducts.length > 0) {
      await bulkImportProducts(allProducts);
      console.log('✓ All products imported\n');
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📝 Note: You can now use productManagerPSQL.js for database operations');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Make sure PostgreSQL is installed and running');
    console.error('2. Check that DB_USER and DB_PASSWORD in .env match your PostgreSQL credentials');
    console.error('3. Make sure the database "itech_store" exists (or create it with: CREATE DATABASE itech_store;)');
    process.exit(1);
  }
}

// Run migration
migrateProducts();
