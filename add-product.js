const http = require('http');

const data = JSON.stringify({
  title: "Your Product Name",
  price: "50.00",
  category: "electronics",
  subtitle: "Short description",
  image: "/images/f2.webp",
  source: "local"
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
