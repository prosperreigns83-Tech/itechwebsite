const path = require('path');
const fs = require('fs');
const path = require('path');
const productManager = require('../productManager');

function printUsage() {
  console.log('Usage: node add_local_product.js --title "Product Title" --price "$29.99" --subtitle "Short desc" --image "/path/to/file.jpg" --category "accessories" --description "Longer description (optional)"');
  console.log('\nNotes:');
  console.log(' - If --image is a path to a local file, it will be copied into public/images and referenced as /images/<file>');
  console.log(' - If --image is already a public path like /images/file.jpg, it will be used as-is');
}

// Simple arg parser for --key value
const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const key = a.slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : '';
    args[key] = val;
    if (val) i++;
  }
}

if (!args.title || !args.price || !args.image) {
  console.error('Missing required fields: title, price and image are required.');
  printUsage();
  process.exit(1);
}

// Ensure public/images exists
const publicImagesDir = path.join(__dirname, '..', '..', 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

let imagePublicPath = args.image;

// If image looks like a filesystem path, copy it into public/images
if (args.image && (args.image.includes(path.sep) || args.image.startsWith('./') || args.image.startsWith('..') || /^[A-Za-z]:\\/.test(args.image))) {
  const srcPath = path.resolve(args.image);
  if (!fs.existsSync(srcPath)) {
    console.error('Image file not found:', srcPath);
    process.exit(1);
  }

  // Generate destination filename, avoid collisions
  const baseName = path.basename(srcPath);
  let destName = baseName;
  const destPath = () => path.join(publicImagesDir, destName);
  let counter = 1;
  while (fs.existsSync(destPath())) {
    const ext = path.extname(baseName);
    const nameOnly = path.basename(baseName, ext);
    destName = `${nameOnly}-${Date.now()}-${counter}${ext}`;
    counter++;
  }

  const finalDest = destPath();
  try {
    fs.copyFileSync(srcPath, finalDest);
    console.log('Copied image to:', finalDest);
    imagePublicPath = `/images/${path.basename(finalDest)}`;
  } catch (err) {
    console.error('Failed to copy image file:', err.message || err);
    process.exit(1);
  }
} else if (args.image.startsWith('/images/') || args.image.startsWith('images/')) {
  // keep as-is, but normalize to start with /
  imagePublicPath = args.image.startsWith('/') ? args.image : `/${args.image}`;
} else if (args.image.startsWith('http://') || args.image.startsWith('https://')) {
  // allow remote URLs but warn
  console.warn('Using remote image URL as provided. For local hosting, pass a filesystem path to copy the file into public/images.');
  imagePublicPath = args.image;
}

const product = {
  title: args.title,
  category: args.category || 'uncategorized',
  subtitle: args.subtitle || '',
  description: args.description || '',
  price: args.price,
  image: imagePublicPath
};

try {
  const added = productManager.addProductToSource('local', product);
  console.log('Product added successfully:');
  console.log(JSON.stringify(added, null, 2));
  console.log('\nYou can now open the frontend and the product should appear, using the image path:', added.image);
} catch (err) {
  console.error('Failed to add product:', err.message || err);
  process.exit(1);
}
