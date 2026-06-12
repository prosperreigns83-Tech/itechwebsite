# Phase 9: Ecommerce Features Verification & Testing

## Comprehensive Testing Checklist

### 1. Product Management (10 tests)
- [ ] GET /api/products returns all products
- [ ] GET /api/products?source=local filters by source correctly
- [ ] GET /api/products/search?q=phone finds matching products
- [ ] POST /api/products creates new product with validation
- [ ] PUT /api/products/:id updates product successfully
- [ ] DELETE /api/products/:id removes product from database
- [ ] Search pagination works (12 items per page)
- [ ] Category filtering displays correct products
- [ ] Product sorting by price/rating works
- [ ] Related products load on product detail page

### 2. Shopping Cart (8 tests)
- [ ] Add to cart increases cart count
- [ ] Cart persists across page reloads (localStorage)
- [ ] Remove from cart works correctly
- [ ] Update quantity modifies subtotal
- [ ] Clear cart empties all items
- [ ] Cart displays subtotal, tax (10%), total correctly
- [ ] Empty cart message displays when no items
- [ ] Cart updates sync across browser tabs

### 3. Checkout & Orders (7 tests)
- [ ] Checkout form validates all required fields
- [ ] Missing email rejects order
- [ ] Missing phone rejects order
- [ ] Missing address rejects order
- [ ] Order creates with status 'pending'
- [ ] Order confirmation email sends to customer
- [ ] Order notification email sends to admin

### 4. Payment Integration - Paystack (8 tests)
- [ ] /api/payments/initialize redirects to Paystack
- [ ] Test card 4084084084084081 processes successfully
- [ ] Payment webhook updates order status to 'paid'
- [ ] Duplicate payment blocked
- [ ] /api/payments/verify/:reference confirms payment
- [ ] /api/payments/offline creates offline order
- [ ] Payment receipt displays order details
- [ ] Invoice PDF generates correctly

### 5. Authentication (9 tests)
- [ ] POST /api/auth/login with valid credentials returns JWT
- [ ] Login with invalid password fails (401)
- [ ] Password hashing works (bcryptjs)
- [ ] JWT token expires after 7 days
- [ ] POST /api/auth/forgot-password sends reset email
- [ ] Password reset link works within 1 hour
- [ ] Password reset link expires after 1 hour
- [ ] /api/auth/me returns authenticated user
- [ ] Protected routes require valid token

### 6. User Profiles (8 tests)
- [ ] View profile displays user info
- [ ] Edit profile updates data in database
- [ ] Edit password changes login credential
- [ ] Upload profile photo stores file
- [ ] View order history shows user's orders
- [ ] Add address saves to profile
- [ ] Delete address removes from profile
- [ ] Add payment method stores securely

### 7. Admin Features (10 tests)
- [ ] Admin login works with correct credentials
- [ ] Admin dashboard displays analytics
- [ ] GET /api/admin/orders returns all orders
- [ ] Update order status changes in database
- [ ] View all users works
- [ ] View all products works
- [ ] Add product via admin works
- [ ] Edit product via admin works
- [ ] Delete product via admin works
- [ ] Export orders to CSV works

### 8. Seller Features (9 tests)
- [ ] Seller registration creates account
- [ ] Seller login works
- [ ] Seller dashboard displays overview
- [ ] Upload product to seller shop works
- [ ] View shop products displays seller's items
- [ ] Edit shop product updates data
- [ ] Delete shop product removes item
- [ ] View shop earnings displays revenue
- [ ] Seller analytics display correctly

### 9. Notifications & Communication (6 tests)
- [ ] Toast notifications display on actions
- [ ] Order confirmation email sent (SendGrid)
- [ ] Password reset email sent
- [ ] Email formatting professional
- [ ] Live chat widget opens/closes
- [ ] Contact form sends email

### 10. Wishlist (6 tests)
- [ ] Add to wishlist saves item
- [ ] Wishlist persists in localStorage
- [ ] Remove from wishlist works
- [ ] View wishlist page displays items
- [ ] Wishlist item count badge updates
- [ ] Move to cart from wishlist works

### 11. Videos & Content (4 tests)
- [ ] Videos load from API
- [ ] Video player plays correctly
- [ ] Related videos display
- [ ] Video detail page SEO correct

### 12. UI/UX Responsiveness (8 tests)
- [ ] Mobile (320px) responsive layout works
- [ ] Tablet (768px) responsive layout works
- [ ] Desktop (1024px) responsive layout works
- [ ] Dark/light theme toggle works
- [ ] Loading spinners display during API calls
- [ ] Error messages display on failures
- [ ] No console errors on any page
- [ ] No broken images or 404s
- [ ] Navigation works on all pages
- [ ] Bottom nav on mobile accessible

### 13. Security Tests (7 tests)
- [ ] Rate limiting blocks 6+ login attempts
- [ ] Input validation rejects invalid data
- [ ] CORS headers present on all responses
- [ ] X-Frame-Options header prevents clickjacking
- [ ] X-Content-Type-Options prevents MIME sniffing
- [ ] Passwords never stored plaintext
- [ ] JWT tokens validated on protected routes

### 14. Performance Tests (5 tests)
- [ ] Products load in < 2 seconds
- [ ] Search results return in < 1 second
- [ ] Checkout completes in < 3 seconds
- [ ] Payment redirect happens instantly
- [ ] Page navigation is smooth (no lag)

## Test Execution Commands

\\\ash
# Run health check
curl http://localhost:4000/api/health

# Test products endpoint
curl http://localhost:4000/api/products

# Test search
curl "http://localhost:4000/api/products/search?q=phone"

# Test login (rate limiting)
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/auth/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"test@test.com","password":"password"}'
  sleep 0.5
done

# Test invalid product creation (validation)
curl -X POST http://localhost:4000/api/products \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test"}'
\\\

## Test Results Template

| Feature | Test Case | Expected | Actual | Status |
|---------|-----------|----------|--------|--------|
| Products | GET all | 200, array | | ?/? |
| | Filter by source | 200, filtered | | ?/? |
| | Search | 200, matches | | ?/? |
| Cart | Add item | count++, persist | | ?/? |
| | Remove item | count--, update | | ?/? |
| Auth | Login | JWT token | | ?/? |
| | Rate limit | 429 on 6th | | ?/? |
| Payment | Initialize | Paystack URL | | ?/? |
| | Verify | Status updated | | ?/? |

## Known Issues to Track

- [ ] Issue #1: 
- [ ] Issue #2: 
- [ ] Issue #3: 

## Sign-Off

| Role | Name | Date | Notes |
|------|------|------|-------|
| QA | | | |
| Dev | | | |
| PM | | | |

---

**Phase 9 Status: Ready for Testing** ?
