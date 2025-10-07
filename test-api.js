// Simple API Test Script
const https = require('https');

console.log('🧪 Testing API endpoints...\n');

const testEndpoint = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'Origin': 'https://www.inkdapper.com'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          corsOrigin: res.headers['access-control-allow-origin'],
          corsMethods: res.headers['access-control-allow-methods'],
          dataLength: data.length
        });
      });
    });

    req.on('error', (error) => {
      reject({ url, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject({ url, error: 'Request timeout' });
    });

    req.end();
  });
};

const testPreflight = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.inkdapper.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization, token'
      }
    };

    const req = https.request(url, options, (res) => {
      resolve({
        url,
        method: 'OPTIONS',
        status: res.statusCode,
        corsOrigin: res.headers['access-control-allow-origin'],
        corsMethods: res.headers['access-control-allow-methods']
      });
    });

    req.on('error', (error) => {
      reject({ url, method: 'OPTIONS', error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject({ url, method: 'OPTIONS', error: 'Request timeout' });
    });

    req.end();
  });
};

const runTests = async () => {
  const endpoints = [
    'https://api.inkdapper.com/health',
    'https://api.inkdapper.com/api/product/list',
    'https://api.inkdapper.com/api/highlighted-products',
    'https://api.inkdapper.com/api/review/get',
    'https://api.inkdapper.com/api/google-reviews/get',
    'https://api.inkdapper.com/api/product/banner-list'
  ];

  console.log('📡 Testing preflight requests...');
  for (const endpoint of endpoints) {
    try {
      const result = await testPreflight(endpoint);
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   CORS Origin: ${result.corsOrigin || 'Missing'}`);
      console.log(`   CORS Methods: ${result.corsMethods || 'Missing'}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.error}`);
      console.log('');
    }
  }

  console.log('📡 Testing actual requests...');
  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   CORS Origin: ${result.corsOrigin || 'Missing'}`);
      console.log(`   Data Length: ${result.dataLength} bytes`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.error}`);
      console.log('');
    }
  }

  console.log('🎉 API test completed!');
};

runTests().catch(console.error);
