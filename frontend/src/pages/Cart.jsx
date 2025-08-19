import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, setCartItems, customDataArray, updateCustomQuantity, getCustomData, updateCartAndSave } = useContext(ShopContext)
  const [cartData, SetCartData] = useState([])
  const [showCartTotal, setShowCartTotal] = useState([])

  const updateSize = (productId, newSize, quantity) => {
    const updatedCart = { ...cartItems };
    const currentSizes = updatedCart[productId];
    if (currentSizes) {
      const currentSizeKey = Object.keys(currentSizes).find(size => currentSizes[size] === quantity);
      if (currentSizeKey) {
        delete currentSizes[currentSizeKey];
      }
      if (!currentSizes[newSize]) {
        currentSizes[newSize] = 0;
      }
      currentSizes[newSize] += quantity;
    }
    updateCartAndSave(updatedCart);
  };

  useEffect(() => {
    if (products.length > 0 || customDataArray.length > 0) {
      const tempData = []
      for (const items in cartItems) {
        console.log(cartItems[items])
        for (const item in cartItems[items]) {
          console.log(cartItems[items][item])
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      // // Add custom data to the cart display
      if (customDataArray.length > 0) {
        customDataArray.forEach(customItem => {
          tempData.push({
            _id: customItem._id,
            size: customItem.size,
            quantity: customItem.quantity
          });
        });
      }

      // Remove duplicates based on _id and size
      tempData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t._id === item._id && t.size === item.size
        ))
      );

      SetCartData(tempData)
      setShowCartTotal(tempData);
      console.log(tempData)
    }
  }, [cartItems, products, getCustomData])

  return (
    <div className='min-h-screen'>
      {/* Header Section */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0'>
            <div className='text-center md:text-left'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-orange-600 to-red-600 bg-clip-text text-transparent'>
                Shopping Cart
              </h1>
              <p className='text-slate-600 mt-3 text-lg'>Review your items and proceed to checkout</p>
            </div>
            <div className='hidden md:block'>
              <div className='flex items-center space-x-6'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg'>
                    1
                  </div>
                  <span className='ml-3 text-slate-700 font-medium'>Cart</span>
                </div>
                <div className='w-12 h-1 bg-gradient-to-r from-orange-200 to-red-200 rounded-full'></div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-sm font-medium'>
                    2
                  </div>
                  <span className='ml-3 text-slate-500'>Checkout</span>
                </div>
                <div className='w-12 h-1 bg-gradient-to-r from-orange-200 to-red-200 rounded-full'></div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-sm font-medium'>
                    3
                  </div>
                  <span className='ml-3 text-slate-500'>Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-8xl mx-auto px-4 sm:px-0 py-8'>
        {showCartTotal.length === 0 ? (
          // Empty Cart State
          <div className='text-center py-20 md:py-32'>
            <div className='max-w-lg mx-auto'>
              <div className='w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-xl'>
                <svg className='w-16 h-16 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
              </div>
              <h2 className='text-3xl font-bold text-slate-900 mb-4'>Your cart is empty</h2>
              <p className='text-slate-600 mb-10 text-lg'>Looks like you haven't added any items to your cart yet.</p>
              <button
                onClick={() => navigate('/')}
                className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden'>
                <div className='px-6 py-6 bg-gradient-to-r from-slate-50 to-orange-50 border-b border-slate-100'>
                  <h2 className='text-xl font-bold text-slate-900 flex items-center'>
                    <svg className='w-6 h-6 mr-3 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                    Cart Items ({cartData.length + customDataArray.length})
                  </h2>
                </div>

                <div className='divide-y divide-slate-100'>
                  {/* Regular Products */}
                  {cartData.length > 0 && cartData.map((item, index) => {
                    const productData = products.find((product) => product._id === item._id);
                    if (!productData) {
                      return null;
                    }
                    return (
                      <div key={index} className='p-6 shadow-sm mb-2 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-300 relative'>
                        <div className='flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6'>
                          {/* Product Image */}
                          <div className='flex-shrink-0 flex justify-center sm:justify-start'>
                            <div className='relative group'>
                              <img
                                className='w-48 h-52 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl border-2 border-slate-200 shadow-md group-hover:border-orange-300 transition-all duration-300'
                                src={productData.image[0]}
                                alt={productData.name}
                              />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className='flex-1 min-w-0 flex flex-col'>
                            {/* Remove Button - Mobile Only */}
                            <button
                              onClick={() => updateQuantity(item._id, item.size, 0)}
                              className='absolute top-2 right-2 sm:hidden p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300'
                              title='Remove item'
                            >
                              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            </button>

                            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0'>
                              <div className='flex-1'>
                                <h3 className='text-lg md:text-xl font-bold text-slate-900 mb-2'>{productData.name}</h3>
                                <p className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4'>
                                  {currency} {productData.price}
                                </p>

                                {/* Size and Quantity on same line */}
                                <div className='flex flex-row items-start space-x-4 mb-4'>
                                  {/* Size Selector */}
                                  <div className='flex flex-col space-y-1'>
                                    <span className='text-sm font-medium text-slate-700'>Size:</span>
                                    <div className='bg-slate-50 border-2 h-8 md:h-12 border-slate-300 rounded-xl shadow-md hover:border-orange-300 transition-all duration-300 flex items-center'>
                                      <FormControl size="small" sx={{ minWidth: 100, sm: { minWidth: 140 } }}>
                                        <Select
                                          value={item.size}
                                          onChange={(e) => updateSize(item._id, e.target.value, item.quantity)}
                                          sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                              borderColor: 'transparent',
                                              borderRadius: '12px',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                              borderColor: 'transparent',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                              borderColor: 'transparent',
                                            },
                                            '& .MuiSelect-select': {
                                              padding: '8px 12px',
                                              borderRadius: '12px',
                                              height: '40px',
                                              display: 'flex',
                                              alignItems: 'center',
                                            },
                                          }}
                                        >
                                          {productData.sizes.map((size) => (
                                            <MenuItem key={size} value={size}>{size}</MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </div>
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className='flex flex-col space-y-1'>
                                    <span className='text-sm font-medium text-slate-700'>Quantity:</span>
                                    <div className='flex items-center bg-slate-50 border-2 border-slate-300 rounded-xl shadow-md hover:border-orange-300 transition-all duration-300'>
                                      <button
                                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                        className='px-2 py-1 sm:px-4 sm:py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl'
                                        disabled={item.quantity <= 1}
                                      >
                                        <svg className='w-3 h-3 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                                        </svg>
                                      </button>
                                      <span className='px-2 py-1 sm:px-6 sm:py-2 text-center min-w-[2rem] sm:min-w-[4rem] font-bold text-slate-900 text-sm sm:text-lg border-x border-slate-200'>{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                        className='px-2 py-1 sm:px-4 sm:py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 rounded-r-xl'
                                      >
                                        <svg className='w-3 h-3 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Remove Button - Desktop Only */}
                              <button
                                onClick={() => updateQuantity(item._id, item.size, 0)}
                                className='hidden sm:flex flex-shrink-0 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 self-start'
                                title='Remove item'
                              >
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                              </button>
                            </div>

                            {/* Total Price */}
                            <div className='flex justify-between items-center md:justify-end mt-4'>
                              <span className='text-base text-slate-500 font-bold '>Total Price : </span>
                              <div className='text-right'>
                                <p className='text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'>
                                  {currency} {(productData.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Products */}
                  {customDataArray.length > 0 && customDataArray.map((data, index) => (
                    <div key={`custom-${index}`} className='p-6 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300'>
                      <div className='flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6'>
                        {/* Product Image */}
                        <div className='flex-shrink-0 flex justify-center sm:justify-start'>
                          <div className='relative group'>
                            <img
                              className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl border-2 border-slate-200 shadow-md group-hover:border-purple-300 transition-all duration-300'
                              src={data.reviewImageCustom}
                              alt={data.name}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className='flex-1 min-w-0 flex flex-col relative'>
                          {/* Remove Button - Mobile Only */}
                          <button
                            onClick={() => updateCustomQuantity(data._id, data.size, 0)}
                            className='absolute top-0 right-0 sm:hidden p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300'
                            title='Remove item'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>

                          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0'>
                            <div className='flex-1'>
                              <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2'>
                                <h3 className='text-lg md:text-xl font-bold text-slate-900'>{data.name}</h3>
                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'>
                                  Custom Design
                                </span>
                              </div>
                              <p className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4'>
                                {currency} {data.price}
                              </p>

                              {/* Size and Quantity on same line */}
                              <div className='flex flex-row items-start space-x-4 mb-4'>
                                <div className='flex flex-col space-y-1'>
                                  <span className='text-sm font-medium text-slate-700'>Size: <span className='font-bold text-slate-900'>{data.size}</span></span>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                  <span className='text-sm font-medium text-slate-700'>Quantity: <span className='font-bold text-slate-900'>{data.quantity}</span></span>
                                </div>
                              </div>
                            </div>

                            {/* Remove Button - Desktop Only */}
                            <button
                              onClick={() => updateCustomQuantity(data._id, data.size, 0)}
                              className='hidden sm:flex flex-shrink-0 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 self-start'
                              title='Remove item'
                            >
                              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            </button>
                          </div>

                          {/* Total Price */}
                          <div className='flex justify-end mt-4'>
                            <div className='text-right'>
                              <p className='text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                                {currency} {(data.price * data.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 sticky top-4 overflow-hidden'>
                <div className='px-6 py-6 bg-gradient-to-r from-slate-50 to-orange-50 border-b border-slate-100'>
                  <h2 className='text-xl font-bold text-slate-900 flex items-center'>
                    <svg className='w-6 h-6 mr-3 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                    </svg>
                    Order Summary
                  </h2>
                </div>

                <div className='p-6'>
                  <CartTotal />

                  <div className='mt-8 space-y-4'>
                    <button
                      onClick={() => navigate('/place-order')}
                      className='w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3'
                    >
                      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                      </svg>
                      <span>Proceed to Checkout</span>
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      className='w-full bg-slate-100 text-slate-700 py-4 px-6 rounded-xl font-semibold hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 transform hover:scale-105'
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className='mt-8 pt-6 border-t border-slate-200'>
                    <div className='flex items-center space-x-3 text-sm text-slate-600 bg-green-50 p-4 rounded-xl'>
                      <svg className='w-6 h-6 text-green-500 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                      </svg>
                      <span className='font-medium'>Secure checkout with SSL encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart