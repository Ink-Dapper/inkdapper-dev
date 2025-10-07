// CORS Test Script
// Run this in Node.js to test your API endpoints

const https = require('https');

const testCORS = async () => {
  console.log('🧪 Testing CORS configuration...\n');

  const testEndpoints = [
    'https://api.inkdapper.com/health',
    'https://api.inkdapper.com/api/product/list',
    'https://api.inkdapper.com/api/google-reviews/get',
    'https://api.inkdapper.com/api/highlighted-products',
    'https://api.inkdapper.com/api/review/get',
    'https://api.inkdapper.com/api/product/banner-list'
  ];

  const makeRequest = (url) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: {
          'Origin': 'https://www.inkdapper.com',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization, token'
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
            headers: res.headers,
            data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
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

  // Test preflight requests
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
          corsHeaders: {
            'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
            'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
            'Access-Control-Allow-Headers': res.headers['access-control-allow-headers'],
            'Access-Control-Allow-Credentials': res.headers['access-control-allow-credentials']
          }
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

  console.log('📡 Testing preflight requests...');
  for (const endpoint of testEndpoints) {
    try {
      const result = await testPreflight(endpoint);
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   CORS Origin: ${result.corsHeaders['Access-Control-Allow-Origin'] || 'Missing'}`);
      console.log(`   CORS Methods: ${result.corsHeaders['Access-Control-Allow-Methods'] || 'Missing'}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.error}`);
      console.log('');
    }
  }

  console.log('📡 Testing actual requests...');
  for (const endpoint of testEndpoints) {
    try {
      const result = await makeRequest(endpoint);
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   CORS Origin: ${result.headers['access-control-allow-origin'] || 'Missing'}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.error}`);
      console.log('');
    }
  }

  console.log('🎉 CORS test completed!');
};

// Run the test
testCORS().catch(console.error);
