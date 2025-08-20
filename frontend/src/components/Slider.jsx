import axios from 'axios';
import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { teesCollection } from '../assets/assets';
import { detectDominantColor, getColorByIndex } from '../utils/colorDetection';

// Fallback slides for when no banners are available
const fallbackSlides = [
  { image: '/src/assets/t-shirts-collection/black.png', color: 'black' },
  { image: '/src/assets/t-shirts-collection/red.png', color: 'red' },
  { image: '/src/assets/t-shirts-collection/green.png', color: 'green' },
  { image: '/src/assets/t-shirts-collection/blue.png', color: 'blue' },
  { image: '/src/assets/t-shirts-collection/white.png', color: 'white' }
];

const Slider = ({ onColorChange }) => {
  const { backendUrl } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderImagesList, setSliderImagesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [detectedColors, setDetectedColors] = useState({});
  const sliderRef = useRef(null);

  // Function to detect color from image filename or data
  const detectColorFromImage = async (imageData, imageIndex = 0) => {
    if (!imageData) return 'teal';

    // Check if it's a banner image or T-shirt image
    const imageUrl = imageData.imageBanner ? imageData.imageBanner[0] : imageData.image;

    // If the image data has a color property, use it directly
    if (imageData.color) {
      return imageData.color;
    }

    // Try to match with T-shirt collection colors
    for (const tee of teesCollection) {
      if (imageUrl && imageUrl.includes(tee.color)) {
        return tee.color;
      }
    }

    // Fallback color detection based on image name or default
    if (imageUrl) {
      const url = imageUrl.toLowerCase();
      if (url.includes('black')) return 'black';
      if (url.includes('white')) return 'white';
      if (url.includes('red')) return 'red';
      if (url.includes('green')) return 'green';
      if (url.includes('blue')) return 'blue';
      if (url.includes('navy')) return 'navy-blue';
      if (url.includes('brown')) return 'brown';
      if (url.includes('coffee')) return 'coffee';
      if (url.includes('beige')) return 'beige';
      if (url.includes('lavender')) return 'lavender';
      if (url.includes('redwood')) return 'redwood';
      if (url.includes('teal')) return 'teal';
    }

    // If no color detected, try to extract from the image URL or filename
    if (imageUrl) {
      const filename = imageUrl.split('/').pop().toLowerCase();
      if (filename.includes('black')) return 'black';
      if (filename.includes('white')) return 'white';
      if (filename.includes('red')) return 'red';
      if (filename.includes('green')) return 'green';
      if (filename.includes('blue')) return 'blue';
      if (filename.includes('navy')) return 'navy-blue';
      if (filename.includes('brown')) return 'brown';
      if (filename.includes('coffee')) return 'coffee';
      if (filename.includes('beige')) return 'beige';
      if (filename.includes('lavender')) return 'lavender';
      if (filename.includes('redwood')) return 'redwood';
      if (filename.includes('teal')) return 'teal';
    }

    // Try to detect color from image content
    try {
      if (imageUrl) {
        const detectedColor = await detectDominantColor(imageUrl);
        return detectedColor;
      }
    } catch (error) {
      // Silent error handling
    }

    // For banner images without color info, use a rotating color scheme
    // This ensures each banner gets a different color
    return getColorByIndex(imageIndex);
  };

  // Notify parent component of color change
  useEffect(() => {
    const updateColor = async () => {
      if (sliderImagesList.length > 0 && onColorChange) {
        const currentImage = sliderImagesList[currentIndex];
        const imageUrl = currentImage.imageBanner ? currentImage.imageBanner[0] : currentImage.image;

        // Check if we already detected color for this image
        if (detectedColors[imageUrl]) {
          onColorChange(detectedColors[imageUrl]);
          return;
        }

        const detectedColor = await detectColorFromImage(currentImage, currentIndex);

        // Cache the detected color
        setDetectedColors(prev => ({
          ...prev,
          [imageUrl]: detectedColor
        }));

        onColorChange(detectedColor);
      }
    };

    updateColor();
  }, [currentIndex, sliderImagesList, onColorChange, detectedColors]);

  // Preload the first image
  useEffect(() => {
    const preloadImage = (url) => {
      const img = new window.Image();
      img.src = url;
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    };
    const preloadFirstImage = async () => {
      if (sliderImagesList.length > 0) {
        const firstImageUrl = sliderImagesList[0].imageBanner ?
          sliderImagesList[0].imageBanner[0] :
          sliderImagesList[0].image;
        await preloadImage(firstImageUrl);
      }
    };
    preloadFirstImage();
  }, [sliderImagesList]);

  const sliderImages = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/banner-list');
      if (response.data.success) {
        setSliderImagesList(response.data.banners.length > 0 ? response.data.banners : fallbackSlides);
      } else {
        toast.error(response.data.message);
        setSliderImagesList(fallbackSlides);
      }
    } catch (error) {
      console.log('Using fallback slides due to error:', error);
      setSliderImagesList(fallbackSlides);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-slide logic with pause on hover
  useEffect(() => {
    if (sliderImagesList.length === 0) return;
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderImagesList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImagesList, isHovered]);

  useEffect(() => {
    sliderImages();
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  }, [sliderImagesList, currentIndex]);

  useEffect(() => {
    const ref = sliderRef.current;
    if (ref) {
      ref.addEventListener('keydown', handleKeyDown);
      return () => ref.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sliderImagesList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderImagesList.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (idx) => setCurrentIndex(idx);

  // Overlay removed for clean image-focused design

  return (
    <div
      className="relative w-full max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden group focus:outline-none"
      tabIndex={0}
      ref={sliderRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="T-shirt branding slider"
    >
      {isLoading && (
        <div className="w-full h-[300px] md:h-[500px] bg-gray-200 animate-pulse rounded-2xl" />
      )}
      <div className="relative h-[300px] md:h-[500px]">
        {sliderImagesList.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-20' : 'opacity-0 z-10'} pointer-events-none`}
              aria-hidden={!isActive}
            >
              {!imagesLoaded[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
              )}
              <div
                className={`relative w-full h-full flex items-center justify-center transition-transform duration-700 ${isActive ? 'scale-105 md:scale-110 drop-shadow-2xl' : 'scale-95'} ${isActive ? 'hover:scale-110' : ''}`}
                style={{ perspective: '1200px' }}
              >
                <img
                  src={slide.imageBanner ? slide.imageBanner[0] : slide.image}
                  alt={`Slide ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : "auto"}
                  className={`w-full h-full object-cover rounded-2xl transition-transform duration-700 ${isActive ? 'shadow-2xl border-4 border-white/80 animate-borderGlow' : 'border-2 border-transparent'} ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'} ${isActive ? 'hover:scale-105' : ''}`}
                  width="1200"
                  height="600"
                  decoding={index === 0 ? "sync" : "async"}
                  style={{ aspectRatio: '2/1', objectFit: 'cover', objectPosition: 'center', transform: isActive ? 'rotateY(-2deg) scale(1.03)' : 'none' }}
                  onLoad={() => handleImageLoad(index)}
                />
                {/* Subtle bottom gradient overlay for polish */}
                {isActive && (
                  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1/3 rounded-b-2xl bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                )}
              </div>
            </div>
          );
        })}
        {/* Navigation Arrows with animation */}
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-black hover:text-white text-black rounded-full p-2 shadow-lg z-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black scale-100 hover:scale-110 active:scale-95"
          onClick={prevSlide}
          aria-label="Previous slide"
          tabIndex={0}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:-translate-x-1"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-black hover:text-white text-black rounded-full p-2 shadow-lg z-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black scale-100 hover:scale-110 active:scale-95"
          onClick={nextSlide}
          aria-label="Next slide"
          tabIndex={0}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {/* Dot Indicators with animation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {sliderImagesList.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${currentIndex === idx ? 'bg-white shadow-lg scale-125 animate-pulse' : 'bg-white/40'} hover:scale-125`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              tabIndex={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
