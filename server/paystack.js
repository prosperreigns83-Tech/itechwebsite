/**
 * Paystack Payment Integration
 * Handles payment processing, verification, and webhook handling
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_key_here';
const PAYSTACK_API_URL = 'https://api.paystack.co';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5173/#/payment-success';
const PAYSTACK_WEBHOOK_URL = process.env.PAYSTACK_WEBHOOK_URL || 'http://localhost:4000/api/payments/webhook';

// Log key pattern to verify correct environment loading
const keyPattern = PAYSTACK_SECRET_KEY ? `${PAYSTACK_SECRET_KEY.substring(0, 7)}...${PAYSTACK_SECRET_KEY.slice(-3)}` : 'UNDEFINED';
console.log('🔵 Paystack initialized with key:', keyPattern);
console.log('🔵 Paystack API URL:', PAYSTACK_API_URL);
console.log('🔵 Paystack Callback URL:', PAYSTACK_CALLBACK_URL);
console.log('🔵 Paystack Webhook URL:', PAYSTACK_WEBHOOK_URL);
console.log('🔵 Environment:', process.env.NODE_ENV || 'development');

/**
 * Initialize payment with Paystack
 * Creates a payment authorization URL
 */
async function initializePayment(email, amount, reference, metadata = {}) {
  try {
    const payload = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo (Paystack uses smallest currency unit)
      reference,
      callback_url: PAYSTACK_CALLBACK_URL,
      metadata,
      currency: 'NGN'
    };

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🟡 PAYSTACK PAYMENT INITIALIZATION');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📧 Email:', email);
    console.log('💰 Amount:', amount, 'NGN →', Math.round(amount * 100), 'kobo');
    console.log('🔖 Reference:', reference);
    console.log('📝 Metadata:', JSON.stringify(metadata, null, 2));
    console.log('🌐 API URL:', `${PAYSTACK_API_URL}/api/transaction/initialize`);
    console.log('🔑 Secret Key Pattern:', PAYSTACK_SECRET_KEY.substring(0, 10) + '...');

    const response = await fetch(`${PAYSTACK_API_URL}/api/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('\n✓ Paystack request sent successfully');
    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('📋 Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length'),
      'server': response.headers.get('server')
    });
    
    const data = await response.text();
    console.log('📦 Response Body Length:', data.length, 'bytes');
    if (data) {
      console.log('📦 Response Body:', data.substring(0, 500));
    } else {
      console.log('⚠️  Response Body is EMPTY!');
    }

    // Check HTTP status first
    if (response.status === 404) {
      console.error('\n❌ HTTP 404 NOT FOUND');
      console.error('Possible causes:');
      console.error('  1. Invalid Paystack secret key');
      console.error('  2. Account not activated');
      console.error('  3. Wrong API endpoint');
      console.error('  4. Network/proxy issue');
      return {
        success: false,
        message: 'Paystack API returned 404 - Check your secret key validity and account status',
        statusCode: 404,
        debug: {
          url: `${PAYSTACK_API_URL}/api/transaction/initialize`,
          keyPrefix: PAYSTACK_SECRET_KEY.substring(0, 10)
        }
      };
    }

    if (!response.ok) {
      console.error('\n❌ Paystack HTTP Error:', response.status, response.statusText);
      return {
        success: false,
        message: `Paystack API error: ${response.status} ${response.statusText}`,
        statusCode: response.status
      };
    }

    if (!data) {
      console.error('\n❌ Paystack returned empty response');
      return {
        success: false,
        message: 'Paystack returned empty response - possible server issue',
        statusCode: response.status
      };
    }

    const result = JSON.parse(data);
    console.log('\n✅ Response Parsed Successfully');
    console.log('📊 Response Object:', {
      status: result.status,
      message: result.message,
      hasData: !!result.data,
      dataKeys: result.data ? Object.keys(result.data) : []
    });

    if (result.status) {
      console.log('✅ PAYMENT INITIALIZATION SUCCESSFUL');
      console.log('🔗 Authorization URL:', result.data.authorization_url.substring(0, 50) + '...');
      console.log('🎟️  Access Code:', result.data.access_code);
      console.log('═══════════════════════════════════════════════════════════\n');
      
      return {
        success: true,
        authorizationUrl: result.data.authorization_url,
        accessCode: result.data.access_code,
        reference: result.data.reference
      };
    } else {
      console.error('❌ Paystack returned status false');
      console.error('Message:', result.message);
      console.error('═══════════════════════════════════════════════════════════\n');
      
      return {
        success: false,
        message: result.message || 'Payment initialization failed'
      };
    }
  } catch (error) {
    console.error('\n❌ PAYSTACK REQUEST EXCEPTION');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Stack Trace:', error.stack);
    console.error('═══════════════════════════════════════════════════════════\n');
    
    return {
      success: false,
      message: 'Failed to initialize payment: ' + error.message,
      error: error.message,
      errorName: error.name
    };
  }
}

/**
 * Verify payment with Paystack
 * Checks if payment was successful
 */
async function verifyPayment(reference) {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🟡 PAYSTACK PAYMENT VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔖 Reference:', reference);
    console.log('🌐 API URL:', `${PAYSTACK_API_URL}/api/transaction/verify/${reference}`);

    const response = await fetch(`${PAYSTACK_API_URL}/api/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    console.log('📊 Response Status:', response.status, response.statusText);
    
    const data = await response.text();
    console.log('📦 Response Body Length:', data.length, 'bytes');

    if (!response.ok) {
      console.error('❌ Paystack verification error:', response.status);
      return {
        success: false,
        status: 'failed',
        message: `Paystack API error: ${response.status}`
      };
    }

    if (!data) {
      console.error('❌ Paystack returned empty response');
      return {
        success: false,
        status: 'failed',
        message: 'Paystack returned empty response'
      };
    }

    const result = JSON.parse(data);
    console.log('✅ Response Parsed Successfully');
    console.log('📊 Payment Status:', result.data?.status);
    
    if (result.status && result.data.status === 'success') {
      console.log('✅ PAYMENT VERIFIED SUCCESSFULLY');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      return {
        success: true,
        amount: result.data.amount / 100, // Convert back from kobo
        reference: result.data.reference,
        status: result.data.status,
        customer: result.data.customer,
        authorization: result.data.authorization,
        customer_code: result.data.customer_code
      };
    } else {
      console.error('❌ Payment verification failed');
      console.error('Status:', result.data?.status);
      console.error('═══════════════════════════════════════════════════════════\n');
      
      return {
        success: false,
        status: result.data?.status || 'failed',
        message: result.message || 'Payment verification failed'
      };
    }
  } catch (error) {
    console.error('❌ PAYSTACK VERIFICATION EXCEPTION');
    console.error('Error:', error.message);
    console.error('═══════════════════════════════════════════════════════════\n');
    
    return {
      success: false,
      status: 'failed',
      message: 'Failed to verify payment',
      error: error.message
    };
  }
}

/**
 * Process webhook from Paystack
 * Called when payment status changes
 */
function verifyWebhookSignature(signature, body) {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');
  
  return hash === signature;
}

module.exports = {
  initializePayment,
  verifyPayment,
  verifyWebhookSignature
};
