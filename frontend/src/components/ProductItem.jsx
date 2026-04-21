import { toast } from 'react-toastify';
import { useContext, useEffect, useMemo, useState, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { storageUrl } from '../utils/storageUrl';

const ProductItem = ({ id, image, name, price, beforePrice, subCategory, soldout, slug, comboPrices }) => {
  let safeSlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '');
  if (safeSlug.endsWith('-')) safeSlug = safeSlug.slice(0, -1);

  const { currency, scrollToTop, addToWishlist, updateWishlistQuantity, token, wishlist, addToCartCombo, reviewList } = useContext(ShopContext);

  const offerPercentage = useMemo(() => {
    if (beforePrice && price && beforePrice > price) {
      return Math.round(((beforePrice - price) / beforePrice) * 100);
    }
    return 0;
  }, [beforePrice, price]);

  const savingsAmount = useMemo(() => {
    if (beforePrice && price && beforePrice > price) return beforePrice - price;
    return 0;
  }, [beforePrice, price]);

  const { reviewCount, avgRating } = useMemo(() => {
    if (!reviewList || !id) return { reviewCount: 0, avgRating: 0 };
    const productReviews = reviewList.filter(r => r.productId === id);
    const count = productReviews.length;
    const avg = count > 0 ? productReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count : 0;
    return { reviewCount: count, avgRating: Math.round(avg) };
  }, [reviewList, id]);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shareMenuRef = useRef(null);
  const favWishlist = useMemo(() => Object.keys(wishlist || {}), [wishlist]);

  const changeText = useMemo(() => {
    const map = {
      'Customtshirt': 'Custom T-shirt',
      'Oversizedtshirt': 'Oversized T-shirt',
      'Solidoversized': 'Solid Oversized',
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
      'Polotshirt': 'Polo T-shirt',
      'Hoddies': 'Hoodies',
      'Sweattshirts': 'Sweat T-shirt',
    };
    return map[subCategory] || '';
  }, [subCategory]);

  const isWishlisted = favWishlist.includes(id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      toast.error('Please login to manage wishlist', { autoClose: 1000 });
    } else {
      isWishlisted ? updateWishlistQuantity(id, 0) : addToWishlist(id);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(v => !v);
  };

  const shareOnWhatsApp = (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/product/${safeSlug}`;
    const img = image?.[0] || '';
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${name} — ${currency}${price}\n${url}${img ? '\n' + img : ''}`)}`, '_blank');
    setShowShareMenu(false);
    toast.success('Opening WhatsApp…', { autoClose: 1500 });
  };

  const shareOnInstagram = (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/product/${safeSlug}`;
    navigator.clipboard.writeText(image?.[0] ? `${url}\n${image[0]}` : url);
    toast.info('Link copied! Paste in Instagram story or DM', { autoClose: 3000 });
    setShowShareMenu(false);
  };

  const shareViaMessage = (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/product/${safeSlug}`;
    const text = `${name} — ${currency}${price}\n${url}`;
    if (navigator.share) {
      navigator.share({ title: name, text, url }).catch(() => { navigator.clipboard.writeText(text); toast.info('Link copied!', { autoClose: 1500 }); });
    } else {
      navigator.clipboard.writeText(text);
      toast.info('Link copied to clipboard!', { autoClose: 1500 });
    }
    setShowShareMenu(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) setShowShareMenu(false);
    };
    if (showShareMenu) {
      document.addEventListener('mousedown', handler);
      document.addEventListener('touchstart', handler);
    }
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, [showShareMenu]);

  /* ─── shared styles ─── */
  const S = {
    card: {
      background: '#0f0f11',
      border: '1px solid rgba(249,115,22,0.13)',
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s ease',
    },
    actionBtn: {
      width: 34, height: 34, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15,15,17,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.09)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    shareDropdown: {
      position: 'absolute', top: 42, right: 0,
      background: '#111115',
      border: '1px solid rgba(249,115,22,0.18)',
      borderRadius: 12,
      padding: '6px',
      zIndex: 40,
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    },
    shareBtn: {
      width: 36, height: 36, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
    },
  };

  return (
    <div className="relative group" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* ── Wishlist button ── */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          ...S.actionBtn,
          position: 'absolute', top: 10, right: 10, zIndex: 30,
          color: isWishlisted ? '#f87171' : 'rgba(255,255,255,0.35)',
          border: isWishlisted ? '1px solid rgba(248,113,113,0.35)' : S.actionBtn.border,
          background: isWishlisted ? 'rgba(15, 15, 17, 0.85)' : S.actionBtn.background,
        }}
      >
        {isWishlisted ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3C9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </button>

      {/* ── Share button ── */}
      <div style={{ position: 'absolute', top: 50, right: 10, zIndex: 30 }} ref={shareMenuRef}>
        <button
          onClick={handleShare}
          style={{ ...S.actionBtn, color: 'rgba(255,255,255,0.35)' }}
          aria-label="Share product"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
          </svg>
        </button>

        {showShareMenu && (
          <div style={S.shareDropdown}>
            {/* WhatsApp */}
            <button onClick={shareOnWhatsApp} style={S.shareBtn} title="Share on WhatsApp"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = S.shareBtn.background}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.68-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            {/* Instagram */}
            <button onClick={shareOnInstagram} style={{ ...S.shareBtn, marginTop: 4 }} title="Copy for Instagram"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(238,42,123,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = S.shareBtn.background}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F9CE34" />
                    <stop offset="40%" stopColor="#EE2A7B" />
                    <stop offset="100%" stopColor="#6228D7" />
                  </linearGradient>
                </defs>
                <path fill="url(#ig-g)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            {/* Copy/Share */}
            <button onClick={shareViaMessage} style={{ ...S.shareBtn, marginTop: 4 }} title="Copy link"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = S.shareBtn.background}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(249,115,22,0.8)" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16 6 12 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="2" x2="12" y2="15" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Main card link ── */}
      <Link
        onClick={() => scrollToTop?.()}
        to={`/product/${safeSlug}`}
        className={soldout ? 'pointer-events-none' : ''}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <div
          style={S.card}
          className="group-hover:shadow-[0_8px_40px_rgba(249,115,22,0.14)] group-hover:border-orange-500/25 group-hover:-translate-y-1"
        >

          {/* ── Image area ── */}
          <div style={{ position: 'relative', height: 288, background: '#070709', overflow: 'hidden' }}>

            {/* Shimmer skeleton — visible until image loads */}
            {!imgLoaded && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                {/* Base dark bg */}
                <div style={{ position: 'absolute', inset: 0, background: '#0d0d10' }} />
                {/* Sweeping shimmer */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(249,115,22,0.07) 50%, transparent 60%)',
                  animation: 'shimmer-sweep 1.6s ease-in-out infinite',
                }} />
                {/* Subtle grid lines */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(249,115,22,0.03) 0px, rgba(249,115,22,0.03) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(249,115,22,0.03) 0px, rgba(249,115,22,0.03) 1px, transparent 1px, transparent 40px)',
                }} />
                {/* Center icon placeholder */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(249,115,22,0.1)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'shimmer-pulse 1.6s ease-in-out infinite',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div style={{
                    width: 64, height: 4, borderRadius: 9999,
                    background: 'rgba(249,115,22,0.1)',
                    animation: 'shimmer-pulse 1.6s ease-in-out infinite 0.2s',
                  }} />
                </div>
              </div>
            )}

            {imgError ? (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#0d0d10',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(249,115,22,0.3)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>No image</span>
              </div>
            ) : (
              <img
                src={storageUrl(image[0])}
                alt={name}
                loading="lazy"
                decoding="async"
                width="300"
                height="400"
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgLoaded(true); setImgError(true); }}
                className="transition-transform duration-700 group-hover:scale-105"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  opacity: imgLoaded ? (soldout ? 0.45 : 1) : 0,
                  transition: 'opacity 0.4s ease, transform 0.7s ease',
                }}
              />
            )}

            {/* Sold out overlay */}
            {soldout && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  background: '#0d0d0e',
                  border: '1px solid rgba(249,115,22,0.4)',
                  color: '#fb923c',
                  padding: '10px 28px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>
                  Sold Out
                </span>
              </div>
            )}

            {/* Discount badge */}
            {offerPercentage > 0 && (
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                color: '#0d0d0e',
                padding: '3px 10px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.06em',
              }}>
                -{offerPercentage}%
              </div>
            )}

            {/* Brand logo watermark */}
            <div style={{ position: 'absolute', bottom: 10, right: 10, opacity: 0.65 }}
              className="transition-opacity duration-300 group-hover:opacity-90">
              <img
                src={assets.logo_only}
                alt="Ink Dapper"
                width="32"
                height="32"
                loading="lazy"
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
            </div>

            {/* Hover overlay — desktop only */}
            <div
              className="hidden md:flex absolute inset-0 items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
            >
              <div style={{
                background: 'rgba(249,115,22,0.14)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(249,115,22,0.35)',
                borderRadius: 9999,
                padding: '7px 22px',
                color: '#fb923c',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                transform: 'translateY(6px)',
                transition: 'transform 0.35s ease',
              }}
                className="group-hover:translate-y-0"
              >
                View Product
              </div>
            </div>
          </div>

          {/* ── Info section ── */}
          <div style={{ padding: '14px 14px 12px', background: '#0f0f11' }}>

            {/* Category badge */}
            {changeText && (
              <span style={{
                display: 'inline-block',
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.18)',
                color: '#fb923c',
                padding: '2px 10px',
                borderRadius: 9999,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                {changeText}
              </span>
            )}

            {/* Product name */}
            <h3 style={{
              color: '#e2e8f0',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 8,
              transition: 'color 0.2s ease',
            }}
              className="group-hover:text-orange-300"
            >
              {name}
            </h3>

            {/* Star rating row */}
            {reviewCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={avgRating >= s ? '#facc15' : 'none'} stroke={avgRating >= s ? '#facc15' : '#475569'} strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>({reviewCount})</span>
              </div>
            )}

            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1,
              }}>
                {currency}{price}
              </span>
              {beforePrice && (
                <span style={{ color: '#999', fontSize: 12, textDecoration: 'line-through', fontWeight: 500 }}>
                  {currency}{beforePrice}
                </span>
              )}
            </div>

            {/* You save */}
            {savingsAmount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>You save {currency}{savingsAmount}</span>
              </div>
            )}

            {/* Combo offers */}
            {comboPrices && comboPrices.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6,
                }}>
                  Combo Deals
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {comboPrices.slice(0, 2).map((combo, i) => (
                    <div key={i} style={{
                      background: 'rgba(249,115,22,0.07)',
                      border: '1px solid rgba(249,115,22,0.18)',
                      borderRadius: 8,
                      padding: '6px 10px',
                      minWidth: 72,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#fb923c' }}>{combo.quantity}x</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{currency}{combo.price}</div>
                      {combo.discount > 0 && (
                        <div style={{ fontSize: 10, color: '#34d399', fontWeight: 600 }}>{combo.discount}% off</div>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCartCombo(id, combo.quantity); }}
                        disabled={soldout}
                        style={{
                          marginTop: 5, width: '100%',
                          background: soldout ? '#374151' : 'linear-gradient(135deg, #f97316, #f59e0b)',
                          color: soldout ? '#6b7280' : '#0d0d0e',
                          fontSize: 9, fontWeight: 800,
                          padding: '4px 0', borderRadius: 5,
                          border: 'none', cursor: soldout ? 'not-allowed' : 'pointer',
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}
                      >
                        Add {combo.quantity}
                      </button>
                    </div>
                  ))}
                  {comboPrices.length > 2 && (
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 8, padding: '6px 10px',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>+{comboPrices.length - 2}</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>more</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom strip */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 10, paddingTop: 10,
              borderTop: '1px solid rgba(249, 116, 22, 0.36)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Premium Quality
                </span>
              </div>
              <span
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: 11, color: '#f97316', fontWeight: 700 }}
              >
                →
              </span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
};

export default memo(ProductItem);
