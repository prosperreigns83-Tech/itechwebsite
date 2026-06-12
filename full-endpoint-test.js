const http = require('http');

async function test(method, path, body = null, label) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            label,
            method,
            path,
            status: res.statusCode,
            success: parsed.success,
            keys: Array.isArray(parsed) ? 'ARRAY' : Object.keys(parsed).join(', '),
            dataType: Array.isArray(parsed.data) ? 'ARRAY' : typeof parsed.data,
            message: parsed.message
          });
        } catch (e) {
          resolve({
            label,
            method,
            path,
            status: res.statusCode,
            success: false,
            error: e.message
          });
        }
      });
    });

    req.on('error', e => {
      resolve({ label, method, path, error: e.message });
    });

    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║          COMPREHENSIVE API ENDPOINT RESPONSE FORMAT AUDIT        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const tests = [
    ['GET', '/api/health', null, '1. Health Check'],
    ['GET', '/api/products', null, '2. Get All Products'],
    ['GET', '/api/products/search?q=iPhone', null, '3. Search Products'],
    ['POST', '/api/products', JSON.stringify({title:'Test',price:100,category:'Phones',subtitle:'test',source:'local'}), '4. Create Product'],
    ['DELETE', '/api/products/999', null, '5. Delete Product (404)'],
    ['POST', '/api/auth/login', JSON.stringify({email:'john@example.com',password:'password123'}), '6. Auth Login'],
    ['POST', '/api/auth/forgot-password', JSON.stringify({email:'test@example.com'}), '7. Forgot Password'],
    ['POST', '/api/auth/reset-password', JSON.stringify({token:'test',password:'NewPass123!'}), '8. Reset Password'],
    ['GET', '/api/auth/verify-token/test-token', null, '9. Verify Reset Token'],
    ['POST', '/api/contact', JSON.stringify({email:'test@example.com',subject:'Test',message:'Hi'}), '10. Contact Form'],
    ['POST', '/api/orders', JSON.stringify({email:'test@example.com',customerName:'Test',items:[{id:1,qty:1}],totalAmount:100,address:'123 Test Street',phone:'+234123456'}), '11. Create Order'],
    ['GET', '/api/orders/TEST-001', null, '12. Get Order'],
    ['POST', '/api/payments/initialize', JSON.stringify({email:'test@example.com',amount:999.99,orderId:'TEST-001',customerName:'Test',items:[],address:'123',phone:'123'}), '13. Initialize Payment'],
    ['POST', '/api/payments/offline', JSON.stringify({orderId:'TEST-002',customerEmail:'test@example.com',customerName:'Test',amount:100,paymentMethod:'cash',items:[],address:'123',phone:'123'}), '14. Offline Payment']
  ];

  const results = [];
  for (const [method, path, body, label] of tests) {
    process.stdout.write(`${label.padEnd(45)}... `);
    const result = await test(method, path, body, label);
    results.push(result);
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else {
      const icon = result.status >= 200 && result.status < 300 ? '✅' : result.status === 400 ? '⚠️ ' : '❌';
      console.log(`${icon} ${result.status} - ${(result.keys).substring(0, 30)}`);
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                       DETAILED RESULTS                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  results.forEach(r => {
    console.log(`${r.label}`);
    console.log(`  Method: ${r.method} ${r.path}`);
    console.log(`  Status: ${r.status}`);
    if (r.error) {
      console.log(`  Error: ${r.error}`);
    } else {
      console.log(`  Success: ${r.success}`);
      console.log(`  Response Keys: ${r.keys}`);
      if (r.dataType) console.log(`  Data Type: ${r.dataType}`);
      if (r.message) console.log(`  Message: ${r.message}`);
    }
    console.log('');
  });

  // Summary
  const successCount = results.filter(r => r.status >= 200 && r.status < 300).length;
  console.log(`╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║ SUMMARY: ${successCount}/${results.length} endpoints responding successfully              ║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝`);
})();
