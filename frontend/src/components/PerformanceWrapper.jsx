import React, { memo, useMemo, useCallback } from 'react';

// Performance wrapper that provides memoization and optimization
const PerformanceWrapper = ({
  children,
  memo = true,
  dependencies = [],
  className = '',
  ...props
}) => {
  // Memoize children if requested
  const memoizedChildren = useMemo(() => {
    return memo ? React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          // Add performance optimization props
          'data-optimized': 'true'
        });
      }
      return child;
    }) : children;
  }, [children, memo, ...dependencies]);

  // Memoize callback functions
  const memoizedProps = useMemo(() => {
    return {
      ...props,
      className: className ? `performance-optimized ${className}` : 'performance-optimized'
    };
  }, [props, className]);

  // Render memoized children
  if (memo) {
    return (
      <div {...memoizedProps}>
        {memoizedChildren}
      </div>
    );
  }

  return (
    <div {...memoizedProps}>
      {children}
    </div>
  );
};

// HOC for performance optimization
export const withPerformanceOptimization = (Component, options = {}) => {
  const {
    memo = true,
    dependencies = [],
    shouldUpdate = null
  } = options;

  const OptimizedComponent = memo(Component, shouldUpdate);

  return React.forwardRef((props, ref) => (
    <PerformanceWrapper memo={memo} dependencies={dependencies}>
      <OptimizedComponent ref={ref} {...props} />
    </PerformanceWrapper>
  ));
};

// Hook for performance optimization
export const usePerformanceOptimization = (callback, dependencies) => {
  const memoizedCallback = useCallback(callback, dependencies);

  return memoizedCallback;
};

// Component for lazy loading optimization
export const LazyComponent = ({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef} {...props}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Virtual scrolling component for large lists
export const VirtualList = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  ...props
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef(null);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Debounced input component
export const DebouncedInput = ({
  value,
  onChange,
  delay = 300,
  ...props
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  }, [onChange, delay]);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <input
      {...props}
      value={inputValue}
      onChange={handleChange}
    />
  );
};

export default PerformanceWrapper;
