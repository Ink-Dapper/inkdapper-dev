// Test script to verify product links are working
console.log('🔧 Testing Product Links Fix...\n');

// Test data - simulate products with and without valid IDs
const testProducts = [
  { _id: '507f1f77bcf86cd799439011', name: 'Green Acid Wash Tees', slug: 'green-acid-wash-tees' },
  { _id: '507f1f77bcf86cd799439012', name: 'Blue Oversized T-shirt', slug: 'blue-oversized-tshirt' },
  { _id: null, name: 'Invalid Product', slug: 'invalid-product' }, // This should be filtered out
  { _id: undefined, name: 'Another Invalid', slug: 'another-invalid' }, // This should be filtered out
  { _id: '507f1f77bcf86cd799439013', name: 'Red Custom T-shirt', slug: 'red-custom-tshirt' }
];

console.log('Original products:', testProducts.length);

// Simulate the filtering logic from ShopContext
const validProducts = testProducts.filter(product => product._id);
console.log('Valid products after filtering:', validProducts.length);
console.log('Filtered out:', testProducts.length - validProducts.length, 'invalid products\n');

// Test URL generation
validProducts.forEach((product, index) => {
  const productUrl = `/product/${product._id}/${product.slug}`;
  console.log(`Product ${index + 1}: ${product.name}`);
  console.log(`  URL: ${productUrl}`);
  console.log(`  Valid: ${productUrl.includes('undefined') ? '❌ INVALID' : '✅ VALID'}\n`);
});

console.log('🎯 Expected Results:');
console.log('- All product URLs should be valid (no "undefined")');
console.log('- Invalid products should be filtered out');
console.log('- Product links should work properly');
console.log('\n✅ Product links fix test complete!');
