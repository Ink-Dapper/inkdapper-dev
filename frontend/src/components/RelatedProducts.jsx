import React, { useContext, useEffect, useState } from 'react';
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
      const sameSubCat = products.filter(
        (item) => item.category === category && item.subCategory === subCategory && item._id !== currentProductId
      );
      // Fill up to 6 with same-category products if same subCategory has fewer
      if (sameSubCat.length >= 6) {
        setRelated(sameSubCat.slice(0, 6));
      } else {
        const sameCat = products.filter(
          (item) => item.category === category && item.subCategory !== subCategory && item._id !== currentProductId
        );
        setRelated([...sameSubCat, ...sameCat].slice(0, 6));
      }
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
    <section className='relative py-8 md:py-16 lg:py-20 overflow-hidden' style={{ background: '#0d0d0e' }}>
      {/* Subtle dark accent glows */}
      <div className='absolute top-10 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-10' style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}></div>
      <div className='absolute bottom-10 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-8' style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }}></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Customers Also Bought</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }}></div>
          </div>

          <h2 className="ragged-title mb-4" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)' }}>
            Frequently Bought Together
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed px-4">
            <span className="font-semibold text-orange-400">Bundle &amp; Save:</span> Shoppers who viewed this also loved these picks from the same collection.
          </p>
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
              {related.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                    <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
                      <div className="absolute -inset-1 rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.4), rgba(245,158,11,0.3))' }}></div>
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
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-orange-400 hover:text-white"
              style={{ background: 'rgba(13,13,14,0.9)', border: '1px solid rgba(249,115,22,0.35)' }}
              aria-label="Previous slide"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-orange-400 hover:text-white"
              style={{ background: 'rgba(13,13,14,0.9)', border: '1px solid rgba(249,115,22,0.35)' }}
              aria-label="Next slide"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
          {related.map((item) => (
            <div
              key={item._id}
              className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-1"
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <div className="absolute -inset-1 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.4), rgba(245,158,11,0.3))' }}></div>
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