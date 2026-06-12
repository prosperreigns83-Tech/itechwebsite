# Real Payment Processing Setup - Paystack Integration

## Overview

Your e-commerce platform now has **REAL PAYMENT PROCESSING** integrated with **Paystack**, a leading African payment processor that supports:
- ✅ Credit/Debit Cards (Visa, Mastercard)
- ✅ Bank Transfers
- ✅ Mobile Money (MTN Mobile Money, Airtel Money, etc.)
- ✅ USSD
- ✅ QR Code Payments

## What Was Implemented

### Backend Files Created/Modified

1. **`server/paystack.js`** - Paystack payment integration module
   - `initializePayment()` - Initialize Paystack payment
   - `verifyPayment()` - Verify payment success
   - `verifyWebhookSignature()` - Validate Paystack webhooks

2. **`server/index.js`** - Added 4 new payment endpoints:
   - `POST /api/payments/initialize` - Start payment process
   - `GET /api/payments/verify/:reference` - Check payment status
   - `POST /api/payments/webhook` - Handle Paystack webhooks
   - `POST /api/payments/offline` - Handle offline payments (Cash on Delivery)

3. **`server/.env.example`** - Added Paystack configuration template

### Frontend Files Created/Modified

1. **`src/components/PaymentPage.jsx`** - NEW
   - Handles payment redirect to Paystack
   - Processes offline payments
   - Shows loading and error states

2. **`src/css/PaymentPage.css`** - NEW
   - Styling for payment page

3. **`src/components/Cart.jsx`** - MODIFIED
   - Real payment processing in checkout
   - Redirects to Paystack for online payments
   - Processes offline payments directly

4. **`src/components/PaymentSuccess.jsx`** - MODIFIED
   - Verifies Paystack payment on redirect
   - Shows payment confirmation
   - Displays actual payment details

5. **`src/App.jsx`** - MODIFIED
   - Added PaymentPage component
   - Added payment-page routing

## Step 1: Create Paystack Account

1. Go to https://paystack.com
2. Click **Sign Up** (top right)
3. Fill in your details:
   - Business name
   - Email
   - Password
4. Verify your email
5. Complete your business profile

## Step 2: Get Your API Keys

1. After login, go to **Settings** → **Developer**
2. You'll see two keys:
   - **Public Key** (pk_test_xxxxx or pk_live_xxxxx)
   - **Secret Key** (sk_test_xxxxx or sk_live_xxxxx)

3. **IMPORTANT**: Keep these secret! Never commit to git.

## Step 3: Configure Your Backend

1. Open `server/.env` and add:

```env
# Paystack Payment Gateway
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

Replace with your actual keys from Paystack dashboard.

2. Verify it's in `.gitignore` (it should be):

```bash
cat .gitignore | grep ".env"
```

Should show `.env` in the list.

## Step 4: Configure Frontend

Add to `src/.env` (or `.env.local`):

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

## Step 5: Restart Services

```bash
# Stop all services (Ctrl+C in each terminal)

# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend (new terminal)
cd src (go to root first)
npm run dev

# Terminal 3: Database (if using PostgreSQL)
# Already running - no action needed
```

## Payment Flow

### Online Payment (Paystack)

```
User clicks "Checkout" with "Online Payment"
    ↓
Cart.jsx creates order → redirects to PaymentPage
    ↓
PaymentPage calls POST /api/payments/initialize
    ↓
Backend calls Paystack API → returns payment URL
    ↓
PaymentPage redirects to Paystack payment page
    ↓
User enters card/mobile money details
    ↓
Paystack processes payment
    ↓
If successful → Redirect back to /payment-success?reference=xxxxx
    ↓
PaymentSuccess verifies payment via GET /api/payments/verify/:reference
    ↓
Shows order confirmation receipt
```

### Offline Payment (Cash on Delivery)

```
User clicks "Checkout" with "Cash on Delivery" or "Pay on Delivery"
    ↓
Cart.jsx calls POST /api/payments/offline
    ↓
Backend stores order with payment_status='pending_offline'
    ↓
Redirects to /payment-success
    ↓
Shows order confirmation with note: "Payment pending - Pay on delivery"
    ↓
Delivery driver collects payment in person
```

## Testing

### Test Card Numbers (Use in TEST mode)

| Provider | Card Number | MM/YY | CVC |
|----------|-------------|-------|-----|
| Visa | 4111 1111 1111 1111 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |

### Test Payment Flow

1. Go to your website → **Add products to cart**
2. Click **Checkout**
3. Select **Online Payment**
4. Click **Checkout** button
5. You'll be redirected to Paystack
6. Use test card numbers above
7. Enter any name, email, etc.
8. You'll be redirected back to payment-success page

## Production Setup

When ready for LIVE payments:

1. **Update Paystack Keys** to LIVE keys:
   - Go to Paystack Dashboard
   - Switch from **Test** to **Live** in top-left
   - Copy your LIVE Secret and Public keys
   - Update `server/.env` with live keys

2. **Update Frontend Environment**:
   - Update `src/.env` with LIVE public key

3. **Set Database to Production**:
   - Use production PostgreSQL database (AWS RDS, Railway, etc.)
   - Update `server/.env` DB credentials

4. **Enable HTTPS**:
   - Paystack requires HTTPS in production
   - Deploy to Heroku, Railway, Render, Netlify, Vercel, etc.

5. **Configure Webhook** (Optional but Recommended):
   - In Paystack Dashboard → Settings → Developer → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - This confirms payments even if user loses connection

## API Reference

### POST /api/payments/initialize
Initializes a Paystack payment.

**Request:**
```json
{
  "email": "customer@example.com",
  "amount": 50000,
  "orderId": "ITEC-2024-123456",
  "customerName": "John Doe",
  "phone": "+234803xxxxxxx",
  "address": "123 Main Street",
  "items": [
    { "id": 1, "title": "Product", "price": 50000, "qty": 1 }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/xxxxx",
  "reference": "ITEC-2024-123456-1234567890",
  "accessCode": "xxxxx"
}
```

### GET /api/payments/verify/:reference
Verifies a Paystack payment.

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "reference": "ref-xxxxx",
    "amount": 50000,
    "status": "completed",
    "orderId": "ITEC-2024-123456"
  }
}
```

### POST /api/payments/offline
Process offline payment (Cash on Delivery).

**Request:**
```json
{
  "orderId": "ITEC-2024-123456",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "amount": 50000,
  "paymentMethod": "Cash on Delivery",
  "phone": "+234803xxxxxxx",
  "address": "123 Main Street",
  "items": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order ITEC-2024-123456 created. Payment: Cash on Delivery",
  "orderId": "ITEC-2024-123456"
}
```

## Troubleshooting

### Issue: "Payment initialization failed"
- ✅ Check your Paystack API key in `server/.env`
- ✅ Make sure PAYSTACK_SECRET_KEY is set correctly
- ✅ Restart backend server

### Issue: Payment page shows 404
- ✅ Make sure you added PaymentPage import and route in App.jsx
- ✅ Restart frontend dev server

### Issue: "Redirect URL not registered"
- ✅ You might be using live keys in test mode or vice versa
- ✅ Check your dashboard mode (test/live toggle)

### Issue: Payment goes through but receipt doesn't show
- ✅ Check browser console for errors
- ✅ Check if `/api/payments/verify` endpoint is accessible
- ✅ Make sure backend is running

## Next Steps

1. ✅ Set up Paystack account and get keys
2. ✅ Update `server/.env` with your keys
3. ✅ Test with test card numbers
4. ✅ Verify orders are stored in database
5. ✅ Check emails are being sent on payment
6. ✅ Deploy to production with live keys
7. 🔄 Monitor Paystack dashboard for transactions

## Important Security Notes

⚠️ **NEVER** commit your `.env` file with real API keys
⚠️ **NEVER** hardcode API keys in frontend code
⚠️ **ALWAYS** use HTTPS in production
⚠️ **ALWAYS** verify payments on backend (don't trust frontend)
⚠️ **ENABLE** 2FA on your Paystack account

## Support

- 📚 Paystack Docs: https://paystack.com/docs
- 💬 Paystack Support: https://paystack.com/contact
- 📧 Your Email: itechstore23334@gmail.com
- 💳 Backend API: http://localhost:4000/api

---

**Your website is now ready for REAL PAYMENTS! 🎉**

Start accepting payments from your customers immediately.
