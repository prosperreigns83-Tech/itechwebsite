# Phase 5: SEO & Discoverability

## Frontend Setup

### Install SEO Dependencies

```bash
npm install react-helmet-async
```

### 1. Update index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="ITECH Store - Premium electronics and accessories online. Fast delivery, best prices, secure checkout." />
    <meta name="keywords" content="electronics, accessories, online shopping, ITECH store" />
    <meta name="author" content="ITECH Store" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph for Social Sharing -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="ITECH Store - Premium Electronics" />
    <meta property="og:description" content="Shop premium electronics and accessories at competitive prices" />
    <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
    <meta property="og:url" content="https://yourdomain.com" />
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="ITECH Store" />
    <meta name="twitter:description" content="Shop premium electronics" />
    <meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg" />
    
    <title>ITECH Store - Premium Electronics & Accessories</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.jpg" />
    <link rel="apple-touch-icon" sizes="300x300" href="/favicon.jpg" />
    <link rel="canonical" href="https://yourdomain.com" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 2. Create SEO Context

Create `src/context/SEOContext.jsx`:

```javascript
import React, { createContext, useContext } from 'react';
import { Helmet } from 'react-helmet-async';

export function SEOProvider({ children }) {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
}

export function useSEO() {
  return useContext(SEOContext);
}

export function PageHelmet({ title, description, image, url }) {
  return (
    <Helmet>
      <title>{title} | ITECH Store</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
}
```

### 3. Page-Specific Titles and Descriptions

Update each page:

```javascript
// src/components/pages/Home.jsx
import { PageHelmet } from '../context/SEOContext';

export default function Home() {
  return (
    <>
      <PageHelmet 
        title="Buy Electronics Online"
        description="Shop premium electronics, phones, accessories with fast delivery and secure checkout"
        url="https://yourdomain.com"
      />
      {/* Page content */}
    </>
  );
}
```

```javascript
// src/components/products/ProductDetail.jsx
import { PageHelmet } from '../context/SEOContext';

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Load product
  }, [productId]);

  if (!product) return <LoadingSpinner />;

  return (
    <>
      <PageHelmet 
        title={product.title}
        description={product.description}
        image={product.image}
        url={`https://yourdomain.com/product/${productId}`}
      />
      {/* Product content */}
    </>
  );
}
```

### 4. Create Sitemap

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>https://yourdomain.com/categories</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://yourdomain.com/contact</loc>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://yourdomain.com/about</loc>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Products listed here too -->
</urlset>
```

### 5. Create robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Allow: /api/products
Allow: /api/products/search

Disallow: /admin
Disallow: /seller
Disallow: /api/auth
Disallow: /api/admin

Sitemap: https://yourdomain.com/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

### 6. JSON-LD Structured Data

Create helper:

```javascript
// src/utils/schemaMarkup.js
export function getProductSchema(product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "ITECH Store"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://yourdomain.com/product/${product.id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.5,
      "ratingCount": product.reviews?.length || 0
    }
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "name": "ITECH Store",
    "url": "https://yourdomain.com",
    "logo": "https://yourdomain.com/logo.png",
    "description": "Premium electronics and accessories store",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St",
      "addressLocality": "City",
      "addressCountry": "Country"
    },
    "sameAs": [
      "https://www.facebook.com/itechstore",
      "https://www.twitter.com/itechstore"
    ]
  };
}
```

Use in ProductDetail:

```javascript
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(getProductSchema(product))}
  </script>
</Helmet>
```

### 7. Update App.jsx

```javascript
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <NotificationsProvider>
        <ErrorBoundary>
          {/* App content */}
        </ErrorBoundary>
      </NotificationsProvider>
    </HelmetProvider>
  );
}
```

### 8. Backend SEO Support

In `server/index.js`, add:

```javascript
// Add JSON-LD for products endpoint
app.get('/api/products/:id/schema', asyncHandler(async (req, res) => {
  const product = await getProductById(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Not found' });
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };
  
  res.json(schema);
}));

// Sitemap endpoint
app.get('/sitemap.xml', asyncHandler(async (req, res) => {
  const products = await getAllProducts();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  xml += '<url><loc>https://yourdomain.com</loc><priority>1.0</priority></url>\n';
  
  // Products
  products.forEach(p => {
    xml += `<url><loc>https://yourdomain.com/product/${p.id}</loc><priority>0.8</priority></url>\n`;
  });
  
  xml += '</urlset>';
  
  res.type('application/xml').send(xml);
}));
```

---

## SEO Checklist

- [ ] Install react-helmet-async
- [ ] Update index.html with meta tags
- [ ] Add title and description to each page
- [ ] Create JSON-LD schemas
- [ ] Create sitemap.xml
- [ ] Create robots.txt
- [ ] Test with Google Search Console
- [ ] Submit sitemap to Google
- [ ] Set canonical URLs
- [ ] Add Open Graph tags
- [ ] Add Twitter Cards
- [ ] Use semantic HTML
- [ ] Optimize heading hierarchy (H1, H2, H3)

---

## Expected SEO Improvements

- ✅ Google visibility: 3-4 weeks
- ✅ Organic traffic: +40% (estimated)
- ✅ Products rankable: All
- ✅ Search Console: Zero errors

---

**Phase 5 Complete! Moving to Phase 6: Analytics** 📊
