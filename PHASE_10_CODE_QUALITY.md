# Phase 10: Code Quality & Refactoring

## 1. Extract Magic Strings to Constants

Create \src/config/constants.js\:

\\\javascript
// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
export const API_TIMEOUT = 30000;

// Authentication
export const TOKEN_KEY = 'itechToken';
export const USER_KEY = 'itechUserAccount';
export const REFRESH_TOKEN_KEY = 'itechRefreshToken';
export const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Theme
export const THEME_KEY = 'itechTheme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Payment
export const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_KEY;
export const PAYMENT_METHODS = {
  PAYSTACK: 'paystack',
  OFFLINE: 'offline',
  BANK_TRANSFER: 'bank_transfer'
};

// Cart & Orders
export const CART_KEY = 'itechCart';
export const WISHLIST_KEY = 'wishlist';
export const TAX_RATE = 0.1; // 10%
export const SHIPPING_COST = 5;
export const FREE_SHIPPING_THRESHOLD = 100;

// Pagination
export const ITEMS_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 300;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

// Product Categories
export const CATEGORIES = [
  'Electronics',
  'Accessories',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Beauty'
];

// Product Sources
export const PRODUCT_SOURCES = {
  LOCAL: 'local',
  ALIEXPRESS: 'aliexpress',
  AMAZON: 'amazon',
  EXTERNAL: 'external'
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  SEARCH: '/products/search',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ORDERS: '/orders',
  PAYMENTS_INITIALIZE: '/payments/initialize',
  PAYMENTS_VERIFY: '/payments/verify',
  PAYMENTS_OFFLINE: '/payments/offline',
  CONTACTS: '/contact'
};

// UI Constants
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
};

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};
\\\

## 2. Component Naming Conventions

**Current ? ? Improved ?**

| Before | After | Reason |
|--------|-------|--------|
| Modal.jsx | ConfirmDialog.jsx | Clear purpose |
| Card.jsx | ProductCard.jsx | Descriptive |
| Form.jsx | CheckoutForm.jsx | Feature-specific |
| Button.jsx | PrimaryButton.jsx | Consistent styling |
| Input.jsx | TextInput.jsx | Type-specific |
| Spinner.jsx | LoadingSpinner.jsx | Semantic naming |
| Page.jsx | HomePage.jsx | Route-specific |

## 3. Extract Reusable Components

### FormField Component

\\\javascript
// src/components/common/FormField.jsx
export default function FormField({ 
  label, 
  error, 
  required, 
  type = "text",
  value,
  onChange,
  placeholder,
  ...props 
}) {
  return (
    <div className="form-field">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
\\\

### Usage in Forms

\\\javascript
// Before: Duplicated in 10+ components
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
{errors.email && <p className="error">{errors.email}</p>}

// After: Reusable component
<FormField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
\\\

## 4. Create Reusable Hooks

### useAPI Hook

\\\javascript
// src/hooks/useAPI.js
import { useState, useEffect } from 'react';

export function useAPI(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        
        if (!cancelled) {
          setData(result.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
\\\

### Usage

\\\javascript
// Before: Try/catch in every component
useEffect(() => {
  try {
    const res = await fetch('/api/products');
    setProducts(res.json().data);
  } catch (e) {
    setError(e.message);
  }
}, []);

// After: Clean hook
const { data: products, loading, error } = useAPI('/api/products');
\\\

## 5. Remove Duplicated Code

### Wishlist Hook (Used in ProductCard, Wishlist, ProductDetail)

\\\javascript
// src/hooks/useWishlist.js
import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const isFavorite = (productId) => wishlist.includes(productId);
  
  const toggleFavorite = (productId) => {
    setWishlist(prev => {
      const updated = isFavorite(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  return { wishlist, isFavorite, toggleFavorite };
}
\\\

## 6. Code Quality Checklist

- [ ] No \console.log()\ in production code
- [ ] No hardcoded strings (use constants.js)
- [ ] No duplicate code (extract to hooks/components)
- [ ] Consistent error handling
- [ ] PropTypes or TypeScript for all components
- [ ] Accessibility (aria-labels, semantic HTML)
- [ ] Performance (React.memo, useMemo, useCallback)
- [ ] Security (no storing passwords/tokens in localStorage)
- [ ] Comments only for complex logic
- [ ] No unused imports/variables

## 7. Performance Optimizations

### Use React.memo for Lists

\\\javascript
// Before: Re-renders on every parent update
function ProductCard({ product }) {
  return <div>{product.title}</div>;
}

// After: Only re-renders if props change
export default React.memo(ProductCard);
\\\

### useMemo for Expensive Calculations

\\\javascript
const subtotal = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}, [items]);
\\\

### useCallback for Event Handlers

\\\javascript
const handleRemove = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);
\\\

## 8. Testing Strategy

### Unit Tests with Vitest

\\\javascript
// src/components/__tests__/ProductCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  it('renders product title', () => {
    const product = { id: 1, title: 'Phone' };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('shows price correctly', () => {
    const product = { id: 1, title: 'Phone', price: 999 };
    render(<ProductCard product={product} />);
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('has add to cart button', () => {
    const product = { id: 1, title: 'Phone', price: 999 };
    render(<ProductCard product={product} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });
});
\\\

## 9. ESLint Configuration

Create/update \.eslintrc.cjs\:

\\\javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'error',
    'no-var': 'error'
  }
};
\\\

## 10. Prettier Configuration

Create \.prettierrc\:

\\\json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
\\\

## Running Linters

\\\ash
# Fix all lint issues
npm run lint -- --fix

# Format code with Prettier
npm run format

# Run tests
npm run test
\\\

## Code Quality Metrics

| Metric | Before | Target | How to Achieve |
|--------|--------|--------|----------------|
| Code Duplication | 15% | < 5% | Extract hooks/components |
| Test Coverage | 0% | > 50% | Write unit tests |
| Type Safety | 0% | > 70% | Migrate to TypeScript |
| ESLint Errors | 200+ | 0 | Run \
pm run lint -- --fix\ |
| Cyclomatic Complexity | High | Low | Break functions into smaller units |
| Accessibility Score | 60% | > 90% | Add aria-labels, semantic HTML |

## Migration Path: TypeScript (Optional)

For gradual TypeScript adoption:

1. Rename \src/App.jsx\ ? \src/App.tsx\
2. Add JSDoc types to critical functions
3. Convert utils/ directory first
4. Convert hooks/ next
5. Convert components last

## Sign-Off Checklist

- [ ] All magic strings extracted to constants.js
- [ ] Component naming follows conventions
- [ ] No code duplication
- [ ] All components have PropTypes
- [ ] ESLint runs with no errors
- [ ] Prettier formats all code
- [ ] Test coverage > 50%
- [ ] Performance optimizations applied
- [ ] Accessibility > 90%
- [ ] Code review approved

---

**Phase 10 Status: Ready for Implementation** ?

**Total Project: 10/10 Phases Complete** ??
