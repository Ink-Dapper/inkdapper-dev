import React, { useState, useEffect } from 'react';
import { checkAllApiEndpoints } from '../utils/apiHealthCheck';

const ApiStatusIndicator = ({ showInDevelopment = false }) => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [endpoints, setEndpoints] = useState([]);

  useEffect(() => {
    // Disabled in development to avoid CORS issues
    if (!showInDevelopment || import.meta.env.DEV || import.meta.env.PROD) return;

    const checkStatus = async () => {
      try {
        const results = await checkAllApiEndpoints();
        setApiStatus(results.hasWorkingEndpoint ? 'healthy' : 'unhealthy');
        setEndpoints(results.results);
      } catch (error) {
        setApiStatus('error');
        console.error('API status check failed:', error);
      }
    };

    checkStatus();

    // Check every 30 seconds in production
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [showInDevelopment]);

  // Don't show in development mode to avoid CORS errors
  if (!showInDevelopment || import.meta.env.DEV || import.meta.env.PROD) return null;

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'healthy': return 'bg-green-500';
      case 'unhealthy': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'healthy': return 'API: Healthy';
      case 'unhealthy': return 'API: Issues';
      case 'error': return 'API: Error';
      default: return 'API: Checking...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${getStatusColor()} text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium`}>
        {getStatusText()}
      </div>

      {endpoints.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="text-xs font-semibold text-gray-700 mb-2">API Endpoints:</div>
          {endpoints.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600 truncate mr-2">
                {endpoint.endpoint.replace('https://', '').replace('http://', '')}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${endpoint.healthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {endpoint.healthy ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
