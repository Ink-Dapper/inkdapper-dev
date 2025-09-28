import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItemWrapper'
import { Star, Sparkles, Zap } from 'lucide-react'

const HighlightedProducts = () => {
  const { highlightedProducts, fetchHighlightedProducts } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHighlightedProducts = async () => {
      try {
        await fetchHighlightedProducts()
      } catch (error) {
        console.error('Error loading highlighted products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHighlightedProducts()
  }, [fetchHighlightedProducts])

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!highlightedProducts || highlightedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 via-white to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 via-transparent to-red-50/30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-100/20 via-transparent to-red-100/20"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-25 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            <span className="text-sm font-medium text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Featured Products</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
              Handpicked Favorites
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-6 md:mb-8 px-4">
            <span className="font-semibold text-slate-800 bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">Curated Excellence:</span> Discover our specially selected collection of premium products that stand out from the crowd. Each item is handpicked for its exceptional quality, unique design, and outstanding value.
          </p>

          {/* Enhanced Trending badges */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4">
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-orange-200/80 to-red-200/80 text-orange-800 border border-orange-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Star className="w-1.5 h-1.5 md:w-2 md:h-2 mr-1.5 md:mr-2 text-orange-500" />
              Handpicked
            </span>
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-yellow-200/80 to-orange-200/80 text-yellow-800 border border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Sparkles className="w-1.5 h-1.5 md:w-2 md:h-2 mr-1.5 md:mr-2 text-yellow-500" />
              Premium Quality
            </span>
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-red-200/80 to-pink-200/80 text-red-800 border border-red-300/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <Zap className="w-1.5 h-1.5 md:w-2 md:h-2 mr-1.5 md:mr-2 text-red-500" />
              Featured Collection
            </span>
          </div>
        </div>

        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Grid background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20 rounded-3xl -z-10"></div>

          {highlightedProducts.map((item, index) => (
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
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700 animate-pulse animation-delay-1000"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 animate-pulse animation-delay-2000"></div>

                {/* Featured Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>FEATURED</span>
                    </div>
                  </div>
                </div>

                {/* Main card with enhanced shadows */}
                <div className="relative">
                  <ProductItem
                    id={item.productId._id}
                    image={item.productId.image}
                    name={item.productId.name}
                    price={item.productId.price}
                    beforePrice={item.productId.beforePrice}
                    soldout={Boolean(item.productId.soldout)}
                    subCategory={item.productId.subCategory}
                    slug={item.productId.slug}
                    bestseller={Boolean(item.productId.bestseller)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="relative inline-block mt-10 md:mt-0">
            <span className="relative z-10 flex items-center gap-3 group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 border border-orange-400/50">
              Explore All Featured Products
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Enhanced decorative elements around button */}
          <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 rounded-full blur opacity-10 group-hover:opacity-50 transition-opacity duration-300"></div>

          <p className="mt-4 text-sm text-slate-500">
            Discover <span className="font-semibold text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{highlightedProducts.length}</span>+ handpicked designs
          </p>
        </div>
      </div>
    </section>
  )
}

export default HighlightedProducts
