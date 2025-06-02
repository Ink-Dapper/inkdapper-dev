import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Slider = () => {
  const { backendUrl } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderImagesList, setSliderImagesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Preload the first image
  useEffect(() => {
    const preloadImage = (url) => {
      const img = new Image();
      img.src = url;
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to not block loading
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
      setSliderImagesList(fallbackSlides);
    } finally {
      setIsLoading(false);
    }
  };

  const sliderLoading = () => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderImagesList.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    sliderImages();
  }, []);

  useEffect(() => {
    if (sliderImagesList.length > 0) {
      const cleanup = sliderLoading();
      return cleanup;
    }
  }, [sliderImagesList]);

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => ({
      ...prev,
      [index]: true
    }));
  };

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="w-full h-[400px] md:h-[600px] bg-gray-200 animate-pulse" />
      )}
      <div
        className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sliderImagesList.map((slide, index) => (
          <div
            key={index}
            className="w-full h-[400px] md:h-[600px] relative"
            style={{ aspectRatio: '2/1' }}
          >
            {!imagesLoaded[index] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
              src={slide.imageBanner ? slide.imageBanner[0] : slide.image}
              alt={`Slide ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              fetchpriority={index === 0 ? "high" : "auto"}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
                }`}
              width="1200"
              height="600"
              decoding={index === 0 ? "sync" : "async"}
              style={{
                aspectRatio: '2/1',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
