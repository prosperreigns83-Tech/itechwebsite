/**
 * Product API - Fetch products from backend
 */
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:4000/api';

export async function fetchAllProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export async function fetchProductsBySource(source) {
  try {
    const response = await fetch(`${API_BASE}/products?source=${source}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching products from source:', err);
    return [];
  }
}

export async function searchProducts(query) {
  try {
    const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search products');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error('Error searching products:', err);
    return [];
  }
}

export async function addProduct(product, source = 'local') {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, source })
    });
    if (!response.ok) throw new Error('Failed to add product');
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error('Error adding product:', err);
    throw err;
  }
}

export async function updateProductAPI(id, updates) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update product');
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error('Error updating product:', err);
    throw err;
  }
}

export async function deleteProductAPI(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true;
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
}
