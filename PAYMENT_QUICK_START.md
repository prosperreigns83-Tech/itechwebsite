# Quick Start: Test Your Real Payment System

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Paystack Test Keys (2 min)

1. Go to https://paystack.com/signup
2. Sign up with your email
3. Verify email
4. Go to **Settings** → **Developer**
5. Copy these:
   - **Public Key**: starts with `pk_test_`
   - **Secret Key**: starts with `sk_test_`

### Step 2: Update Backend Configuration (1 min)

1. Open `server/.env`
2. Add these lines:
   ```env
   PAYSTACK_SECRET_KEY=sk_test_your_key_here
   PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
   ```
3. Replace `your_key_here` with your actual keys from Paystack

### Step 3: Start All Services (1 min)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend (new terminal):**
```bash
npm run dev
```

**Database**: Already running (PostgreSQL)

### Step 4: Test Payment (1 min)

1. Go to `http://localhost:5173`
2. Add some products to cart
3. Click **Cart** → **Checkout**
4. Select **Online Payment**
5. Click **Checkout**
6. You'll be redirected to Paystack
7. Enter test card:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `05/30`)
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Name**: Anything (e.g., `Test User`)
   - **Phone**: Anything
8. Complete payment
9. You'll be redirected back to payment success page ✅

## 📋 What You Should See

### After Payment Success:
- ✅ "Payment Received!" message
- ✅ Order ID displayed
- ✅ Payment reference ID
- ✅ Receipt with all items
- ✅ Customer details from your profile
- ✅ Total amount charged

### In Backend Terminal:
- ✅ `Payment initialized` message
- ✅ `Payment confirmed` message
- ✅ Order ID stored in database

### In Your Email:
- ✅ Order confirmation email sent to your registered email

## 🔄 Test Offline Payment

1. Go back to Home
2. Add products to cart again
3. Click **Cart** → **Checkout**
4. Select **Cash on Delivery** or **Pay on Delivery**
5. Click **Checkout**
6. ✅ You'll see payment success immediately (no Paystack)
7. Order will show "Payment pending - Pay on delivery"

## 🐛 Common Issues & Solutions

### Issue: "Missing Paystack keys"
```
Solution: Make sure PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY are in server/.env
Then restart backend (Ctrl+C and npm start again)
```

### Issue: "Payment page shows blank"
```
Solution: 
1. Open browser console (F12)
2. Check for errors
3. Make sure backend is running on http://localhost:4000
4. Check network tab for failed requests
```

### Issue: "Redirect back to your site failed"
```
Solution:
1. Check if frontend is running on http://localhost:5173
2. Check browser console for errors
3. Make sure backend `/api/payments/verify` endpoint is working
```

### Issue: "Order not showing in database"
```
Solution:
1. Make sure PostgreSQL is running
2. Check if database itech_store exists
3. Check if orders table has data with command:
   psql -U postgres -d itech_store -c "SELECT * FROM orders LIMIT 5;"
```

## 📊 Verify Everything Works

### Test Checklist:

- [ ] Paystack account created
- [ ] API keys copied and saved in `server/.env`
- [ ] Backend running (shows `listening on http://localhost:4000`)
- [ ] Frontend running (shows `Local: http://localhost:5173`)
- [ ] Can add products to cart
- [ ] Checkout redirects to Paystack with test keys
- [ ] Can complete payment with test card
- [ ] Redirected back to payment success page
- [ ] Order shows in payment success receipt
- [ ] Order stored in database
- [ ] Confirmation email received

## 🎉 You're Ready!

Once all items in checklist are working, your **REAL PAYMENT SYSTEM IS LIVE**!

### Next Steps:
1. Test a few more payments with different payment methods
2. Check all orders are stored correctly in database
3. When ready for production:
   - Get LIVE keys from Paystack (not test keys)
   - Update `server/.env` with LIVE keys
   - Deploy to production
   - Switch from test mode to live mode

## 📞 Need Help?

- Check `PAYMENT_SETUP.md` for detailed setup guide
- Paystack Docs: https://paystack.com/docs
- Backend logs: Check terminal output for errors
- Browser Console: Press F12 and check Console tab for errors

---

**Your payment system is ready! Test it now! 💳✨**
