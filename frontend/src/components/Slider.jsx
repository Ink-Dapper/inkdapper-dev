import axios from 'axios';
import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { teesCollection } from '../assets/assets';
import { detectDominantColor, getColorByIndex } from '../utils/colorDetection';
import ErrorBoundary from './ErrorBoundary';

const fallbackSlides = [
  { image: '/src/assets/t-shirts-collection/black.png', color: 'black' },
  { image: '/src/assets/t-shirts-collection/red.png', color: 'red' },
  { image: '/src/assets/t-shirts-collection/green.png', color: 'green' },
  { image: '/src/assets/t-shirts-collection/blue.png', color: 'blue' },
  { image: '/src/assets/t-shirts-collection/white.png', color: 'white' },
];

// Color name to display label
const COLOR_LABELS = {
  black: 'Classic Black',
  white: 'Pure White',
  red: 'Bold Red',
  green: 'Forest Green',
  blue: 'Ocean Blue',
  'navy-blue': 'Navy Blue',
  brown: 'Earthy Brown',
  coffee: 'Coffee Brew',
  beige: 'Soft Beige',
  lavender: 'Lavender',
  redwood: 'Redwood',
  teal: 'Teal Vibes',
};

const Slider = ({ onColorChange }) => {
  const { backendUrl } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderImagesList, setSliderImagesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [detectedColors, setDetectedColors] = useState({});
  const [currentColorName, setCurrentColorName] = useState('teal');
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const isMountedRef = useRef(true);
  const touchStartX = useRef(null);

  // ── Color detection ──────────────────────────────────────────────
  const detectColorFromImage = async (imageData, imageIndex = 0) => {
    if (!imageData) return 'teal';
    const imageUrl = imageData.imageBanner ? imageData.imageBanner[0] : imageData.image;
    if (imageData.color) return imageData.color;
    for (const tee of teesCollection) {
      if (imageUrl && imageUrl.includes(tee.color)) return tee.color;
    }
    if (imageUrl) {
      const url = imageUrl.toLowerCase();
      const filename = url.split('/').pop();
      for (const key of ['black', 'white', 'red', 'green', 'teal', 'lavender', 'beige', 'redwood', 'coffee', 'brown', 'navy', 'blue']) {
        if (url.includes(key) || filename.includes(key))
          return key === 'navy' ? 'navy-blue' : key;
      }
    }
    try {
      if (imageUrl) return await detectDominantColor(imageUrl);
    } catch (_) { }
    return getColorByIndex(imageIndex);
  };

  // ── Notify parent of color change ────────────────────────────────
  useEffect(() => {
    const updateColor = async () => {
      if (!sliderImagesList.length || !onColorChange) return;
      const currentImage = sliderImagesList[currentIndex];
      const imageUrl = currentImage.imageBanner ? currentImage.imageBanner[0] : currentImage.image;
      if (detectedColors[imageUrl]) {
        setCurrentColorName(detectedColors[imageUrl]);
        onColorChange(detectedColors[imageUrl]);
        return;
      }
      const detectedColor = await detectColorFromImage(currentImage, currentIndex);
      setDetectedColors(prev => ({ ...prev, [imageUrl]: detectedColor }));
      setCurrentColorName(detectedColor);
      onColorChange(detectedColor);
    };
    updateColor();
  }, [currentIndex, sliderImagesList]);

  // ── Preload first image ──────────────────────────────────────────
  useEffect(() => {
    if (!sliderImagesList.length) return;
    const url = sliderImagesList[0].imageBanner
      ? sliderImagesList[0].imageBanner[0]
      : sliderImagesList[0].image;
    const img = new window.Image();
    img.src = url;
  }, [sliderImagesList]);

  // ── Fetch banners ────────────────────────────────────────────────
  const sliderImages = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/banner-list');
      if (response.data.success) {
        setSliderImagesList(response.data.banners.length > 0 ? response.data.banners : fallbackSlides);
      } else {
        setSliderImagesList(fallbackSlides);
      }
    } catch (_) {
      setSliderImagesList(fallbackSlides);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { sliderImages(); }, []);

  // ── Progress bar ─────────────────────────────────────────────────
  useEffect(() => {
    if (isHovered || !sliderImagesList.length) return;
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const start = Date.now();
    const duration = 4000;
    progressRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      const p = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(p);
      if (p >= 100) clearInterval(progressRef.current);
    }, 40);
    return () => clearInterval(progressRef.current);
  }, [currentIndex, isHovered, sliderImagesList]);

  // ── Auto-slide ───────────────────────────────────────────────────
  useEffect(() => {
    if (!sliderImagesList.length || isHovered) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setCurrentIndex(prev => (prev + 1) % sliderImagesList.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [sliderImagesList, isHovered]);

  // ── Cleanup ──────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  // ── Keyboard navigation ──────────────────────────────────────────
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % sliderImagesList.length);
  }, [sliderImagesList]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? sliderImagesList.length - 1 : prev - 1));
  }, [sliderImagesList]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const ref = sliderRef.current;
    if (ref) {
      ref.addEventListener('keydown', handleKeyDown);
      return () => ref.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // ── Touch swipe ──────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) diff > 0 ? nextSlide() : prevSlide();
    touchStartX.current = null;
  };

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  const goToSlide = (idx) => {
    if (isMountedRef.current) setCurrentIndex(idx);
  };

  // ── Error fallback ───────────────────────────────────────────────
  if (hasError) {
    return (
      <div className="w-full rounded-3xl bg-gray-100 h-72 flex items-center justify-center text-gray-500">
        Unable to load slider
      </div>
    );
  }

  const total = sliderImagesList.length;
  const currentSlide = sliderImagesList[currentIndex];
  const colorLabel = currentSlide?.colorLabel || COLOR_LABELS[currentColorName] || currentColorName;

  return (
    <div
      className="relative w-full select-none group"
      tabIndex={0}
      ref={sliderRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="T-shirt collection slider"
    >
      {/* ── Stacked depth cards — dark rugged ──────────────────────── */}
      <div className="absolute -bottom-3 left-6 right-6 h-full rounded-3xl -z-20 pointer-events-none"
        style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.15)' }} />
      <div className="absolute -bottom-1.5 left-3 right-3 h-full rounded-3xl -z-10 pointer-events-none"
        style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }} />

      {/* ── Main card ───────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 0 0 1px rgba(249,115,22,0.22), 0 32px 80px rgba(0,0,0,0.55)' }}>

        {/* Loading shimmer */}
        {isLoading && (
          <div className="w-full aspect-[4/3] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
        )}

        {/* ── Image stage ─────────────────────────────────────────── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {sliderImagesList.map((slide, index) => {
            const isActive = index === currentIndex;
            const imgSrc = slide.imageBanner ? slide.imageBanner[0] : slide.image;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none
                  ${isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}
                aria-hidden={!isActive}
              >
                {/* Skeleton while loading */}
                {!imagesLoaded[index] && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                )}

                <img
                  src={imgSrc}
                  alt={`Collection slide ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchpriority={index === 0 ? 'high' : 'auto'}
                  className={`w-full h-full object-cover transition-opacity duration-500
                    ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                  style={{ objectPosition: 'center' }}
                  onLoad={() => handleImageLoad(index)}
                />

                {/* Gradient overlay — bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />
                {/* Gradient overlay — top */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* ── Top badges ─────────────────────────────────────── */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* NEW ARRIVAL badge — dark rugged */}
            <span className="inline-flex items-center gap-1.5 bg-black/65 backdrop-blur-md border border-orange-500/40 text-orange-200 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest"
              style={{ fontFamily: "'Bebas Neue', 'Outfit', sans-serif", letterSpacing: '0.12em' }}>
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              New Arrival
            </span>
            {/* Slide counter */}
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tabular-nums"
              style={{ fontFamily: "'Bebas Neue', 'Outfit', sans-serif", letterSpacing: '0.1em' }}>
              {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
            </span>
          </div>

          {/* ── Hover side arrows — dark rugged ────────────────── */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30
              w-10 h-10 rounded-full shadow-lg
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-all duration-300
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ background: 'rgba(15,15,16,0.85)', border: '1px solid rgba(249,115,22,0.45)', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(15,15,16,0.85)'}
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30
              w-10 h-10 rounded-full shadow-lg
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-all duration-300
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ background: 'rgba(15,15,16,0.85)', border: '1px solid rgba(249,115,22,0.45)', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(15,15,16,0.85)'}
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* ── Progress bar — thicker + glowing ──────────────── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[4px] bg-black/40 pointer-events-none">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f97316, #f59e0b)',
                boxShadow: '0 0 10px rgba(249,115,22,0.7)',
              }}
            />
          </div>
        </div>

        {/* ── Control bar — dark rugged ───────────────────────────── */}
        <div
          className="px-5 py-3.5 flex items-center justify-between gap-4"
          style={{ background: '#0d0d0e', borderTop: '1px solid rgba(249,115,22,0.2)' }}
        >

          {/* Capsule dot indicators */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {sliderImagesList.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none
                  ${i === currentIndex
                    ? 'w-7 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
              />
            ))}
          </div>

          {/* Color label — Bebas Neue */}
          <span
            className="text-xs text-slate-700 capitalize truncate flex-1 text-center tracking-widest uppercase"
            style={{ fontFamily: "'Bebas Neue', 'Outfit', sans-serif", letterSpacing: '0.14em' }}
          >
            {colorLabel}
          </span>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fdba74' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.25)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.12)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fdba74' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.25)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.12)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SliderWithErrorBoundary = (props) => (
  <ErrorBoundary>
    <Slider {...props} />
  </ErrorBoundary>
);

export default SliderWithErrorBoundary;
