const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

/**
 * Load all products from the JSON file
 */
function loadAllProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      return { local: [], aliexpress: [], amazon: [], external: [] };
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading products:', err);
    return { local: [], aliexpress: [], amazon: [], external: [] };
  }
}

/**
 * Get all products from all sources combined
 */
function getAllProducts(source = null) {
  const allProducts = loadAllProducts();
  
  if (source) {
    return allProducts[source] || [];
  }
  
  // Combine all sources
  return [
    ...allProducts.local,
    ...allProducts.aliexpress,
    ...allProducts.amazon,
    ...allProducts.external
  ];
}

/**
 * Get products by source
 */
function getProductsBySource(source) {
  const allProducts = loadAllProducts();
  return allProducts[source] || [];
}

/**
 * Add a product to a specific source
 */
function addProductToSource(source, product) {
  try {
    const allProducts = loadAllProducts();
    
    if (!allProducts[source]) {
      allProducts[source] = [];
    }
    
    // Generate ID if not provided
    if (!product.id) {
      const maxId = Math.max(
        ...Object.values(allProducts).flat().map(p => p.id || 0),
        0
      );
      product.id = maxId + 1;
    }
    
    product.source = source;
    allProducts[source].push(product);
    
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(allProducts, null, 2));
    return product;
  } catch (err) {
    console.error('Error adding product:', err);
    throw err;
  }
}

/**
 * Update a product
 */
function updateProduct(productId, updates) {
  try {
    const allProducts = loadAllProducts();
    
    for (const source in allProducts) {
      const index = allProducts[source].findIndex(p => p.id === productId);
      if (index !== -1) {
        allProducts[source][index] = { ...allProducts[source][index], ...updates };
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(allProducts, null, 2));
        return allProducts[source][index];
      }
    }
    
    throw new Error('Product not found');
  } catch (err) {
    console.error('Error updating product:', err);
    throw err;
  }
}

/**
 * Delete a product
 */
function deleteProduct(productId) {
  try {
    const allProducts = loadAllProducts();
    
    for (const source in allProducts) {
      const index = allProducts[source].findIndex(p => p.id === productId);
      if (index !== -1) {
        allProducts[source].splice(index, 1);
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(allProducts, null, 2));
        return true;
      }
    }
    
    throw new Error('Product not found');
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
}

/**
 * Search products by title or category
 */
function searchProducts(query) {
  const allProducts = getAllProducts();
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    (p.subtitle && p.subtitle.toLowerCase().includes(lowerQuery))
  );
}

module.exports = {
  loadAllProducts,
  getAllProducts,
  getProductsBySource,
  addProductToSource,
  updateProduct,
  deleteProduct,
  searchProducts
};
