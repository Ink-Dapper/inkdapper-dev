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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-red-50/30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-100/20 via-transparent to-red-100/20"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-25 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked collection of premium products that stand out from the crowd
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center mt-6">
            <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            <div className="mx-4 p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
              <Zap className="w-4 h-4 text-orange-600" />
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
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
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Sparkles className="w-5 h-5" />
            <span>Explore All Featured Products</span>
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HighlightedProducts
