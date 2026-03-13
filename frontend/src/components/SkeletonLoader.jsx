import React from 'react';

const SkeletonLoader = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#0d0d0e' }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', filter: 'blur(32px)' }} />

      {/* Logo mark */}
      <div className="relative mb-8">
        {/* Outer ring pulse */}
        <div className="absolute inset-0 rounded-2xl animate-ping opacity-30"
          style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', animationDuration: '1.8s' }} />
        {/* Icon box */}
        <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #f97316, #f59e0b)',
            boxShadow: '0 0 40px rgba(249,115,22,0.45), 0 0 80px rgba(249,115,22,0.15)'
          }}>
          {/* T-shirt SVG */}
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 2l4 4-4 3v11H8V9L4 6l4-4 4 2 4-2z" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div className="mb-1 text-center">
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(2rem, 6vw, 2.8rem)',
          letterSpacing: '0.18em',
          background: 'linear-gradient(135deg, #f97316, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          INK DAPPER
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-600 mt-0.5">
          Premium Streetwear
        </p>
      </div>

      {/* Loading bar */}
      <div className="relative mt-8 w-48 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #f97316, #f59e0b)',
            boxShadow: '0 0 8px rgba(249,115,22,0.6)',
            animation: 'inkload 1.6s ease-in-out infinite'
          }}
        />
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: i === 0 ? '#f97316' : 'rgba(255,255,255,0.12)',
              animation: `inkdot 1.2s ease-in-out ${i * 0.2}s infinite`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes inkload {
          0%   { width: 0%;   left: 0%; }
          50%  { width: 70%;  left: 15%; }
          100% { width: 0%;   left: 100%; }
        }
        @keyframes inkdot {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); background: #f97316; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
