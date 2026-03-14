import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed md:bottom-6 bottom-16 md:right-6 right-3 z-50 group transition-all duration-500 ease-out transform hover:scale-110 hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          {/* Modern floating button container */}
          <div className="relative">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-15 transition-all duration-500 blur-md scale-95 group-hover:scale-110"></div>

            {/* Main button with glass morphism */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/90 group-hover:border-white/50">

              {/* Icon with modern styling */}
              <div className="w-5 h-5 relative">
                {/* Clean arrow icon with gradient */}
                <svg
                  className="relative z-10 w-5 h-5 transition-all duration-300 transform group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="url(#gradient)"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
            </div>

            {/* Micro-interaction dots */}
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>
          </div>

          {/* Minimal tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none">
            Top
            <div className="absolute top-full right-2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900/90"></div>
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
