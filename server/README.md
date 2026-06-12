# Itech Backend (Local Dev)

Minimal Express + SQLite backend for local development.

## Features
- Create orders: `POST /api/orders`
- Fetch order: `GET /api/orders/:orderId`
- Payment webhook: `POST /api/payments/webhook` (simulate Paystack)

## Setup
From the `server/` folder:

```bash
npm install
npm run dev
```

The server listens on port `4000` by default.

## Example: Create an order

```bash
curl -X POST http://localhost:4000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"John Doe","email":"john@example.com","items":[{"name":"Widget","qty":1,"price":1000}],"subtotal":1000,"deliveryFee":200,"discount":0,"tax":0,"total":1200}'
```

Response:

```json
{ "ok": true, "orderId": "ITEC-...", "referenceId": "REF-..." }
```

## Example: Fetch order

```bash
curl http://localhost:4000/api/orders/ITEC-... 
```

## Example: Simulate payment webhook

```bash
curl -X POST http://localhost:4000/api/payments/webhook \
  -H 'Content-Type: application/json' \
  -d '{"referenceId":"REF-...","status":"success"}'
```

## Frontend integration
- Create order from frontend and store `orderId`/`referenceId`.
- After successful payment, call the webhook endpoint (or use payment provider webhook to call it) to update order status.
- Fetch order via `GET /api/orders/:orderId` and pass the data into `PaymentSuccess` as `orderData` prop.

Example fetch then navigate:

```js
const resp = await fetch('/api/orders', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
const json = await resp.json();
// then
onNavigate('payment-success');
``` 

