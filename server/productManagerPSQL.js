const { query } = require('./database');

/**
 * Get all products or filter by source
 */
async function getAllProducts(source = null) {
  try {
    let sql = 'SELECT * FROM products';
    const params = [];
    
    if (source) {
      sql += ' WHERE source = $1';
      params.push(source);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    return result.rows;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
}

/**
 * Get product by ID
 */
async function getProductById(id) {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error fetching product:', err);
    throw err;
  }
}

/**
 * Get products by source
 */
async function getProductsBySource(source) {
  try {
    const result = await query(
      'SELECT * FROM products WHERE source = $1 ORDER BY created_at DESC',
      [source]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching products by source:', err);
    throw err;
  }
}

/**
 * Add a new product
 */
async function addProduct(product) {
  try {
    const { title, price, category, subtitle = '', image = '', source = 'local', description = '', stock = 0 } = product;
    
    const result = await query(
      `INSERT INTO products (title, price, category, subtitle, image, source, description, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, price, category, subtitle, image, source, description, stock]
    );
    
    return result.rows[0];
  } catch (err) {
    console.error('Error adding product:', err);
    throw err;
  }
}

/**
 * Update a product
 */
async function updateProduct(id, updates) {
  try {
    const allowedFields = ['title', 'price', 'category', 'subtitle', 'image', 'source', 'description', 'stock', 'rating', 'reviews'];
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    
    const result = await query(sql, values);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error updating product:', err);
    throw err;
  }
}

/**
 * Delete a product
 */
async function deleteProduct(id) {
  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
}

/**
 * Search products by title, category, or description
 */
async function searchProducts(query_str) {
  try {
    const searchTerm = `%${query_str}%`;
    const result = await query(
      `SELECT * FROM products 
       WHERE title ILIKE $1 OR category ILIKE $1 OR subtitle ILIKE $1 OR description ILIKE $1
       ORDER BY created_at DESC`,
      [searchTerm]
    );
    return result.rows;
  } catch (err) {
    console.error('Error searching products:', err);
    throw err;
  }
}

/**
 * Get products by category
 */
async function getProductsByCategory(category) {
  try {
    const result = await query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching products by category:', err);
    throw err;
  }
}

/**
 * Get product count by source
 */
async function getProductCountBySource() {
  try {
    const result = await query(
      'SELECT source, COUNT(*) as count FROM products GROUP BY source'
    );
    return result.rows;
  } catch (err) {
    console.error('Error getting product counts:', err);
    throw err;
  }
}

/**
 * Bulk import products
 */
async function bulkImportProducts(products) {
  try {
    const results = [];
    for (const product of products) {
      const imported = await addProduct(product);
      results.push(imported);
    }
    console.log(`✓ Imported ${results.length} products`);
    return results;
  } catch (err) {
    console.error('Error bulk importing products:', err);
    throw err;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsBySource,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getProductCountBySource,
  bulkImportProducts
};
