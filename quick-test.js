const http = require('http');

async function test(path, method = 'GET', body = null) {
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
        console.log(`\n${method} ${path}`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);
          console.log(`Type: ${Array.isArray(parsed) ? 'ARRAY' : 'OBJECT'}`);
          if (Array.isArray(parsed)) {
            console.log(`Items: ${parsed.length}`);
            if (parsed.length > 0) console.log(`First: ${JSON.stringify(parsed[0]).substring(0, 100)}...`);
          } else {
            console.log(`Keys: ${Object.keys(parsed).join(', ')}`);
            console.log(`Preview: ${JSON.stringify(parsed).substring(0, 150)}...`);
          }
        } catch (e) {
          console.log(`Data: ${data.substring(0, 100)}...`);
        }
        resolve();
      });
    });

    req.on('error', e => {
      console.log(`ERROR: ${e.message}`);
      resolve();
    });

    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  console.log('=== API ENDPOINT RESPONSE FORMATS ===');
  
  await test('/api/health');
  await test('/api/products');
  await test('/api/products/search?q=iPhone');
  await test('/api/auth/login', 'POST', JSON.stringify({email:'john@example.com', password:'password123'}));
  await test('/api/orders', 'POST', JSON.stringify({email:'test@example.com', customerName:'Test', items:[], totalAmount:100, address:'123', phone:'123'}));
  await test('/api/contact', 'POST', JSON.stringify({email:'test@example.com', subject:'Test', message:'Hi'}));
  
  console.log('\n=== DONE ===\n');
})();
