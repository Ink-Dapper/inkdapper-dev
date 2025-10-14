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
    <section className='relative py-2 md:py-16 lg:py-24 overflow-hidden my-2 md:my-12 lg:my-24'>
      {/* Section specific overlay for better content visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/20 to-pink-50/30 backdrop-blur-sm"></div>

      {/* Floating decorative elements */}
      <div className='absolute top-10 left-1/4 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-300/20 to-red-400/20 rounded-full blur-xl lg:blur-2xl animate-pulse'></div>
      <div className='absolute top-20 right-1/3 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-lg lg:blur-xl animate-pulse delay-1000'></div>
      <div className='absolute bottom-10 left-1/2 w-14 h-14 lg:w-18 lg:h-18 bg-gradient-to-br from-teal-300/20 to-cyan-400/20 rounded-full blur-lg lg:blur-xl animate-pulse delay-500'></div>
      <div className='absolute top-1/2 right-1/4 w-10 h-10 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-300/20 to-pink-400/20 rounded-full blur-lg lg:blur-xl animate-pulse delay-1500'></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            <span className="text-xs font-medium text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">You Might Also Like</span>
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
              Related Products
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-4">
            <span className="font-semibold text-slate-800 bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">Perfect Matches:</span> Discover more amazing designs that complement your current selection.
          </p>
        </div>

        {/* Mobile Slider View */}
        {isMobile && related.length > 0 && (
          <div className="md:hidden relative">
            {/* Grid background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20 rounded-3xl -z-10"></div>

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
                  <div className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeInUp"
                    style={{ animationDelay: `${index * 150}ms` }}>
                    {/* Bright Shadow Wrapper */}
                    <div className="relative">
                      {/* Bright colored shadows */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 animate-pulse animation-delay-1000"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 animate-pulse animation-delay-2000"></div>

                      {/* Main card with enhanced shadows */}
                      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden related-products-item">
                        <ProductItem
                          id={item._id}
                          name={item.name}
                          image={item.image}
                          price={item.price}
                          soldout={item.soldout}
                          slug={item.slug}
                        />
                      </div>
                    </div>
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
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6 relative">
          {/* Grid background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20 rounded-3xl -z-10"></div>
          {related.map((item, index) => (
            <div
              key={index}
              className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeInUp"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Bright Shadow Wrapper */}
              <div className="relative">
                {/* Bright colored shadows */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 animate-pulse animation-delay-1000"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 animate-pulse animation-delay-2000"></div>

                {/* Main card with enhanced shadows */}
                <div className="relative">
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    soldout={item.soldout}
                    slug={item.slug}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;