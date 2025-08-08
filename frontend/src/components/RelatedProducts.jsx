import React, { useContext, useEffect, useState, useRef } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.css';

// Add this hook to detect screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      const filteredProducts = products.filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item._id !== currentProductId // Exclude the current product
      );
      setRelated(filteredProducts.slice(0, 4)); // Limit to 4 products
    }
  }, [products, category, subCategory, currentProductId]);

  const handlePrevSlide = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div className="my-8 md:my-12 lg:my-24">
      <div className="text-center text-xl md:text-2xl lg:text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>

      {/* Mobile Slider View */}
      {isMobile && related.length > 0 && (
        <div className="md:hidden relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.3}
            centeredSlides={true}
            loop={related.length > 2}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: function (index, className) {
                return '<span class="' + className + ' bg-orange-500"></span>';
              }
            }}
            className="related-products-swiper w-full px-2"
            style={{ paddingBottom: '40px' }}
            onSwiper={setSwiper}
          >
            {related.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    soldout={item.soldout}
                    slug={item.slug}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 text-orange-500 rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 text-orange-500 rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
            aria-label="Next slide"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            soldout={item.soldout}
            slug={item.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;