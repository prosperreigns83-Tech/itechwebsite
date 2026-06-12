# PostgreSQL Database Setup Guide

## Overview
This guide helps you set up PostgreSQL for the iTech Store application.

## Prerequisites
- Windows 10/11
- Administrator access

---

## Installation Steps

### 1. Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click the **latest version** (e.g., PostgreSQL 16)
3. Download the installer

### 2. Install PostgreSQL

1. Run the installer
2. Follow the wizard:
   - **Installation Directory**: C:\Program Files\PostgreSQL\16 (default)
   - **Password**: Remember this! Use `postgres` for development
   - **Port**: 5432 (default)
   - **Locale**: [your locale]
3. **Uncheck Stack Builder** (optional components)
4. Click **Finish**

### 3. Verify Installation

Open PowerShell and run:
```bash
psql --version
```

You should see: `psql (PostgreSQL) 16.x`

### 4. Create Database & User

Open **pgAdmin** (automatically installed) or use PowerShell:

```bash
# Login as postgres
psql -U postgres

# Create database
CREATE DATABASE itech_store;

# View databases
\l

# Exit
\q
```

### 5. Verify Connection

```bash
psql -U postgres -d itech_store -h localhost
```

---

## Configuration in iTech Store

### Update `.env` file

The following is already in `server/.env`:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itech_store
```

**If you used different credentials during installation, update these values.**

### Install Dependencies

```bash
cd server
npm install pg
```

---

## Running Migrations

### First Time Setup

This imports your existing products from `products.json` to PostgreSQL:

```bash
cd server
node migrate-to-postgresql.js
```

**Expected Output:**
```
🔄 Starting migration to PostgreSQL...

Step 1: Testing database connection...
✓ Database connection successful

Step 2: Creating tables and schema...
✓ Products table ready
✓ Product sources table ready
✓ Database schema initialized successfully

Step 3: Loading products from JSON file...
✓ Loaded 4 products from JSON

Step 4: Importing products to PostgreSQL...
✓ Imported 4 products

✅ Migration completed successfully!
```

---

## Using the Database

### Start the Backend

```bash
cd server
npm start
```

The backend will automatically:
1. Connect to PostgreSQL
2. Use `productManagerPSQL.js` for all product operations
3. Serve the API on `http://localhost:4000`

### API Endpoints (Same as Before)

```bash
# Get all products
GET /api/products

# Get products by source
GET /api/products?source=local

# Search products
GET /api/products/search?q=smartwatch

# Add product
POST /api/products

# Update product
PUT /api/products/:id

# Delete product
DELETE /api/products/:id
```

---

## Troubleshooting

### Error: "connect ECONNREFUSED"
- **Issue**: PostgreSQL not running
- **Fix**: 
  ```bash
  # Windows
  # Services > PostgreSQL service > Start
  # OR in PowerShell (as Admin):
  net start postgresql-x64-16
  ```

### Error: "password authentication failed"
- **Issue**: Wrong password in `.env`
- **Fix**: Update `DB_PASSWORD` in `.env` to match your PostgreSQL password

### Error: "database itech_store does not exist"
- **Issue**: Database not created
- **Fix**:
  ```bash
  psql -U postgres -c "CREATE DATABASE itech_store;"
  ```

### Error: "psql: command not found"
- **Issue**: PostgreSQL not in PATH
- **Fix**: Add to PATH:
  1. Settings > Environment Variables
  2. Add: `C:\Program Files\PostgreSQL\16\bin`
  3. Restart PowerShell

---

## Database Schema

### Products Table
```sql
CREATE TABLE products (
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
);
```

### Product Sources Table
```sql
CREATE TABLE product_sources (
  id SERIAL PRIMARY KEY,
  source_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  api_url TEXT,
  sync_interval INT DEFAULT 3600,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create `itech_store` database
3. ✅ Run migration: `node migrate-to-postgresql.js`
4. ✅ Start backend: `npm start`
5. ✅ Test API with: `GET http://localhost:4000/api/products`

---

## Files Created

- `database.js` - PostgreSQL connection & initialization
- `productManagerPSQL.js` - Database operations
- `migrate-to-postgresql.js` - Data migration script
- Updated `.env` - Database credentials

---

Need help? Check the error messages - they usually tell you what's wrong!
