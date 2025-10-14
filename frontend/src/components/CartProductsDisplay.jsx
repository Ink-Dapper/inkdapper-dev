import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartProductsDisplay = () => {
  const { products, currency, cartItems, customDataArray, updateQuantity, updateCustomQuantity } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0 || customDataArray.length > 0) {
      const tempData = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products, customDataArray])

  if (cartData.length === 0 && customDataArray.length === 0) {
    return null
  }

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
            Order Items ({cartData.length + customDataArray.length})
          </h2>
        </div>
        <p className='text-gray-600 text-sm'>Review your selected items</p>
      </div>

      <div className='space-y-4'>
        {/* Regular Products */}
        {cartData.length > 0 && cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          if (!productData) {
            return null;
          }
          return (
            <div key={index} className='p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 relative'>
              {/* Delete Button */}
              <button
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200'
                title='Remove item'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </button>

              <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pr-8'>
                {/* Product Image */}
                <div className='flex-shrink-0 flex justify-center sm:justify-start'>
                  <img
                    className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm'
                    src={productData.image[0]}
                    alt={productData.name}
                  />
                </div>

                {/* Product Details */}
                <div className='flex-1 min-w-0'>
                  <h3 className='text-lg font-bold text-gray-900 mb-1'>{productData.name}</h3>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
                    <div className='flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm text-gray-600'>Size:</span>
                        <span className='text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded'>{item.size}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm text-gray-600'>Qty:</span>
                        <span className='text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded'>{item.quantity}</span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
                        {currency} {(productData.price * item.quantity).toFixed(2)}
                      </p>
                      <p className='text-xs text-gray-500'>{currency} {productData.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Products */}
        {customDataArray.length > 0 && customDataArray.map((data, index) => (
          <div key={`custom-${index}`} className='p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 relative'>
            {/* Delete Button */}
            <button
              onClick={() => updateCustomQuantity(data._id, data.size, 0)}
              className='absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200'
              title='Remove item'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
            </button>

            <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pr-8'>
              {/* Product Image */}
              <div className='flex-shrink-0 flex justify-center sm:justify-start'>
                <img
                  className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm'
                  src={data.reviewImageCustom}
                  alt={data.name}
                />
              </div>

              {/* Product Details */}
              <div className='flex-1 min-w-0'>
                <div className='flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-1'>
                  <h3 className='text-lg font-bold text-gray-900'>{data.name}</h3>
                  <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
                    Custom Design
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
                  <div className='flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-600'>Size:</span>
                      <span className='text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded'>{data.size}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-600'>Qty:</span>
                      <span className='text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded'>{data.quantity}</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                      {currency} {(data.price * data.quantity).toFixed(2)}
                    </p>
                    <p className='text-xs text-gray-500'>{currency} {data.price} each</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CartProductsDisplay
