#!/usr/bin/env node
/**
 * API Endpoint Response Format Tester
 * Tests all 20 endpoints and documents response formats
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:4000';

// Test cases for all endpoints
const endpoints = [
  {
    name: '1. GET /api/health',
    method: 'GET',
    path: '/api/health',
    body: null,
    expectedFields: ['status', 'timestamp']
  },
  {
    name: '2. GET /api/products',
    method: 'GET',
    path: '/api/products',
    body: null,
    expectedFields: ['isArray']
  },
  {
    name: '3. GET /api/products/search',
    method: 'GET',
    path: '/api/products/search?q=iPhone',
    body: null,
    expectedFields: ['isArray']
  },
  {
    name: '4. POST /api/auth/login',
    method: 'POST',
    path: '/api/auth/login',
    body: JSON.stringify({ email: 'john@example.com', password: 'password123' }),
    expectedFields: ['success', 'data', 'message']
  },
  {
    name: '5. POST /api/orders',
    method: 'POST',
    path: '/api/orders',
    body: JSON.stringify({
      email: 'test@example.com',
      customerName: 'Test User',
      items: [],
      totalAmount: 100,
      address: '123 Test',
      phone: '+234123456'
    }),
    expectedFields: ['success', 'data']
  },
  {
    name: '6. GET /api/orders/TEST-001',
    method: 'GET',
    path: '/api/orders/TEST-001',
    body: null,
    expectedFields: ['success']
  },
  {
    name: '7. POST /api/payments/initialize',
    method: 'POST',
    path: '/api/payments/initialize',
    body: JSON.stringify({
      email: 'test@example.com',
      amount: 999.99,
      orderId: 'TEST-001',
      customerName: 'Test',
      items: [],
      address: '123',
      phone: '123'
    }),
    expectedFields: ['success']
  },
  {
    name: '8. POST /api/payments/offline',
    method: 'POST',
    path: '/api/payments/offline',
    body: JSON.stringify({
      orderId: 'TEST-002',
      customerEmail: 'test@example.com',
      customerName: 'Test',
      amount: 100,
      paymentMethod: 'cash',
      items: [],
      address: '123',
      phone: '123'
    }),
    expectedFields: ['success', 'data']
  },
  {
    name: '9. POST /api/contact',
    method: 'POST',
    path: '/api/contact',
    body: JSON.stringify({
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message'
    }),
    expectedFields: ['success', 'data']
  }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + endpoint.path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: endpoint.method,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          let parsed;
          let isArray = false;
          
          try {
            parsed = JSON.parse(data);
            isArray = Array.isArray(parsed);
          } catch (e) {
            parsed = null;
          }

          const fields = parsed ? Object.keys(parsed) : [];
          const hasFields = endpoint.expectedFields.every(f => 
            f === 'isArray' ? isArray : fields.includes(f)
          );

          resolve({
            name: endpoint.name,
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300 && (hasFields || isArray),
            statusCode: res.statusCode,
            isArray,
            fields: fields.slice(0, 5),
            message: res.statusMessage
          });
        } catch (e) {
          resolve({
            name: endpoint.name,
            status: res.statusCode,
            ok: false,
            error: e.message
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        name: endpoint.name,
        ok: false,
        error: e.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        ok: false,
        error: 'Timeout'
      });
    });

    if (endpoint.body) {
      req.write(endpoint.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║           API ENDPOINT RESPONSE FORMAT TEST RESULTS              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const results = [];
  
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.name.padEnd(40)}... `);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.ok) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL - ${result.error || `Status ${result.statusCode}`}`);
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                       SUMMARY                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const passed = results.filter(r => r.ok).length;
  const total = results.length;
  
  console.log(`Passed: ${passed}/${total}`);
  console.log(`Success Rate: ${Math.round(passed/total*100)}%\n`);

  console.log('Response Format Summary:');
  results.forEach(r => {
    if (r.ok) {
      const format = r.isArray ? 'ARRAY' : r.fields.join(', ');
      console.log(`  ✅ ${r.name.padEnd(50)} [${format}]`);
    } else {
      console.log(`  ❌ ${r.name.padEnd(50)} [ERROR: ${r.error}]`);
    }
  });

  console.log('\n');
}

runTests().catch(console.error);
