import React, { useEffect, useState, useContext, memo } from 'react';
import { initPerformanceMonitoring, performanceMetrics, checkPerformanceBudget } from '../utils/performanceUtils';
import { performanceOptimizer } from '../utils/performanceOptimizer';
import { ShopContext } from '../context/ShopContext';

const PerformanceMonitor = ({ children, enableMonitoring = true }) => {
  const [metrics, setMetrics] = useState(performanceMetrics);
  const [violations, setViolations] = useState([]);
  const { usersDetails } = useContext(ShopContext);

  // Check if current user is the specific user ID
  const isAuthorizedUser = () => {
    try {
      // Check if user is logged in and has the specific user ID
      if (usersDetails && usersDetails.length > 0 && usersDetails[0].users) {
        const userId = usersDetails[0].users._id || usersDetails[0].users.id;
        return userId === '7418622573';
      }

      // Also check localStorage as fallback
      const storedUserId = localStorage.getItem('user_id');
      return storedUserId === '7418622573';
    } catch (error) {
      console.error('Error checking user authorization:', error);
      return false;
    }
  };

  useEffect(() => {
    if (enableMonitoring && process.env.NODE_ENV === 'development' && isAuthorizedUser()) {
      // Initialize performance monitoring
      initPerformanceMonitoring();

      // Get initial performance metrics
      const initialMetrics = performanceOptimizer.getPerformanceMetrics();
      if (initialMetrics) {
        setMetrics(prev => ({ ...prev, ...initialMetrics }));
      }

      // Update metrics periodically
      const interval = setInterval(() => {
        const currentMetrics = performanceOptimizer.getPerformanceMetrics();
        if (currentMetrics) {
          setMetrics(prev => ({ ...prev, ...currentMetrics }));
        }
        const budgetViolations = checkPerformanceBudget();
        setViolations(budgetViolations);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [enableMonitoring, usersDetails]);

  // Show performance metrics only for authorized user in development
  if (process.env.NODE_ENV === 'development' && enableMonitoring && isAuthorizedUser()) {
    return (
      <>
        {children}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
          <div className="font-bold mb-2">Performance Metrics</div>
          <div>Load Time: {metrics.pageLoadTime.toFixed(0)}ms</div>
          <div>Render: {metrics.renderTime.toFixed(0)}ms</div>
          <div>Memory: {(metrics.memoryUsage * 100).toFixed(1)}%</div>
          <div>FPS: {metrics.frameRate}</div>
          {violations.length > 0 && (
            <div className="mt-2 text-red-400">
              <div className="font-bold">Violations:</div>
              {violations.map((violation, index) => (
                <div key={index} className="text-xs">{violation}</div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  return children;
};

export default memo(PerformanceMonitor);
