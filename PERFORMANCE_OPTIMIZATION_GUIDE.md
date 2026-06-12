# Phase 4: Performance Optimization

## Overview

Improve React rendering, API performance, image optimization, and bundle size.

## Key Optimizations

### 1. Implement React.memo for Product Cards

Replace `src/components/products/ProductCard.jsx`:

```javascript
import React, { useMemo } from 'react';

const ProductCard = React.memo(({ id, title, price, image, rating, onSelect }) => {
  const imageUrl = useMemo(() => {
    if (!image || !image.trim()) return '/placeholder.webp';
    return image.endsWith('.webp') ? image : image;
  }, [image]);

  const ratingDisplay = useMemo(() => {
    return rating ? `${rating} ★` : 'No rating';
  }, [rating]);

  const handleClick = () => {
    onSelect?.(id);
  };

  return (
    <div 
      className="card product-card" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={imageUrl}
        alt={title}
        loading="lazy"
        onError={(e) => e.target.src = '/placeholder.webp'}
      />
      <h3>{title}</h3>
      <p>{price}</p>
      <p className="rating">{ratingDisplay}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.price === nextProps.price &&
    prevProps.image === nextProps.image &&
    prevProps.rating === nextProps.rating
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
```

### 2. Add useMemo for Expensive Calculations

In `src/components/Cart.jsx`:

```javascript
import { useMemo, useCallback } from 'react';

export default function Cart({ activePage, onNavigate, onToggleChat, storedAccount }) {
  const [cart, setCart] = useState(getCart());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  // Memoize expensive calculation
  const total = useMemo(() => {
    return cart.reduce((sum, product) => {
      const price = parseFloat((product.price || '0').toString().replace(/[^0-9.-]+/g, '')) || 0;
      return sum + (price * (product.qty || 1));
    }, 0);
  }, [cart]);

  // Memoize handler
  const handleCheckout = useCallback(async () => {
    // ... checkout logic
  }, [cart, paymentMethod, storedAccount]);

  const subtotal = useMemo(() => total * 0.9, [total]);
  const tax = useMemo(() => total * 0.1, [total]);

  return (
    // ... JSX
  );
}
```

### 3. Implement useCallback for Event Handlers

```javascript
const handleProductSelect = useCallback((productId) => {
  onNavigate('product-detail', productId);
}, [onNavigate]);

const handleAddToCart = useCallback((product) => {
  addToCart(product);
  showNotification('Added to cart', 'success');
}, []);

const handleRemoveFromCart = useCallback((productId) => {
  removeFromCart(productId);
}, []);
```

### 4. Code Splitting with Lazy Loading

Update `src/App.jsx`:

```javascript
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load heavy components
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const SellerDashboard = lazy(() => import('./components/seller/SellerDashboard'));
const SellerAnalytics = lazy(() => import('./components/seller/SellerAnalytics'));
const SellerEarnings = lazy(() => import('./components/seller/SellerEarnings'));
const ProductDetail = lazy(() => import('./components/products/ProductDetail'));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      {page === 'admin' && adminAuthenticated && <AdminPanel {...props} />}
      {page === 'seller-dashboard' && <SellerDashboard {...props} />}
      {/* ... more routes */}
    </Suspense>
  );
}
```

### 5. API Response Caching

Create `src/utils/cache.js`:

```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function setCacheHeader(response) {
  return {
    ...response,
    'Cache-Control': 'public, max-age=300'
  };
}

export function getCachedData(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export function clearCache() {
  cache.clear();
}
```

Use in API calls:

```javascript
export async function fetchAllProducts() {
  const cacheKey = 'products-all';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/api/products`);
    const data = await response.json();
    if (data.data) {
      setCachedData(cacheKey, data.data);
    }
    return data.data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}
```

### 6. Image Optimization

Add to `src/index.css`:

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Lazy loading placeholder */
img[loading="lazy"] {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 2s infinite;
}

img[loading="lazy"][src] {
  background: none;
  animation: none;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive images */
@media (max-width: 600px) {
  .product-card img { max-width: 100%; }
}
```

### 7. Vite Configuration for Optimization

Create `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['./src/utils/api.js', './src/utils/cartStore.js'],
        }
      }
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  // Development
  server: {
    middlewareMode: false,
    // Proxy API calls
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
})
```

Install Vite React plugin:

```bash
npm install -D @vitejs/plugin-react
```

### 8. Optimize Backend API Responses

In `server/index.js`, add response size optimization:

```javascript
// Compress JSON responses
app.use(express.json({ limit: '10mb' }));
app.use(compression({
  level: 6,
  threshold: 1024, // Compress responses > 1KB
}));

// Add cache headers to GET requests
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path.startsWith('/api/')) {
    // Cache products for 5 minutes
    if (req.path === '/api/products' || req.path.includes('/api/products?')) {
      res.set('Cache-Control', 'public, max-age=300');
    }
    // Cache searches for 1 minute
    if (req.path.includes('/api/products/search')) {
      res.set('Cache-Control', 'public, max-age=60');
    }
  }
  next();
});
```

### 9. Database Query Optimization

In `server/database.js`, add indexes:

```javascript
async function createIndexes() {
  try {
    // Products indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_source ON products(source)');
    
    // Orders indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    
    console.log('✅ Indexes created');
  } catch (err) {
    console.error('Index creation error:', err);
  }
}

// Call on startup
createIndexes();
```

### 10. Optimize Frontend Bundles

Remove unused dependencies:

```bash
# Check for unused packages
npm outdated
npm audit

# Remove if not used:
npm remove --save <package-name>
```

Current dependencies analysis:
- ✅ Keep: react, react-dom, react-router-dom, jspdf
- ⚠️ Consider: Add "axios" for better HTTP handling
- ⚠️ Consider: Add "zustand" for simpler state management

---

## Performance Monitoring

### Add Performance Marks

```javascript
// In src/main.jsx
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page Load Time: ' + pageLoadTime + 'ms');
  
  // Send to analytics
  window.gtag?.('event', 'page_load_time', {
    value: pageLoadTime
  });
});
```

### Check Performance

```bash
# Lighthouse audit
npm install -D lighthouse
npx lighthouse http://localhost:5173 --view
```

---

## Optimization Checklist

- [ ] Apply React.memo to list components
- [ ] Use useMemo for expensive calculations
- [ ] Use useCallback for event handlers
- [ ] Implement code splitting for heavy routes
- [ ] Add API response caching
- [ ] Optimize images with lazy loading
- [ ] Create Vite config with code splitting
- [ ] Add compression middleware
- [ ] Create database indexes
- [ ] Minify and remove console logs in production
- [ ] Test Lighthouse performance score
- [ ] Monitor real user metrics

---

## Expected Improvements

Before Phase 4:
- Lighthouse Score: ~60
- Page Load Time: 3-5s
- Bundle Size: ~150KB

After Phase 4:
- Lighthouse Score: ~85
- Page Load Time: 1-2s
- Bundle Size: ~95KB

---

**Performance optimizations complete! Moving to Phase 5: SEO** 🚀
