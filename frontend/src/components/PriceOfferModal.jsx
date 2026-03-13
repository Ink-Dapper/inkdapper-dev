import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

const AUTO_CLOSE_SEC = 8;

const PriceOfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SEC);
  const [dismissed, setDismissed] = useState(false);
  const modalRef = useRef(null);
  const countdownRef = useRef(null);
  const hideRef = useRef(null);

  // Show after 30s if not seen
  useEffect(() => {
    if (localStorage.getItem('hasSeenPriceOfferModal')) return;
    const t = setTimeout(() => setIsOpen(true), 30000);
    return () => clearTimeout(t);
  }, []);

  // Countdown + auto-close
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(AUTO_CLOSE_SEC);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    hideRef.current = setTimeout(() => handleClose(), AUTO_CLOSE_SEC * 1000);

    return () => {
      clearInterval(countdownRef.current);
      clearTimeout(hideRef.current);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setDismissed(true);
    setTimeout(() => {
      setIsOpen(false);
      setDismissed(false);
      localStorage.setItem('hasSeenPriceOfferModal', 'true');
    }, 300);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  if (!isOpen) return null;

  const progress = ((AUTO_CLOSE_SEC - countdown) / AUTO_CLOSE_SEC) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: '#0d0d0e',
          border: '1px solid rgba(249,115,22,0.22)',
          boxShadow: '0 0 60px rgba(249,115,22,0.15), 0 24px 64px rgba(0,0,0,0.7)',
          transform: dismissed ? 'translateY(20px)' : 'translateY(0)',
          opacity: dismissed ? 0 : 1,
        }}
      >
        {/* Auto-close progress bar at top */}
        <div className="absolute top-0 left-0 w-full h-0.5 z-10" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #f97316, #f59e0b)',
              boxShadow: '0 0 6px rgba(249,115,22,0.5)',
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Countdown badge */}
        <div
          className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}
        >
          {countdown}
        </div>

        <div className="p-6 pt-8">
          {/* Offer badge */}
          <div className="flex justify-center mb-4">
            <div
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,158,11,0.1))', border: '1px solid rgba(249,115,22,0.35)' }}
            >
              {/* Shine */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1 -left-2 w-8 h-full rotate-12 opacity-20"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} />
              </div>
              <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-400">Limited Time Deal</span>
            </div>
          </div>

          {/* Discount display */}
          <div className="text-center mb-5">
            <div className="flex items-start justify-center gap-1 mb-1">
              <span className="text-orange-400 font-bold text-xl mt-2">UP TO</span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(3.5rem, 12vw, 5rem)',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.35))',
              }}>
                30%
              </span>
              <span className="text-orange-400 font-bold text-xl mt-2">OFF</span>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em', fontSize: '1.4rem', color: '#f1f5f9' }}>
              On Selected Drops
            </h2>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Exclusive deals on premium tees, hoodies &amp; custom prints. Don't miss out.
            </p>
          </div>

          {/* Perks row */}
          <div className="flex items-center justify-center gap-4 mb-5">
            {[
              { icon: 'M5 13l4 4L19 7', label: 'No Code Needed' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Today Only' },
              { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10', label: 'Free Delivery' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="space-y-2.5">
            <Link
              to="/collection"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-[0.1em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                color: '#0d0d0e',
                boxShadow: '0 0 28px rgba(249,115,22,0.4), 0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Shop The Sale
            </Link>

            <button
              onClick={handleClose}
              className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-400 transition-colors duration-200 tracking-wide"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PriceOfferModal);
