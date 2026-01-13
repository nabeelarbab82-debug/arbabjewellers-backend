const mongoose = require('mongoose');
const Product = require('./models/productModel');

mongoose.connect('mongodb://localhost:27017/back2basics')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find the product
    const product = await Product.findById('696620ddda1bea34ed4f9cc5');
    
    if (product) {
      console.log('\nProduct Categories:');
      console.log('mainCategory:', product.mainCategory);
      console.log('subCategory:', product.subCategory);
      console.log('baseCategory:', product.baseCategory);
      console.log('\nFull product:', JSON.stringify(product, null, 2));
    } else {
      console.log('Product not found');
    }
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
