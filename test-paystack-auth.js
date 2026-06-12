const https = require('https');

// Try to hit a different endpoint to test authentication
const PAYSTACK_SECRET_KEY = 'sk_test_3eddcd7e66dc5aec2928c6f732075e6edd39c3f4';

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/api/balance',  // This endpoint should work if the key is valid
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
  }
};

console.log('🔍 Testing Paystack API Authentication with GET /api/balance...\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    if (data) {
      try {
        console.log('Parsed:', JSON.stringify(JSON.parse(data), null, 2));
      } catch (e) {
        console.log('Not JSON');
      }
    }
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();
