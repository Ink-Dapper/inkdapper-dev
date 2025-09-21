import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import '../styles/swiper-custom.css'
import { Droplets, Zap, Sparkles } from 'lucide-react'

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

const AcidWashTees = () => {
  const { products } = useContext(ShopContext)
  const [acidWashProducts, setAcidWashProducts] = useState([])
  const [swiper, setSwiper] = useState(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Filter products for acid wash tees and sort by date (most recent first)
    const filteredProducts = products
      .filter(product => product.subCategory === 'Acidwash')
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, 8); // Show up to 8 acid wash products

    setAcidWashProducts(filteredProducts)
    setLoading(false)
  }, [products])

  // Ensure swiper starts at first slide when products change
  useEffect(() => {
    if (swiper && acidWashProducts.length > 0) {
      swiper.slideTo(0, 0);
    }
  }, [swiper, acidWashProducts])

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

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading acid wash collection...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!acidWashProducts || acidWashProducts.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-red-100/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              <span className="text-sm font-medium text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Acid Wash Collection</span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
                Acid Wash Tees
              </span>
            </h2>

            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-8 md:mb-12 px-4">
              <span className="font-semibold text-slate-800 bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">Coming Soon:</span> We're working on bringing you the most amazing acid wash collection. Stay tuned for vintage vibes and unique designs!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToTop()}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Explore Other Collections
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20"></div>

      {/* Subtle Floating Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full opacity-40"></div>
      <div className="absolute top-20 right-20 w-12 h-12 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full opacity-50"></div>
      <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full opacity-40"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            <span className="text-sm font-medium text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Acid Wash Collection</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
              Acid Wash Tees
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-6 md:mb-8 px-4">
            <span className="font-semibold text-slate-800 bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">Vintage Vibes:</span> Experience the unique, weathered look of acid wash tees. Each piece is crafted with care to give you that authentic vintage aesthetic with modern comfort.
          </p>

          {/* Enhanced Trending badges */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4">
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-orange-200/80 to-red-200/80 text-orange-800 border border-orange-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Droplets className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Acid Wash Effect
            </span>
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-yellow-200/80 to-orange-200/80 text-yellow-800 border border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Vintage Style
            </span>
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-red-200/80 to-pink-200/80 text-red-800 border border-red-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Unique Design
            </span>
          </div>
        </div>

        {/* Desktop Products Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {acidWashProducts.map((item, index) => (
            <div
              key={index}
              className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  beforePrice={item.beforePrice}
                  soldout={item.soldout}
                  subCategory={item.subCategory}
                  slug={item.slug}
                  bestseller={item.bestseller}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider View */}
        {isMobile && acidWashProducts.length > 0 && (
          <div className="md:hidden relative mb-8">
            <Swiper
              key={`acid-wash-swiper-${acidWashProducts.length}`}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.3}
              centeredSlides={true}
              loop={acidWashProducts.length > 1}
              loopFillGroupWithBlank={false}
              allowTouchMove={true}
              grabCursor={true}
              speed={300}
              initialSlide={0}
              loopPreventsSlide={false}
              loopPreventsSliding={false}
              loopAdditionalSlides={1}
              loopedSlides={1}
              autoplay={acidWashProducts.length > 1 ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: false
              } : false}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                renderBullet: function (index, className) {
                  return '<span class="' + className + ' bg-orange-500"></span>';
                }
              }}
              className="acid-wash-swiper w-full px-2"
              style={{ paddingBottom: '40px' }}
              onSwiper={setSwiper}
              onInit={(swiper) => {
                // Ensure we start at the first slide
                swiper.slideTo(0, 0);
                // Enable loop properly
                if (swiper.loopedSlides) {
                  swiper.loopCreate();
                }
              }}
              onLoopFix={(swiper) => {
                // Fix loop positioning
                swiper.slideTo(0, 0);
              }}
            >
              {acidWashProducts.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="group transform transition-all duration-300 hover:scale-105">
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <ProductItem
                        id={item._id}
                        name={item.name}
                        image={item.image}
                        price={item.price}
                        beforePrice={item.beforePrice}
                        soldout={item.soldout}
                        subCategory={item.subCategory}
                        slug={item.slug}
                        bestseller={item.bestseller}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                onClick={handlePrevSlide}
                className="swiper-button-prev group flex items-center justify-center w-12 h-12 bg-white border-2 border-orange-200 text-orange-500 rounded-full shadow-lg hover:shadow-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Previous acid wash products"
              >
                <svg className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Swipe to see all {acidWashProducts.length} acid wash tees
                </span>
                <div className="flex gap-1">
                  {acidWashProducts.map((_, index) => (
                    <div key={index} className="w-2 h-2 bg-orange-300 rounded-full"></div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextSlide}
                className="swiper-button-next group flex items-center justify-center w-12 h-12 bg-white border-2 border-orange-200 text-orange-500 rounded-full shadow-lg hover:shadow-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Next acid wash products"
              >
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/collection?subCategory=Acidwash"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transform hover:scale-105"
          >
            Explore All Acid Wash Tees
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <p className="mt-4 text-sm text-slate-500">
            Discover <span className="font-semibold text-orange-600">{acidWashProducts.length}</span> unique acid wash designs
          </p>
        </div>
      </div>
    </section>
  )
}

export default AcidWashTees
