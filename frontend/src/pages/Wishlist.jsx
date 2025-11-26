import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Wishlist = () => {
  const { setWishlist, products, currency, wishlist, backendUrl, token, updateWishlistQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showCartTotal, setShowCartTotal] = useState([]);

  const wishlistLength = Object.keys(wishlist).filter(item => wishlist[item] > 0).length;

  // Use the updateWishlistQuantity function from context instead of local implementation
  const removeFromWishlist = async (itemId) => {
    await updateWishlistQuantity(itemId, 0);
  };

  console.log(wishlist)

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const items in wishlist) {
        if (wishlist[items] > 0) {
          tempData.push({
            _id: items
          })
        }
      }
      setCartData(tempData)
      setShowCartTotal(tempData);
    }
  }, [wishlist, products])

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className="sr-only">Your Wishlist</h1>

        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4'>
            <Title text1={'YOUR'} text2={'WISHLIST'} />
          </div>
          <p className='text-gray-600 text-lg'>Discover your saved favorites</p>
        </div>

        {/* Wishlist Items */}
        <div className=''>
          {showCartTotal && showCartTotal.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <div className='w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
                <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'></path>
                </svg>
              </div>
              <h2 className='text-2xl md:text-3xl font-semibold text-gray-700 mb-2'>Your Wishlist is Empty</h2>
              <p className='text-gray-500 text-center max-w-md'>Start adding your favorite products to see them here</p>
              <Link to='/collection' className='mt-6 inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                Browse Products
                <svg className='ml-2 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3'></path>
                </svg>
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {cartData.map((item, index) => {
                const productData = products.find((product) => product._id === item._id);
                if (!productData) {
                  return null;
                }
                return (
                  <div key={index} className='group bg-white rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden relative'>
                    {/* Product Image */}
                    <div className='relative aspect-square overflow-hidden bg-gray-50'>
                      <img
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        src={productData.image[0]}
                        alt={productData.name}
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className='absolute top-3 right-3 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-200 shadow-sm z-10'
                        title="Remove from wishlist"
                      >
                        <svg className='w-5 h-5 text-gray-600 hover:text-white transition-colors duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'></path>
                        </svg>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className='p-4'>
                      <h3 className='text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight'>
                        {productData.name}
                      </h3>

                      <div className='flex items-center justify-between mb-3'>
                        <span className='text-lg font-semibold text-gray-900'>
                          {currency} {productData.price}
                        </span>
                        <div className='flex items-center text-xs text-gray-500'>
                          <svg className='w-3 h-3 text-yellow-400 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                          </svg>
                          4.5
                        </div>
                      </div>

                      {/* View Product / Add to Cart Button */}
                      <Link to={`/product/${productData.slug}`} className='block'>
                        <button className='w-full bg-black text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'></path>
                          </svg>
                          Add to Cart
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Wishlist