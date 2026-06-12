import initialProducts from "../data/products";

const STORAGE_KEY = "userProducts";

function loadStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveStoredProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("products-updated"));
}

export function getProducts() {
  const stored = loadStoredProducts();
  const storedMap = new Map();
  const deletedIds = new Set();

  for (const item of stored) {
    if (item._deleted) {
      deletedIds.add(item.id);
      storedMap.set(item.id, item);
    } else {
      storedMap.set(item.id, item);
    }
  }

  const merged = initialProducts.reduce((list, item) => {
    if (deletedIds.has(item.id)) {
      return list;
    }
    if (storedMap.has(item.id)) {
      const storedItem = storedMap.get(item.id);
      if (!storedItem._deleted) {
        list.push({ ...item, ...storedItem });
      }
    } else {
      list.push(item);
    }
    return list;
  }, []);

  const extra = stored.filter((item) => !initialProducts.some((initial) => initial.id === item.id) && !item._deleted);
  return [...merged, ...extra];
}

export function getPublicProducts() {
  // Only return products that are approved (or initial products without status)
  return getProducts().filter((p) => {
    if (p.status) {
      return p.status === "approved";
    }
    return true;
  });
}

export function addProduct(product) {
  try {
    const stored = loadStoredProducts();
    const toStore = {
      ...product,
      status: product.status || (product.sellerId ? "pending" : "approved")
    };
    stored.push(toStore);
    saveStoredProducts(stored);
  } catch (e) {
    console.error("Failed to add product", e);
  }
}

export function updateProduct(product) {
  try {
    const stored = loadStoredProducts();
    const existingIndex = stored.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) {
      stored[existingIndex] = { ...stored[existingIndex], ...product, _deleted: false };
    } else {
      stored.push(product);
    }
    saveStoredProducts(stored);
  } catch (e) {
    console.error("Failed to update product", e);
  }
}

export function deleteProduct(id) {
  try {
    const stored = loadStoredProducts();
    const existingIndex = stored.findIndex((item) => item.id === id);
    const isInitial = initialProducts.some((item) => item.id === id);

    if (existingIndex >= 0) {
      if (!isInitial) {
        stored.splice(existingIndex, 1);
      } else {
        stored[existingIndex] = { id, _deleted: true };
      }
    } else if (isInitial) {
      stored.push({ id, _deleted: true });
    }

    saveStoredProducts(stored);
  } catch (e) {
    console.error("Failed to delete product", e);
  }
}

export function clearUserProducts() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("products-updated"));
}

export function approveProduct(id) {
  const products = loadStoredProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    products[idx] = { ...products[idx], status: "approved", _deleted: false };
    saveStoredProducts(products);
  } else {
    // if it's an initial product no-op
  }
}

export function rejectProduct(id) {
  const products = loadStoredProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    products[idx] = { ...products[idx], status: "rejected", _deleted: false };
    saveStoredProducts(products);
  } else {
    // if not found, add a rejected marker
    products.push({ id, status: "rejected", _deleted: false });
    saveStoredProducts(products);
  }
}
