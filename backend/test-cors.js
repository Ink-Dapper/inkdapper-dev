// Test script to verify CORS configuration
import fetch from 'node-fetch';

const testCors = async () => {
  const testUrls = [
    'https://api.inkdapper.com/api/test',
    'https://api.inkdapper.com/api/product/list',
    'https://api.inkdapper.com/api/review/get'
  ];

  console.log('Testing CORS configuration...\n');

  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Origin': 'https://www.inkdapper.com',
          'Content-Type': 'application/json',
        },
      });

      console.log(`Status: ${response.status}`);
      console.log(`CORS Headers:`);
      console.log(`  Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
      console.log(`  Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
      console.log(`  Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers')}`);
      console.log(`  Access-Control-Allow-Credentials: ${response.headers.get('access-control-allow-credentials')}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
      
      console.log('---\n');
    } catch (error) {
      console.error(`Error testing ${url}:`, error.message);
      console.log('---\n');
    }
  }
};

// Test preflight requests
const testPreflight = async () => {
  console.log('Testing preflight requests...\n');
  
  const testUrl = 'https://api.inkdapper.com/api/product/list';
  
  try {
    console.log(`Testing preflight for: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.inkdapper.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    console.log(`Preflight Status: ${response.status}`);
    console.log(`CORS Headers:`);
    console.log(`  Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
    console.log(`  Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
    console.log(`  Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers')}`);
    console.log(`  Access-Control-Allow-Credentials: ${response.headers.get('access-control-allow-credentials')}`);
    console.log(`  Access-Control-Max-Age: ${response.headers.get('access-control-max-age')}`);
    
  } catch (error) {
    console.error(`Error testing preflight:`, error.message);
  }
};

// Run tests
testCors().then(() => {
  return testPreflight();
}).catch(console.error);
