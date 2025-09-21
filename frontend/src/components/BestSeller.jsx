import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItemWrapper'
import { Link, useNavigate } from 'react-router-dom'

const BestSeller = () => {

    const { products, scrollToTop } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])
    const navigate = useNavigate()

    const handleBestSellerClick = () => {
        console.log('Best Seller button clicked');
        navigate('/collection');
        if (scrollToTop) {
            setTimeout(() => {
                scrollToTop();
            }, 100);
        }
    }

    useEffect(() => {
        const bestProduct = products.filter((items) => items.bestseller);
        setBestSeller(bestProduct.slice(0, 4));
    }, [products]);

    return (
        <section className='relative py-6 md:py-10 overflow-hidden'>
            {/* Enhanced Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-red-50/20 to-yellow-50/40"></div>
            <div className="absolute top-10 left-1/3 w-64 h-64 bg-gradient-to-r from-orange-200/40 to-red-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-10 right-1/3 w-56 h-56 bg-gradient-to-r from-yellow-200/40 to-orange-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-10 w-40 h-40 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-1000"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Hero Section */}
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Trending Now</span>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 md:mb-8">
                        <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
                            BEST SELLER
                        </span>
                    </h2>

                    <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 md:mb-10 px-4">
                        <span className="font-bold text-slate-800 bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">Fan Favorites You Can't Miss:</span> Our best-selling pieces are the proof that style and comfort go hand in hand. From custom creations to everyday essentials, these items have won the hearts of the Ink Dapper community.
                    </p>

                    {/* Enhanced Trending badges */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-10 px-4">
                        <span className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold bg-gradient-to-r from-orange-200/90 to-red-200/90 text-orange-800 border border-orange-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                            <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-2 md:mr-2.5 animate-pulse"></span>
                            Top Rated
                        </span>
                        <span className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold bg-gradient-to-r from-yellow-200/90 to-orange-200/90 text-yellow-800 border border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                            <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2 md:mr-2.5 animate-pulse"></span>
                            Customer Choice
                        </span>
                        <span className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold bg-gradient-to-r from-red-200/90 to-pink-200/90 text-red-800 border border-red-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                            <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-2 md:mr-2.5 animate-pulse"></span>
                            Most Popular
                        </span>
                    </div>

                    {/* Enhanced Stats Section */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12 px-4">
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">10K+</div>
                            <div className="text-sm md:text-base text-slate-600">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">4.9★</div>
                            <div className="text-sm md:text-base text-slate-600">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">50+</div>
                            <div className="text-sm md:text-base text-slate-600">Designs Sold</div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
                    {/* Grid background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-red-50/30 rounded-3xl -z-10"></div>

                    {bestSeller.map((item, index) => (
                        <div
                            key={index}
                            className="group transform transition-all duration-700 hover:scale-105 hover:-translate-y-3 animate-fadeInUp"
                            style={{
                                animationDelay: `${index * 200}ms`
                            }}
                        >
                            {/* Enhanced Shadow Wrapper */}
                            <div className="relative">
                                {/* Multi-colored shadows */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 animate-pulse animation-delay-1000"></div>

                                {/* Main card with enhanced shadows */}
                                <div className="relative">
                                    <ProductItem
                                        id={item._id}
                                        image={item.image}
                                        name={item.name}
                                        price={item.price}
                                        beforePrice={item.beforePrice}
                                        bestseller={item.bestSeller}
                                        soldout={item.soldout}
                                        slug={item.slug}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Call to Action */}
                <div className="text-center mt-16 md:mt-20">
                    <div className="relative inline-block">
                        <Link
                            to="/collection"
                            onClick={scrollToTop}
                        >
                            <span className="relative z-10 flex items-center gap-3 group relative inline-flex items-center justify-center px-8 py-4 md:px-10 text-lg md:text-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30 transform hover:scale-105 border border-orange-400/50 cursor-pointer">
                                View All Best Sellers
                                <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </Link>

                        {/* Enhanced decorative elements around button */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                    </div>

                    <p className="mt-6 text-base text-slate-500">
                        Join <span className="font-bold text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">10,000+</span> satisfied customers who love our best sellers
                    </p>
                </div>
            </div>
        </section>
    )
}

export default BestSeller