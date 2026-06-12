const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Load environment variables from .env file
const db = require('./db');
const faqData = loadFaqData();

const fetchApi = typeof fetch === 'function' ? fetch.bind(global) : null;
const walletsStore = require('./wallets');
const { generateInvoicePDF } = require('./generateInvoice');
const { sendOrderNotificationToCompany, sendPasswordResetEmail, sendContactFormEmail } = require('./email');
const { storeResetToken, verifyResetToken, invalidateToken, cleanupExpiredTokens } = require('./resetTokens');
const { getAllProducts, getProductsBySource, addProduct, updateProduct, deleteProduct, searchProducts } = require('./productManagerPSQL');
const { testConnection } = require('./database');

// Security & Middleware
const { configureCors, configureHelmet, configureCompression, addRequestId, configureBodyParser } = require('./middleware/security');
const { apiLimiter, authLimiter, passwordResetLimiter, checkoutLimiter } = require('./middleware/rateLimiter');
const { validateLogin, validateRegister, validateProduct, validateOrder, validatePasswordReset, validateSearch } = require('./middleware/validation');
const { asyncHandler, errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { sendSuccess, sendError, sendCreated, attachResponseHelpers } = require('./utils/apiResponse');
const { hashPassword, verifyPassword } = require('./utils/passwordHash');

const app = express();

// Security Configuration
configureHelmet(app);
configureCors(app);
configureCompression(app);
configureBodyParser(app);
app.use(addRequestId());
app.use(attachResponseHelpers);

// --- Local preview routes for splash screen (serve files from parent workspace) ---
const parentRoot = path.join(__dirname, '..');
app.get('/splash.html', (req, res) => res.sendFile(path.join(parentRoot, 'splash.html')));
app.get('/splash.css', (req, res) => res.sendFile(path.join(parentRoot, 'splash.css')));
app.get('/splash.js', (req, res) => res.sendFile(path.join(parentRoot, 'splash.js')));
app.use('/public', express.static(path.join(parentRoot, 'public')));


const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_replace_me';

function makeOrderId() {
  const dt = new Date();
  return `ITEC-${dt.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function loadFaqData() {
  try {
    const faqPath = path.join(__dirname, 'data', 'faq.json');
    const payload = fs.readFileSync(faqPath, 'utf8');
    const faq = JSON.parse(payload);
    return Array.isArray(faq) ? faq : [];
  } catch (error) {
    console.warn('Failed to load FAQ data:', error.message);
    return [];
  }
}

function findRelevantFaqEntries(question) {
  const normalized = question.toLowerCase();
  return faqData
    .map((entry) => {
      const score = entry.keywords.reduce((sum, keyword) => {
        return sum + (normalized.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.entry);
}

function buildChatbotPrompt(question) {
  const relevantFaq = findRelevantFaqEntries(question);
  const faqContext = relevantFaq.length > 0
    ? relevantFaq.map((item, index) => `${index + 1}. Q: ${item.question}\nA: ${item.answer}`).join('\n\n')
    : '';

  const systemPrompt = {
    role: 'system',
    content: 'You are a helpful support assistant for iTech Store. Use the provided company FAQ and product information to answer customer questions accurately, politely, and concisely.'
  };

  const messages = [systemPrompt];

  if (faqContext) {
    messages.push({
      role: 'system',
      content: `The following company FAQ is relevant to the customer question:\n\n${faqContext}`
    });
  }

  messages.push({
    role: 'user',
    content: question
  });

  return messages;
}

// ===== PRODUCTS API ENDPOINTS =====

/**
 * GET /api/products - Get all products or filter by source
 * Query params: ?source=local|aliexpress|amazon|external
 * Example: /api/products?source=local
 */
app.get('/api/products', apiLimiter, asyncHandler(async (req, res) => {
  const { source } = req.query;
  
  let products;
  if (source) {
    products = await getProductsBySource(source);
  } else {
    products = await getAllProducts();
  }
  
  res.sendSuccess(products, 'Products retrieved');
}));

/**
 * GET /api/products/search?q=keyword - Search products
 */
app.get('/api/products/search', apiLimiter, validateSearch, asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  const results = await searchProducts(q);
  res.sendSuccess(results, 'Search completed');
}));

/**
 * POST /api/products - Add a new product
 * Body: { title, price, category, subtitle, image, source }
 */
app.post('/api/products', apiLimiter, validateProduct, asyncHandler(async (req, res) => {
  const { title, price, category, subtitle, image, source = 'local' } = req.body;
  
  const newProduct = {
    title,
    price,
    category,
    subtitle: subtitle || '',
    image: image || '',
    source
  };
  
  const product = await addProduct(newProduct);
  res.sendCreated(product, 'Product added successfully');
}));

/**
 * PUT /api/products/:id - Update a product
 */
app.put('/api/products/:id', apiLimiter, validateProduct, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);
  
  const updated = await updateProduct(productId, req.body);
  res.sendSuccess(updated, 'Product updated successfully');
}));

/**
 * DELETE /api/products/:id - Delete a product
 */
app.delete('/api/products/:id', apiLimiter, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);
  
  await deleteProduct(productId);
  res.sendSuccess({}, 'Product deleted successfully');
}));

// Contact form endpoint
app.post('/api/contact', apiLimiter, asyncHandler(async (req, res) => {
  const { email, subject, message } = req.body;

  // Validate required fields
  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Send email to company
  const result = await sendContactFormEmail({ email, subject, message });

  res.sendSuccess({}, result.success 
    ? 'Thank you! Your message has been received.'
    : 'Message received. We will contact you soon.');
}));

// Chatbot endpoint using OpenAI
app.post('/api/chatbot', apiLimiter, asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ success: false, error: 'Question is required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ success: false, error: 'OpenAI API key is not configured.' });
  }

  if (!fetchApi) {
    return res.status(500).json({ success: false, error: 'Server fetch is unavailable. Upgrade Node to 18+.' });
  }

  const promptMessages = buildChatbotPrompt(question);

  const openAiResponse = await fetchApi('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: promptMessages,
      temperature: 0.8,
      max_tokens: 250,
      n: 1
    })
  });

  if (!openAiResponse.ok) {
    const errorText = await openAiResponse.text();
    throw new Error(`OpenAI error: ${errorText}`);
  }

  const responsePayload = await openAiResponse.json();
  const botAnswer = responsePayload?.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate an answer right now.';

  res.sendSuccess({ answer: botAnswer }, 'Chat response generated');
}));

// Create order endpoint
app.post('/api/orders', checkoutLimiter, validateOrder, asyncHandler(async (req, res) => {
  const payload = req.body;
  const orderId = payload.orderId || makeOrderId();
  const referenceId = payload.referenceId || uuidv4();
  const order = {
    orderId,
    referenceId,
    status: 'created',
    data: payload,
    timeline: [ { step: 'Order Created', date: new Date().toISOString(), status: 'created' } ]
  };
  const created = db.createOrder(order);
  
  // Send email notification to company
  const customerEmail = payload.email || 'customer@example.com';
  sendOrderNotificationToCompany({
    orderId: orderId,
    referenceId: referenceId,
    customerName: payload.customerName || 'Customer',
    phone: payload.phone || '',
    address: payload.address || '',
    paymentMethod: payload.paymentMethod || '',
    items: payload.items || [],
    subtotal: payload.subtotal || 0,
    deliveryFee: payload.deliveryFee || 0,
    discount: payload.discount || 0,
    tax: payload.tax || 0,
    total: payload.total || 0
  }, customerEmail);
  
  res.sendCreated({ ...created, ...order }, 'Order created successfully');
}));

// Fetch order by orderId
app.get('/api/orders/:orderId', asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = db.getOrderByOrderId(orderId);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  res.sendSuccess(order, 'Order retrieved');
}));

// Simple webhook for payment provider (e.g., Paystack)
app.post('/api/payments/webhook', asyncHandler(async (req, res) => {
  // Expecting { referenceId, status, paymentDate }
  const { referenceId, status, paymentDate } = req.body;
  if (!referenceId) return res.status(400).json({ success: false, error: 'Missing referenceId' });
  // Map incoming status to internal
  const mappedStatus = status === 'success' || status === 'paid' ? 'payment_received' : status;
  const timelineEvent = { step: 'Payment Received', date: paymentDate || new Date().toISOString(), status: mappedStatus };
  const updated = db.updateOrderTimelineAndStatus(referenceId, mappedStatus, timelineEvent);
  if (!updated) return res.status(404).json({ success: false, error: 'Order not found' });
  res.sendSuccess(updated, 'Payment webhook processed');
}));

// Generate and download invoice PDF
app.get('/api/invoices/:orderId/pdf', asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = db.getOrderByOrderId(orderId);
  
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  // Merge order data with customer details
  const invoiceData = {
    id: order.id,
    orderId: order.orderId,
    referenceId: order.referenceId,
    status: order.status,
    createdAt: order.createdAt,
    customerName: order.data?.customerName || 'Customer',
    email: order.data?.email || '',
    address: order.data?.address || '',
    items: order.data?.items || []
  };

  const pdfBuffer = await generateInvoicePDF(invoiceData);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.referenceId}.pdf"`);
  res.send(pdfBuffer);
}));

// --- Simple auth endpoints (for local dev) ---
app.post('/api/auth/login', authLimiter, validateLogin, asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;
  
  // In production: verify against database with hashed password
  // For now: create session token
  const user = {
    id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
    email,
    name: name || email.split('@')[0],
    role: role || 'buyer'
  };
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.sendSuccess({ token, user }, 'Login successful');
}));

// Forgot password endpoint
app.post('/api/auth/forgot-password', passwordResetLimiter, validatePasswordReset, asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Generate reset token
  const resetToken = uuidv4();
  storeResetToken(email, resetToken);

  // Send password reset email
  await sendPasswordResetEmail(email, resetToken);

  res.sendSuccess({ resetToken }, 'Password reset email sent');
}));

// Reset password endpoint
app.post('/api/auth/reset-password', passwordResetLimiter, asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and password are required' });
  }

  // Verify reset token
  const verification = verifyResetToken(token);
  if (!verification.valid) {
    return res.status(400).json({ success: false, message: verification.error });
  }

  // Hash password for storage
  const hashedPassword = hashPassword(password);

  // In a real app: Update user record in database with hashed password
  // For now: just mark token as used
  invalidateToken(token);

  res.sendSuccess({}, 'Password reset successfully');
}));

// Verify reset token endpoint (frontend can check if token is valid)
app.get('/api/auth/verify-token/:token', (req, res) => {
  try {
    const { token } = req.params;
    const verification = verifyResetToken(token);
    
    if (!verification.valid) {
      return res.status(400).json({ success: false, message: verification.error });
    }

    res.sendSuccess({ email: verification.email }, 'Token valid');
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(500).json({ success: false, message: 'Failed to verify token' });
  }
});

// Clean up expired tokens periodically
setInterval(() => {
  cleanupExpiredTokens();
}, 3600000); // Run every hour

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, message: 'Missing Authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ success: false, message: 'Invalid Authorization format' });
  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.sendSuccess({ user: { id: req.user.sub, email: req.user.email, name: req.user.name, role: req.user.role } }, 'User retrieved');
});

// ===== PAYMENT API ENDPOINTS (PAYSTACK INTEGRATION) =====

/**
 * POST /api/payments/initialize
 * Initialize a payment with Paystack
 * Body: { email, amount, orderId, customerName, items, address, phone }
 */
app.post('/api/payments/initialize', checkoutLimiter, asyncHandler(async (req, res) => {
  const { email, amount, orderId, customerName, items, address, phone } = req.body;

  if (!email || !amount || !orderId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: email, amount, orderId' 
    });
  }

  const { initializePayment } = require('./paystack');
  
  const reference = `${orderId}-${Date.now()}`;
  const metadata = {
    orderId,
    customerName,
    email,
    phone,
    address,
    itemCount: items?.length || 0,
    timestamp: new Date().toISOString()
  };

  const result = await initializePayment(email, amount, reference, metadata);
  
  if (result.success) {
    // Store pending payment in database
    const order = {
      orderId,
      referenceId: reference,
      status: 'pending',
      data: {
        email,
        customerName,
        items: items || [],
        totalAmount: amount,
        paymentReference: reference,
        address,
        phone
      },
      timeline: [ { step: 'Payment Pending', date: new Date().toISOString(), status: 'pending' } ]
    };
    db.createOrder(order);

    res.sendSuccess({
      authorizationUrl: result.authorizationUrl,
      reference,
      accessCode: result.accessCode
    }, 'Payment initialized');
  } else {
    res.status(400).json({
      success: false,
      message: result.message || 'Failed to initialize payment'
    });
  }
}));

/**
 * POST /api/payments/offline
 * Create an offline payment order for Cash on Delivery or Pay on Delivery
 */
app.post('/api/payments/offline', checkoutLimiter, asyncHandler(async (req, res) => {
  const { orderId, customerEmail, customerName, amount, paymentMethod, items, address, addressId, phone } = req.body;

  if (!orderId || !customerEmail || !amount || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'Missing required offline payment fields: orderId, customerEmail, amount, paymentMethod'
    });
  }

  const order = {
    orderId,
    referenceId: `${orderId}-${Date.now()}`,
    status: 'pending',
    data: {
      email: customerEmail,
      customerName: customerName || customerEmail,
      items: items || [],
      totalAmount: amount,
      paymentMethod,
      paymentReference: null,
      address,
      addressId,
      phone,
      offline: true
    },
    timeline: [
      { step: 'Order Created', date: new Date().toISOString(), status: 'pending' },
      { step: 'Awaiting Payment', date: new Date().toISOString(), status: 'pending' }
    ]
  };

  db.createOrder(order);

  res.sendCreated({ orderId, paymentMethod, totalAmount: amount }, 'Offline order created successfully');
}));

/**
 * POST /api/wallets/initialize-funding
 * Initialize a wallet funding payment with Paystack
 */
app.post('/api/wallets/initialize-funding', checkoutLimiter, asyncHandler(async (req, res) => {
  const { userId, email, amount } = req.body;

  if (!userId || !email || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, email, amount'
    });
  }

  const { initializePayment } = require('./paystack');
  const reference = `WALLET-${userId}-${Date.now()}`;
  const metadata = {
    type: 'wallet_funding',
    userId,
    email,
    amount,
    timestamp: new Date().toISOString()
  };

  walletsStore.createWalletFunding(userId, amount, reference, metadata);

  const result = await initializePayment(email, amount, reference, metadata);
  if (result.success) {
    res.sendSuccess({
      authorizationUrl: result.authorizationUrl,
      reference,
      accessCode: result.accessCode
    }, 'Wallet funding initialized');
  } else {
    walletsStore.updateWalletFunding(reference, { status: 'failed', event: { step: 'initialization_failed', date: new Date().toISOString(), status: 'failed' } });
    res.status(400).json({
      success: false,
      message: result.message || 'Failed to initialize wallet funding'
    });
  }
}));

/**
 * GET /api/wallets/:userId
 * Get wallet summary for a user
 */
app.get('/api/wallets/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing userId' });
  }

  const wallet = walletsStore.getWalletSummary(userId);
  res.sendSuccess(wallet, 'Wallet retrieved');
}));

/**
 * GET /api/payments/verify/:reference
 * Verify payment status from Paystack
 */
app.get('/api/payments/verify/:reference', asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const { verifyPayment } = require('./paystack');

  const result = await verifyPayment(reference);
  const walletFunding = walletsStore.getWalletFundingByReference(reference);

  if (walletFunding) {
    if (!result.success) {
      walletsStore.updateWalletFunding(reference, {
        status: 'failed',
        event: { step: 'verification_failed', date: new Date().toISOString(), status: 'failed' }
      });
      return res.status(400).json({
        success: false,
        message: result.message || 'Wallet funding verification failed',
        status: result.status
      });
    }

    const wallet = walletsStore.creditWallet(walletFunding.userId, result.amount, {
      reference,
      category: 'wallet_funding',
      title: 'Wallet top-up',
      description: 'Wallet funded via Paystack',
      metadata: walletFunding.metadata
    });

    walletsStore.updateWalletFunding(reference, {
      status: 'completed',
      event: { step: 'wallet_funded', date: new Date().toISOString(), status: 'completed' }
    });

    return res.sendSuccess({
      reference,
      amount: result.amount,
      status: 'completed',
      type: 'wallet_funding',
      userId: walletFunding.userId,
      walletBalance: wallet.balance
    }, 'Wallet funding verified successfully');
  }

  if (result.success) {
    // Extract orderId from reference (format: orderId-timestamp)
    const orderId = reference.split('-').slice(0, -1).join('-');

    // Update order status to confirmed
    db.updateOrderTimelineAndStatus(reference, 'confirmed', {
      step: 'Payment Confirmed',
      date: new Date().toISOString(),
      status: 'confirmed'
    });

    res.sendSuccess({
      reference,
      amount: result.amount,
      status: 'completed',
      customer: result.customer,
      orderId
    }, 'Payment verified successfully');
  } else {
    res.status(400).json({
      success: false,
      message: result.message || 'Payment verification failed',
      status: result.status
    });
  }
}));

/**
 * ALIAS ROUTES - For /api/paystack/* endpoints
 * These are aliases for /api/payments/* for backwards compatibility
 */
app.post('/api/paystack/initialize', checkoutLimiter, asyncHandler(async (req, res) => {
  // Forward to payments/initialize
  const { email, amount, orderId, customerName, items, address, phone } = req.body;

  if (!email || !amount || !orderId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: email, amount, orderId' 
    });
  }

  const { initializePayment } = require('./paystack');
  
  const reference = `${orderId}-${Date.now()}`;
  const metadata = {
    orderId,
    customerName,
    email,
    phone,
    address,
    itemCount: items?.length || 0,
    timestamp: new Date().toISOString()
  };

  const result = await initializePayment(email, amount, reference, metadata);
  
  if (result.success) {
    const order = {
      orderId,
      referenceId: reference,
      status: 'pending',
      data: {
        email,
        customerName,
        items: items || [],
        totalAmount: amount,
        paymentReference: reference,
        address,
        phone
      },
      timeline: [ { step: 'Payment Pending', date: new Date().toISOString(), status: 'pending' } ]
    };
    db.createOrder(order);

    res.sendSuccess({
      authorizationUrl: result.authorizationUrl,
      reference,
      accessCode: result.accessCode
    }, 'Payment initialized');
  } else {
    res.status(400).json({
      success: false,
      message: result.message || 'Failed to initialize payment',
      debug: result.debug || {}
    });
  }
}));

app.get('/api/paystack/verify/:reference', asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const { verifyPayment } = require('./paystack');

  const result = await verifyPayment(reference);

  if (result.success) {
    const orderId = reference.split('-').slice(0, -1).join('-');
    db.updateOrderTimelineAndStatus(reference, 'confirmed', {
      step: 'Payment Confirmed',
      date: new Date().toISOString(),
      status: 'confirmed'
    });

    res.sendSuccess({
      reference,
      amount: result.amount,
      status: 'completed',
      customer: result.customer,
      orderId
    }, 'Payment verified successfully');
  } else {
    res.status(400).json({
      success: false,
      message: result.message || 'Payment verification failed',
      status: result.status
    });
  }
}));

/**
 * POST /api/payments/webhook
 * Paystack webhook - called when payment status changes
 * Configure this URL in Paystack dashboard
 */
app.post('/api/payments/webhook', asyncHandler(async (req, res) => {
  const { verifyWebhookSignature } = require('./paystack');
  const signature = req.headers['x-paystack-signature'];
  const body = req.rawBody || JSON.stringify(req.body);

  if (!verifyWebhookSignature(signature, body)) {
    console.warn('Invalid webhook signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  const event = req.body;
  
  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data;
    const orderId = reference.split('-').slice(0, -1).join('-');

    // Update order status
    db.updateOrderTimelineAndStatus(reference, 'confirmed', {
      step: 'Payment Received',
      date: new Date().toISOString(),
      status: 'confirmed'
    });

    // Send confirmation email
    await sendOrderNotificationToCompany({
      orderId,
      customerName: customer.first_name,
      customerEmail: customer.email,
      amount: amount / 100,
      status: 'paid'
    }).catch(err => console.error('Email error:', err));

    console.log(`Payment confirmed for order ${orderId}`);
  }

  res.sendSuccess({}, 'Webhook received');
}));

/**
 * POST /api/paystack/webhook (ALIAS)
 * Alias for /api/payments/webhook
 */
app.post('/api/paystack/webhook', asyncHandler(async (req, res) => {
  const { verifyWebhookSignature } = require('./paystack');
  const signature = req.headers['x-paystack-signature'];
  const body = req.rawBody || JSON.stringify(req.body);

  if (!verifyWebhookSignature(signature, body)) {
    console.warn('Invalid webhook signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  const event = req.body;
  
  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data;
    const orderId = reference.split('-').slice(0, -1).join('-');

    db.updateOrderTimelineAndStatus(reference, 'confirmed', {
      step: 'Payment Received',
      date: new Date().toISOString(),
      status: 'confirmed'
    });

    await sendOrderNotificationToCompany({
      orderId,
      customerName: customer.first_name,
      customerEmail: customer.email,
      amount: amount / 100,
      status: 'paid'
    }).catch(err => console.error('Email error:', err));

    console.log(`Payment confirmed for order ${orderId}`);
  }

  res.sendSuccess({}, 'Webhook received');
}));

/**
 * POST /api/payments/offline
 * Process offline payment (Cash on Delivery, etc)
 */
app.post('/api/payments/offline', checkoutLimiter, asyncHandler(async (req, res) => {
  const { orderId, customerEmail, customerName, amount, paymentMethod, items, address, phone } = req.body;

  if (!orderId || !customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  // Create order using proper database abstraction
  const referenceId = uuidv4();
  const order = {
    orderId,
    referenceId,
    status: 'pending',
    data: {
      email: customerEmail,
      customerName,
      items: items || [],
      totalAmount: amount,
      paymentMethod,
      address,
      phone
    },
    timeline: [ 
      { step: 'Offline Order Created', date: new Date().toISOString(), status: 'pending' },
      { step: 'Payment Method', date: new Date().toISOString(), status: paymentMethod }
    ]
  };

  const created = db.createOrder(order);

  // Send confirmation email
  await sendOrderNotificationToCompany({
    orderId,
    referenceId,
    customerName,
    customerEmail,
    amount,
    status: 'pending_offline',
    paymentMethod,
    items: items || [],
    address,
    phone
  }, customerEmail).catch(err => console.error('Email error:', err));

  res.sendSuccess({ orderId, referenceId: created.referenceId }, `Order ${orderId} created. Payment: ${paymentMethod}`);
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.sendSuccess({ status: 'ok', timestamp: new Date().toISOString() }, 'Server healthy');
});

// Test Paystack connectivity
app.get('/api/test-paystack', asyncHandler(async (req, res) => {
  try {
    const key = process.env.PAYSTACK_SECRET_KEY;
    console.log('🔍 Testing Paystack with key:', key ? key.substring(0, 10) + '...' : 'UNDEFINED');
    
    const response = await fetch('https://api.paystack.co/api/transaction/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Paystack test response status:', response.status);
    const data = await response.text();
    console.log('Paystack test response:', data);

    if (response.ok) {
      res.sendSuccess(
        { 
          status: 'valid',
          keyPrefix: key ? key.substring(0, 10) : 'UNDEFINED',
          message: 'Paystack key is valid and connected'
        },
        'Paystack connectivity test passed'
      );
    } else {
      res.sendError(
        {
          status: 'invalid',
          httpStatus: response.status,
          message: 'Paystack returned error - key may be invalid'
        },
        'Paystack connectivity test failed',
        response.status
      );
    }
  } catch (error) {
    res.sendError(
      {
        status: 'error',
        message: error.message
      },
      'Paystack test error',
      500
    );
  }
}));

/**
 * MOCK PAYMENT ENDPOINT (FOR TESTING)
 * POST /api/payments/mock-initialize
 * Simulates a successful Paystack payment for testing
 */
app.post('/api/payments/mock-initialize', checkoutLimiter, asyncHandler(async (req, res) => {
  const { email, amount, orderId, customerName, items, address, phone } = req.body;

  if (!email || !amount || !orderId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: email, amount, orderId' 
    });
  }

  const reference = `MOCK-${orderId}-${Date.now()}`;
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🧪 MOCK PAYMENT INITIALIZATION (TEST MODE)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📧 Email:', email);
  console.log('💰 Amount:', amount, 'NGN');
  console.log('🔖 Reference:', reference);
  console.log('ℹ️  This is a TEST/MOCK payment - NOT a real transaction');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Store pending payment in database
  const order = {
    orderId,
    referenceId: reference,
    status: 'pending',
    data: {
      email,
      customerName,
      items: items || [],
      totalAmount: amount,
      paymentReference: reference,
      address,
      phone,
      paymentMode: 'mock'
    },
    timeline: [ { step: 'Mock Payment Pending', date: new Date().toISOString(), status: 'pending' } ]
  };
  db.createOrder(order);

  // Return mock success response
  res.sendSuccess({
    authorizationUrl: `http://localhost:4000/api/payments/mock-success?reference=${reference}`,
    reference,
    accessCode: 'mock_access_code',
    isMockPayment: true
  }, 'Mock payment initialized (TEST MODE)');
}));

/**
 * MOCK PAYMENT SUCCESS REDIRECT
 * GET /api/payments/mock-success
 * Simulates successful payment and redirects to success page
 */
app.get('/api/payments/mock-success', asyncHandler(async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ success: false, message: 'Missing reference' });
  }

  console.log('✅ MOCK PAYMENT SUCCESS - Reference:', reference);

  // Update order status to confirmed
  db.updateOrderTimelineAndStatus(reference, 'confirmed', {
    step: 'Mock Payment Confirmed',
    date: new Date().toISOString(),
    status: 'confirmed'
  });

  // Extract orderId from reference
  const parts = reference.split('-');
  const orderId = parts.slice(1, -1).join('-');

  // Redirect to frontend success page
  res.redirect(`http://localhost:5173/#/payment-success?reference=${reference}&orderId=${orderId}&mock=true`);
}));

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// ===== Seed default products on startup =====
async function seedDefaultProducts() {
  try {
    const products = await getAllProducts();
    
    // If products table is empty, load from products.json
    if (products.length === 0) {
      console.log('Loading default products...');
      const productsFilePath = path.join(__dirname, 'products.json');
      const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
      
      let addedCount = 0;
      for (const source in productsData) {
        for (const product of productsData[source]) {
          try {
            await addProduct({ ...product, source });
            addedCount++;
          } catch (err) {
            console.error(`Failed to add product "${product.title}":`, err.message);
          }
        }
      }
      console.log(`✓ Seeded ${addedCount} default products`);
    }
  } catch (err) {
    console.error('Error seeding default products:', err);
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  await seedDefaultProducts();
});
