import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItemWrapper'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-custom.css'

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

const LatestCollection = () => {

    const { products, scrollToTop } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])
    const [swiper, setSwiper] = useState(null)
    const navigate = useNavigate()
    const isMobile = useIsMobile()

    const handleCollectionClick = () => {
        console.log('Collection button clicked');
        try {
            navigate('/collection');
            console.log('Navigation triggered');
            if (scrollToTop) {
                setTimeout(() => {
                    scrollToTop();
                    console.log('Scroll to top executed');
                }, 100);
            }
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback to window.location
            window.location.href = '/collection';
        }
    }

    useEffect(() => {
        // Sort products by date (most recent first) and take the latest 8 products
        const sortedProducts = products
            .slice()
            .sort((a, b) => (b.date || 0) - (a.date || 0))
            .slice(0, 8);
        setLatestProducts(sortedProducts);
    }, [products])

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
        <section className='relative py-6 md:py-10 overflow-hidden latest-collection-section'>
            {/* Section specific overlay for better content visibility */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Hero Section */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-sm font-medium text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">New Arrivals</span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                        <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
                            Latest Updates
                        </span>
                    </h2>

                    <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-6 md:mb-8 md:px-4 px-1 text-wrap-balance">
                        <span className="font-semibold text-slate-800 bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">Fresh & Updated:</span> Discover our most recently updated products – featuring the latest designs, improved quality, and newest additions to our collection. Stay ahead with the freshest styles from Ink Dapper.
                    </p>

                    {/* Enhanced Trending badges */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4">
                        <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-orange-200/80 to-red-200/80 text-orange-800 border border-orange-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-1.5 md:mr-2 animate-pulse"></span>
                            Just Updated
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-yellow-200/80 to-orange-200/80 text-yellow-800 border border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-1.5 md:mr-2 animate-pulse"></span>
                            Fresh Designs
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-red-200/80 to-pink-200/80 text-red-800 border border-red-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-1.5 md:mr-2 animate-pulse"></span>
                            Latest Updates
                        </span>
                    </div>
                </div>

                {/* Desktop Products Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-10 relative">
                    {/* Grid background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20 rounded-3xl -z-10"></div>
                    {latestProducts.map((item, index) => (
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
                                        image={item.image}
                                        name={item.name}
                                        price={item.price}
                                        beforePrice={item.beforePrice}
                                        soldout={item.soldout}
                                        subCategory={item.subCategory}
                                        slug={item.slug}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Slider View */}
                {isMobile && latestProducts.length > 0 && (
                    <div className="md:hidden relative mb-8">
                        {/* Grid background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20 rounded-3xl -z-10"></div>

                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1.3}
                            centeredSlides={true}
                            loop={latestProducts.length > 2}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                                renderBullet: function (index, className) {
                                    return '<span class="' + className + ' bg-orange-500"></span>';
                                }
                            }}
                            className="latest-products-swiper w-full px-2"
                            style={{ paddingBottom: '40px' }}
                            onSwiper={setSwiper}
                        >
                            {latestProducts.map((item, index) => (
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
                                            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
                                                <ProductItem
                                                    id={item._id}
                                                    name={item.name}
                                                    image={item.image}
                                                    price={item.price}
                                                    beforePrice={item.beforePrice}
                                                    soldout={item.soldout}
                                                    subCategory={item.subCategory}
                                                    slug={item.slug}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <div className="flex justify-center items-center gap-4 mt-4">
                            <button
                                onClick={handlePrevSlide}
                                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                aria-label="Previous products"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <span className="text-sm text-gray-600 font-medium">
                                Swipe to see all {latestProducts.length} products
                            </span>

                            <button
                                onClick={handleNextSlide}
                                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                aria-label="Next products"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Enhanced Call to Action */}
                <div className="text-center">
                    <div className="relative inline-block">
                        <Link
                            to='/collection'
                            onClick={scrollToTop}
                        >
                            <span className="relative z-10 flex items-center gap-3 group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border border-orange-400/50">
                                Explore Full Collection
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        {/* Enhanced decorative elements around button */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        Discover <span className="font-semibold text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{products.length}</span>+ unique designs
                    </p>
                </div>
            </div>
        </section>
    )
}

export default LatestCollection