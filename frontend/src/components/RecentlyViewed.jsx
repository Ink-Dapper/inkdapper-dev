import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { Link, useNavigate } from 'react-router-dom'

const RecentlyViewed = () => {

  const { recentlyViewed, scrollToTop } = useContext(ShopContext)
  const [recentProducts, setRecentProducts] = useState([])
  const navigate = useNavigate()

  const handleRecentlyViewedClick = () => {
    console.log('Recently Viewed button clicked');
    if (scrollToTop) {
      scrollToTop();
    }
    navigate('/collection');
  }

  useEffect(() => {
    // Show only the first 4 recently viewed products
    setRecentProducts(recentlyViewed.slice(0, 4));
  }, [recentlyViewed]);

  // Don't render if no recently viewed products
  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className='relative py-6 md:py-10 overflow-hidden'>
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/20 to-purple-50/40"></div>
      <div className="absolute top-10 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/3 w-56 h-56 bg-gradient-to-r from-purple-200/40 to-blue-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-10 w-40 h-40 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Journey</span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 md:mb-8">
            <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
              RECENTLY VIEWED
            </span>
          </h2>

          <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 md:mb-10 px-4">
            <span className="font-bold text-slate-800 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">Continue Your Style Journey:</span> Pick up where you left off with the products you've been exploring. Your personal style evolution starts here.
          </p>

          {/* Enhanced Recent badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700">Recently Browsed</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
              <span className="text-sm font-semibold text-purple-700">Your Style</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse animation-delay-2000"></div>
              <span className="text-sm font-semibold text-indigo-700">Personalized</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Grid background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-3xl -z-10"></div>

          {recentProducts.map((item, index) => (
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
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-700 animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 animate-pulse animation-delay-1000"></div>

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
          <div className="inline-flex items-center gap-4">
            <button
              onClick={handleRecentlyViewedClick}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="relative z-10 text-white flex items-center gap-3">
                Explore More Products
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            </button>
          </div>

          <p className="mt-6 text-base text-slate-500">
            Discover your next favorite piece from our <span className="font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">curated collection</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewed
