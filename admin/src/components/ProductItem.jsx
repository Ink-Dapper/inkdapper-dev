import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, Edit, Trash2, Star, Zap } from 'lucide-react'
import { imageProxyUrl } from '../utils/storageUrl'

const ProductItem = ({
  id,
  image,
  name,
  price,
  beforePrice,
  soldout,
  subCategory,
  slug,
  bestseller
}) => {
  const discountPercentage = beforePrice && price ? Math.round(((beforePrice - price) / beforePrice) * 100) : 0

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image && image.length > 0 ? (
          <img
            src={imageProxyUrl(image[0])}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {bestseller && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              <Star className="w-3 h-3 inline mr-1" />
              Best Seller
            </div>
          )}
          {soldout && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              Sold Out
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Link
              to={`/product/${id}`}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
              title="View Product"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </Link>
            <button
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
              title="Edit Product"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="w-10 h-10 bg-red-500/90 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-200"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {name}
        </h3>

        {/* Subcategory */}
        <div className="flex items-center gap-1 mb-2">
          <Zap className="w-3 h-3 text-orange-500" />
          <span className="text-xs text-gray-500 font-medium">{subCategory}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">₹{price}</span>
          {beforePrice && beforePrice > price && (
            <span className="text-sm text-gray-500 line-through">₹{beforePrice}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/product/${id}`}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
          >
            View Details
          </Link>
          <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductItem
