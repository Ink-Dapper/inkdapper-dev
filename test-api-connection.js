// Simple API connection test script
// Run this with: node test-api-connection.js

const https = require('https');
const http = require('http');

const testUrls = [
  'https://api.inkdapper.com/api/test',
  'https://www.inkdapper.com/api/test',
  'https://inkdapper.com/api/test',
  'http://localhost:4000/api/test'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            url,
            status: 'SUCCESS',
            statusCode: res.statusCode,
            data: json
          });
        } catch (e) {
          resolve({
            url,
            status: 'INVALID_JSON',
            statusCode: res.statusCode,
            data: data.substring(0, 100)
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        error: 'Request timed out after 5 seconds'
      });
    });
  });
}

async function runTests() {
  console.log('🔍 Testing API endpoints...\n');
  
  for (const url of testUrls) {
    console.log(`Testing: ${url}`);
    const result = await testUrl(url);
    
    if (result.status === 'SUCCESS') {
      console.log(`✅ SUCCESS (${result.statusCode}): ${JSON.stringify(result.data, null, 2)}\n`);
    } else {
      console.log(`❌ ${result.status}: ${result.error || result.data}\n`);
    }
  }
  
  console.log('🎯 Recommendation:');
  console.log('If any URL shows SUCCESS, use that as your VITE_API_URL in production');
  console.log('If none work, check if your backend server is running on the VPS');
}

runTests().catch(console.error);
