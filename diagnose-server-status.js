// Server Status Diagnostic Script
const https = require('https');

console.log('🔍 SERVER STATUS DIAGNOSTIC');
console.log('===========================\n');

const endpoints = [
  { name: 'Health Check', url: 'https://api.inkdapper.com/health' },
  { name: 'Product List', url: 'https://api.inkdapper.com/api/product/list' },
  { name: 'Google Reviews', url: 'https://api.inkdapper.com/api/google-reviews/get' },
  { name: 'Highlighted Products', url: 'https://api.inkdapper.com/api/highlighted-products' }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = https.request(endpoint.url, { 
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mobile-Diagnostic-Tool/1.0',
        'Accept': 'application/json',
        'Origin': 'https://www.inkdapper.com'
      }
    }, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          name: endpoint.name,
          status: res.statusCode,
          responseTime: `${responseTime}ms`,
          cors: {
            'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
            'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
            'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
          },
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        status: 'ERROR',
        responseTime: 'N/A',
        error: error.message,
        success: false
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        status: 'TIMEOUT',
        responseTime: '>10s',
        error: 'Request timeout',
        success: false
      });
    });
    
    req.end();
  });
}

async function runDiagnostic() {
  console.log('Testing endpoints...\n');
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    
    console.log(`📡 ${result.name}:`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Response Time: ${result.responseTime}`);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`   CORS Origin: ${result.cors['Access-Control-Allow-Origin'] || 'Not set'}`);
      console.log(`   CORS Methods: ${result.cors['Access-Control-Allow-Methods'] || 'Not set'}`);
    }
    
    console.log(`   ${result.success ? '✅ SUCCESS' : '❌ FAILED'}\n`);
  }
  
  console.log('===========================');
  console.log('🎯 DIAGNOSIS COMPLETE');
  console.log('===========================');
  console.log('\nIf you see errors:');
  console.log('1. Check if backend server is running');
  console.log('2. Verify nginx configuration');
  console.log('3. Check CORS headers');
  console.log('4. Test on mobile device');
}

runDiagnostic();
