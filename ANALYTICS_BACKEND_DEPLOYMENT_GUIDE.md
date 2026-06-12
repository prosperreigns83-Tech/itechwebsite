# Phase 6, 7, 8: Analytics, Backend Architecture & Deployment

## PHASE 6: ANALYTICS & MONITORING

### 1. Google Analytics Setup

Install:
```bash
npm install react-ga4
```

Create `src/utils/analytics.js`:
```javascript
import ReactGA from "react-ga4";

export function initializeAnalytics() {
  ReactGA.initialize("G-XXXXXXXXXX"); // Replace with your GA4 ID
}

export function trackPageView(path) {
  ReactGA.send({ hitType: "pageview", page: path });
}

export function trackEvent(category, action, label) {
  ReactGA.event({
    category,
    action,
    label
  });
}

export function trackEcommerce(event, value) {
  ReactGA.event({
    event,
    value
  });
}
```

Use in App.jsx:
```javascript
import { initializeAnalytics, trackPageView } from './utils/analytics';

useEffect(() => {
  initializeAnalytics();
}, []);

useEffect(() => {
  trackPageView(window.location.pathname);
}, [page]);

// Track purchases
const handleCheckout = () => {
  trackEcommerce('purchase', total);
  // ... checkout logic
};

// Track product views
const handleProductView = (product) => {
  trackEvent('engagement', 'product_view', product.title);
};
```

### 2. Error Tracking (Sentry)

Install:
```bash
npm install @sentry/react @sentry/tracing
```

Initialize in main.jsx:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  release: "1.0.0"
});
```

### 3. Microsoft Clarity

Add to index.html:
```html
<script>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

---

## PHASE 7: BACKEND ARCHITECTURE IMPROVEMENTS

### 1. Create Folder Structure

```
server/
├── config/
│   ├── database.js
│   └── environment.js
├── middleware/
│   ├── security.js
│   ├── validation.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── payments.js
│   └── admin.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── paymentController.js
├── services/
│   ├── emailService.js
│   ├── paymentService.js
│   └── productService.js
├── utils/
│   ├── passwordHash.js
│   ├── apiResponse.js
│   └── logger.js
└── index.js
```

### 2. Refactor to Controllers

Create `server/controllers/productController.js`:
```javascript
const { getAllProducts, getProductsBySource, addProduct, updateProduct, deleteProduct, searchProducts } = require('../services/productService');

exports.getAll = async (req, res, next) => {
  try {
    const { source } = req.query;
    const products = source 
      ? await getProductsBySource(source)
      : await getAllProducts();
    
    res.sendSuccess({ products, count: products.length }, 'Products retrieved');
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await getProductById(parseInt(req.params.id));
    if (!product) return res.status(404).send Error('Product not found');
    res.sendSuccess(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, price, category, subtitle, image, source } = req.body;
    const product = await addProduct({ title, price, category, subtitle, image, source });
    res.sendCreated(product, 'Product created');
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await updateProduct(parseInt(req.params.id), req.body);
    res.sendSuccess(product, 'Product updated');
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await deleteProduct(parseInt(req.params.id));
    res.sendSuccess({}, 'Product deleted');
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await searchProducts(q);
    res.sendSuccess({ results, count: results.length });
  } catch (err) {
    next(err);
  }
};
```

### 3. Create Routes

Create `server/routes/products.js`:
```javascript
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateSearch } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/', apiLimiter, productController.getAll);
router.get('/search', validateSearch, productController.search);
router.get('/:id', productController.getById);
router.post('/', validateProduct, productController.create);
router.put('/:id', validateProduct, productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
```

### 4. Simplified index.js

```javascript
const express = require('express');
require('dotenv').config();

// Middleware
const { configureSecurity } = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();

// Apply security
configureSecurity(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
```

---

## PHASE 8: PRODUCTION DEPLOYMENT READINESS

### 1. Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups automated
- [ ] SSL certificate obtained
- [ ] CORS properly configured
- [ ] Rate limiting tested
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Security headers enabled
- [ ] Performance optimized
- [ ] SEO implemented
- [ ] Analytics configured
- [ ] Monitoring set up

### 2. Environment Configuration

Create `.env.production`:
```env
# Production
NODE_ENV=production
PORT=4000

# Database (use managed service)
DB_HOST=your-db.railway.app
DB_USER=postgres
DB_PASSWORD=xxxxx
DB_NAME=itech_store

# Security
JWT_SECRET=xxxxx_very_long_random_string_xxxxx
FRONTEND_URL=https://yourdomain.com

# Email
SENDGRID_API_KEY=xxxxx

# Payment
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx

# Analytics
GA4_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxxxx

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Database Backup Strategy

```bash
# Daily backup script - backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_$DATE.sql"

pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Upload to cloud
aws s3 cp $BACKUP_FILE s3://your-bucket/backups/

# Keep only last 30 days
find . -name "backup_*.sql" -mtime +30 -delete
```

### 4. Production Build

```bash
# Frontend
npm run build
# Output: dist/

# Backend
npm install --production
# No build needed for Node

# Verify:
npm run preview    # Test production build
npm run start      # Start backend
```

### 5. Docker Setup (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/itech
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=itech_store
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 6. Deployment Platforms

**Option A: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option B: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create your-app-name
git push heroku main
```

**Option C: Render**
```
1. Connect your GitHub repo
2. Create new Web Service
3. Set environment variables
4. Deploy!
```

### 7. Post-Deployment Checklist

- [ ] Website loads
- [ ] API responds
- [ ] Database connected
- [ ] Email working
- [ ] Payments functional
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] SSL certificate valid
- [ ] DNS configured
- [ ] Email domain verified

---

## Monitoring Commands

```bash
# Check health
curl https://yourdomain.com/api/health

# Test database
psql -h db.host -U user -d itech_store -c "SELECT COUNT(*) FROM products;"

# Check logs
# Railway: railway logs
# Heroku: heroku logs --tail
# Render: View in dashboard

# Monitor performance
# Check Sentry for errors
# Check Google Analytics for traffic
# Check Clarity for user behavior
```

---

**Phases 6, 7, 8 Complete!** ✅
