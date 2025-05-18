import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Slider = () => {
  const { backendUrl } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderImagesList, setSliderImagesList] = useState([]);

  const sliderImages = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/banner-list');
      if (response.data.success) {
        console.log(response.data.banners);
        setSliderImagesList(response.data.banners.length > 0 ? response.data.banners : fallbackSlides);
      } else {
        toast.error(response.data.message);
        setSliderImagesList(fallbackSlides); // Use fallback images on error
      }
    } catch (error) {
      console.log(error);
      setSliderImagesList(fallbackSlides); // Use fallback images on error
    }
  };

  const sliderLoading = () => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderImagesList.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval); // Properly clear the interval
  };

  useEffect(() => {
    sliderImages();
  }, []);

  useEffect(() => {
    if (sliderImagesList.length > 0) {
      const cleanup = sliderLoading(); // Start the slider only if images are available
      return cleanup; // Cleanup the interval on unmount or dependency change
    }
  }, [sliderImagesList]); // Restart interval when images are updated

  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {sliderImagesList.map((slide, index) => (
          <img
            key={index}
            src={slide.imageBanner ? slide.imageBanner[0] : slide.image}
            alt={`Slide ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchpriority={index === 0 ? "high" : "auto"}
            className="w-full object-cover"
            width="1200"
            height="600"
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
