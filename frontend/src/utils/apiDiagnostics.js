// API Diagnostics Utility
// Helps debug API connectivity issues

export const runApiDiagnostics = async () => {
  console.log('🔍 Running API Diagnostics...');
  
  const diagnostics = {
    environment: import.meta.env.MODE,
    currentUrl: window.location.href,
    origin: window.location.origin,
    hostname: window.location.hostname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test URLs to check
  const testUrls = [
    `${window.location.origin}/api/test`,
    'https://api.inkdapper.com/api/test',
    'https://www.inkdapper.com/api/test'
  ];

  // Test each URL
  for (const url of testUrls) {
    const testResult = {
      url,
      status: 'pending',
      responseTime: null,
      error: null,
      success: false
    };

    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000
      });

      testResult.responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        testResult.status = 'success';
        testResult.success = true;
        testResult.data = data;
        console.log(`✅ ${url} - Success (${testResult.responseTime}ms)`);
      } else {
        testResult.status = 'error';
        testResult.error = `HTTP ${response.status}: ${response.statusText}`;
        console.log(`❌ ${url} - HTTP Error: ${response.status}`);
      }
    } catch (error) {
      testResult.responseTime = Date.now() - startTime;
      testResult.status = 'error';
      testResult.error = error.message;
      testResult.code = error.code;
      console.log(`❌ ${url} - Error: ${error.message}`);
    }

    diagnostics.tests.push(testResult);
  }

  // Summary
  const successfulTests = diagnostics.tests.filter(t => t.success);
  const failedTests = diagnostics.tests.filter(t => !t.success);

  console.log('📊 API Diagnostics Summary:');
  console.log(`✅ Successful: ${successfulTests.length}`);
  console.log(`❌ Failed: ${failedTests.length}`);
  
  if (successfulTests.length > 0) {
    console.log('🎉 Working API endpoints:', successfulTests.map(t => t.url));
  }
  
  if (failedTests.length > 0) {
    console.log('⚠️ Failed API endpoints:', failedTests.map(t => ({ url: t.url, error: t.error })));
  }

  return diagnostics;
};

// Quick connectivity test
export const quickApiTest = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Quick API test successful:', data);
      return { success: true, data };
    } else {
      console.log('❌ Quick API test failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log('❌ Quick API test error:', error.message);
    return { success: false, error: error.message };
  }
};

// Network connectivity test
export const testNetworkConnectivity = async () => {
  const tests = [
    { name: 'Google DNS', url: 'https://8.8.8.8' },
    { name: 'Cloudflare DNS', url: 'https://1.1.1.1' },
    { name: 'Main Site', url: window.location.origin }
  ];

  const results = [];

  for (const test of tests) {
    try {
      const startTime = Date.now();
      const response = await fetch(test.url, { 
        method: 'HEAD',
        timeout: 5000 
      });
      const responseTime = Date.now() - startTime;
      
      results.push({
        name: test.name,
        success: true,
        responseTime,
        status: response.status
      });
    } catch (error) {
      results.push({
        name: test.name,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

export default {
  runApiDiagnostics,
  quickApiTest,
  testNetworkConnectivity
};
