import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed md:bottom-6 bottom-16 md:right-6 right-3 z-50 group"
          style={{ animation: 'stt-fadein 0.3s ease-out' }}
        >
          <div className="relative flex flex-col items-center">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 px-2 py-1 text-[10px] font-semibold text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
              style={{ background: 'rgba(15,15,20,0.85)', backdropFilter: 'blur(6px)' }}>
              Back to top
            </div>

            {/* Button */}
            <div
              className="w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #1e1e2e 0%, #2d2d44 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, transparent 60%)' }} />

              {/* Arrow */}
              <div className="relative z-10 flex flex-col items-center gap-0.5" style={{ animation: 'stt-arrow 1.8s ease-in-out infinite' }}>
                <svg viewBox="0 0 20 20" className="w-4 h-4 md:w-5 md:h-5" fill="none">
                  <path d="M10 15V5M10 5L5.5 9.5M10 5L14.5 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* Trailing line that fades */}
                <div className="w-px h-2 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }} />
              </div>

              {/* Bottom orange accent bar */}
              <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(to right, #f97316, #fb923c)' }} />
            </div>
          </div>

          <style>{`
            @keyframes stt-fadein {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes stt-arrow {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(-3px); }
            }
          `}</style>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
