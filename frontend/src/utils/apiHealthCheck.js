// API Health Check Utility
// Helps diagnose API connectivity and CORS issues

export const checkApiHealth = async (baseUrl) => {
  console.log(`🔍 Checking API health for: ${baseUrl}`);
  
  try {
    const response = await fetch(`${baseUrl}/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000
    });

    const data = await response.json();
    
    console.log(`✅ API Health Check Success:`, {
      url: baseUrl,
      status: response.status,
      statusText: response.statusText,
      data: data
    });

    return {
      healthy: true,
      status: response.status,
      data: data
    };
  } catch (error) {
    console.error(`❌ API Health Check Failed:`, {
      url: baseUrl,
      error: error.message,
      code: error.code,
      type: error.name
    });

    return {
      healthy: false,
      error: error.message,
      code: error.code,
      type: error.name
    };
  }
};

export const checkAllApiEndpoints = async () => {
  console.log('🔍 Checking all API endpoints...');
  
  // In development, only test local endpoints to avoid CORS issues
  const isDevelopment = import.meta.env.DEV;
  
  const endpoints = isDevelopment 
    ? [
        `${window.location.origin}/api` // Only local endpoint in development
      ]
    : [
        `${window.location.origin}/api`,
        'https://www.inkdapper.com/api',
        'https://inkdapper.com/api'
      ];

  const results = [];

  for (const endpoint of endpoints) {
    const result = await checkApiHealth(endpoint);
    results.push({
      endpoint,
      ...result
    });
  }

  const healthyEndpoints = results.filter(r => r.healthy);
  const unhealthyEndpoints = results.filter(r => !r.healthy);

  console.log('📊 API Health Check Summary:');
  console.log(`✅ Healthy endpoints: ${healthyEndpoints.length}`);
  console.log(`❌ Unhealthy endpoints: ${unhealthyEndpoints.length}`);

  if (healthyEndpoints.length > 0) {
    console.log('🎉 Working endpoints:', healthyEndpoints.map(r => r.endpoint));
  }

  if (unhealthyEndpoints.length > 0) {
    console.log('⚠️ Failed endpoints:', unhealthyEndpoints.map(r => ({
      endpoint: r.endpoint,
      error: r.error
    })));
  }

  return {
    results,
    healthyEndpoints,
    unhealthyEndpoints,
    hasWorkingEndpoint: healthyEndpoints.length > 0
  };
};

export const diagnoseCorsIssue = async (baseUrl) => {
  console.log(`🔍 Diagnosing CORS issue for: ${baseUrl}`);
  
  try {
    // Test preflight request
    const preflightResponse = await fetch(`${baseUrl}/test`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
        'Origin': window.location.origin
      }
    });

    console.log('📋 Preflight Response:', {
      status: preflightResponse.status,
      headers: Object.fromEntries(preflightResponse.headers.entries())
    });

    // Test actual request
    const actualResponse = await fetch(`${baseUrl}/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 Actual Response:', {
      status: actualResponse.status,
      headers: Object.fromEntries(actualResponse.headers.entries())
    });

    return {
      corsWorking: actualResponse.ok,
      preflightStatus: preflightResponse.status,
      actualStatus: actualResponse.status
    };
  } catch (error) {
    console.error('❌ CORS Diagnosis Failed:', error);
    return {
      corsWorking: false,
      error: error.message
    };
  }
};

export default {
  checkApiHealth,
  checkAllApiEndpoints,
  diagnoseCorsIssue
};
