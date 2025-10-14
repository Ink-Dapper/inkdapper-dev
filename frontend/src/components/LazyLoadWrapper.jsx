import React, { useState, useRef, useEffect, memo } from 'react';

const LazyLoadWrapper = memo(({ children, fallback = null, threshold = 0.1, rootMargin = '50px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
});

LazyLoadWrapper.displayName = 'LazyLoadWrapper';

export default LazyLoadWrapper;
