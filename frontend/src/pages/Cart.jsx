import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import CheckoutProgress from '../components/CheckoutProgress'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, setCartItems, customDataArray, updateCustomQuantity, getCustomData, updateCartAndSave, hasMultipleProducts, getUserCustomData, token } = useContext(ShopContext)
  const [cartData, SetCartData] = useState([])
  const [showCartTotal, setShowCartTotal] = useState([])

  // Refresh custom cart data whenever Cart page mounts
  useEffect(() => {
    if (token) getUserCustomData();
  }, [])

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
      SetCartData(tempData)
      setShowCartTotal(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='ragged-section min-h-screen' style={{ background: '#0d0d0e' }}>
      <div className='ragged-noise' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:py-14'>

        {/* ── Page Header ── */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-3 mb-4'>
            <div className='w-8 h-px' style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
            <span className='text-xs font-bold uppercase tracking-[0.22em] text-orange-400'>My Cart</span>
            <div className='w-8 h-px' style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
          </div>
          <h1 className='ragged-title mb-5' style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)' }}>Shopping Cart</h1>

          <CheckoutProgress currentStep={0} />
        </div>

        {/* ── Discount / Combo banners ── */}
        {!hasMultipleProducts() && showCartTotal.length > 0 && (
          <div className='mb-6 rounded-xl px-5 py-3.5 flex items-center gap-4'
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)' }}>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <svg className='w-8 h-8 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
              </svg>
            </div>
            <div>
              <div className='text-md font-bold text-blue-400'>Get 7% Off!</div>
              <div className='text-sm text-slate-300'>Buy more than one product or increase quantity to unlock discount</div>
            </div>
          </div>
        )}

        {hasMultipleProducts() && (
          <div className='mb-6 rounded-xl px-5 py-3.5 flex items-center gap-4'
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <svg className='w-4 h-4 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <div>
              <div className='text-sm font-bold text-green-400'>Combo Offer Active!</div>
              <div className='text-xs text-slate-600'>You're getting 7% off for ordering multiple items!</div>
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        {showCartTotal.length === 0 && customDataArray.length === 0 ? (
          /* Empty Cart */
          <div className='text-center py-24'>
            <div className='relative inline-flex items-center justify-center mb-8'>
              <div className='absolute w-36 h-36 rounded-full blur-2xl pointer-events-none'
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)' }} />
              <div className='relative w-24 h-24 rounded-full flex items-center justify-center'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <svg className='w-12 h-12' style={{ color: 'rgba(249,115,22,0.4)' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
              </div>
            </div>
            <h2 className='ragged-title mb-4' style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Your Cart Is Empty</h2>
            <p className='text-slate-500 mb-8 text-base'>Looks like you haven't added any items yet.</p>
            <button
              onClick={() => { navigate('/collection'); scrollToTop(); }}
              className='inline-flex items-center gap-2 px-7 py-3.5 font-bold text-xs uppercase tracking-[0.1em] rounded-xl transition-all duration-300 hover:-translate-y-0.5'
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e', boxShadow: '0 0 20px rgba(249,115,22,0.25)' }}
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

            {/* ── Cart Items ── */}
            <div className='lg:col-span-2'>
              <div className='relative rounded-2xl overflow-hidden'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}>
                {/* Top accent bar */}
                <div className='absolute top-0 left-0 w-full h-0.5'
                  style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />

                {/* Card header */}
                <div className='px-6 py-5 flex items-center gap-3'
                  style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
                  <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
                    style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <svg className='w-4 h-4 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-0.5 h-4 rounded-full' style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '1.15rem', color: '#f1f5f9' }}>
                      Cart Items ({cartData.length + customDataArray.length})
                    </h2>
                  </div>
                </div>

                {/* Items list */}
                <div>
                  {/* Regular Products */}
                  {cartData.length > 0 && cartData.map((item, index) => {
                    const productData = products.find((product) => product._id === item._id);
                    if (!productData) return null;
                    return (
                      <div key={index} className='relative p-5 md:p-6 group transition-colors duration-300'
                        style={{ borderBottom: '1px solid rgba(249,115,22,0.07)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div className='flex flex-col sm:flex-row sm:items-start gap-5'>

                          {/* Product Image */}
                          <div className='flex-shrink-0 flex justify-center sm:justify-start'>
                            <div className='relative'>
                              <img
                                className='w-44 h-48 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl transition-all duration-300'
                                style={{ border: '1px solid rgba(249,115,22,0.2)' }}
                                src={productData.image[0]}
                                alt={productData.name}
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className='flex-1 min-w-0 flex flex-col'>
                            {/* Mobile remove */}
                            <button
                              onClick={() => updateQuantity(item._id, item.size, 0)}
                              className='absolute top-3 right-3 sm:hidden p-1.5 rounded-lg transition-all duration-200'
                              style={{ color: '#475569' }}
                              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            </button>

                            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                              <div className='flex-1'>
                                <h3 className='text-base md:text-lg font-bold mb-1' style={{ color: '#f1f5f9' }}>{productData.name}</h3>
                                <p className='text-xl font-bold text-orange-400 mb-3'>{currency} {productData.price}</p>

                                {/* Combo Pricing */}
                                {productData.comboPrices && productData.comboPrices.length > 0 && (
                                  <div className='mb-3'>
                                    <div className='text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-2'>Combo Offers</div>
                                    <div className='flex flex-wrap gap-2'>
                                      {productData.comboPrices.slice(0, 2).map((combo, ci) => (
                                        <div key={ci} className='rounded-lg px-2.5 py-1.5'
                                          style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)' }}>
                                          <div className='font-bold text-orange-400 text-xs'>{combo.quantity}x for {currency} {combo.price} each</div>
                                          {combo.discount > 0 && <div className='text-green-400 text-xs'>{combo.discount}% OFF</div>}
                                        </div>
                                      ))}
                                      {productData.comboPrices.length > 2 && (
                                        <div className='rounded-lg px-2.5 py-1.5'
                                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                          <div className='text-slate-500 text-xs font-bold'>+{productData.comboPrices.length - 2} more</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Size & Quantity */}
                                <div className='flex flex-row items-end gap-4 mb-3'>
                                  {/* Size */}
                                  <div className='flex flex-col gap-1'>
                                    <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600'>Size</span>
                                    <div className='rounded-xl overflow-hidden'
                                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                      <FormControl size='small' sx={{ minWidth: 100 }}>
                                        <Select
                                          value={item.size}
                                          onChange={(e) => updateSize(item._id, e.target.value, item.quantity)}
                                          sx={{
                                            color: '#cbd5e1',
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '& .MuiSelect-select': { padding: '8px 12px', fontSize: '0.875rem' },
                                            '& .MuiSelect-icon': { color: '#64748b' },
                                          }}
                                        >
                                          {productData.sizes.map((size) => (
                                            <MenuItem key={size} value={size}>{size}</MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </div>
                                  </div>

                                  {/* Quantity */}
                                  <div className='flex flex-col gap-1'>
                                    <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600'>Quantity</span>
                                    <div className='flex items-center rounded-xl overflow-hidden'
                                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                      <button
                                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className='px-3 py-2.5 text-slate-500 hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200'
                                      >
                                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                                        </svg>
                                      </button>
                                      <span className='px-4 py-2 text-center font-bold text-slate-200 text-sm'
                                        style={{ borderLeft: '1px solid rgba(249,115,22,0.15)', borderRight: '1px solid rgba(249,115,22,0.15)' }}>
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                        className='px-3 py-2.5 text-slate-500 hover:text-orange-400 transition-colors duration-200'
                                      >
                                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Desktop remove */}
                              <button
                                onClick={() => updateQuantity(item._id, item.size, 0)}
                                className='hidden sm:flex flex-shrink-0 p-2 rounded-xl self-start transition-all duration-200'
                                style={{ color: '#475569' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
                              >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                              </button>
                            </div>

                            {/* Item total */}
                            <div className='flex items-center justify-between mt-3 pt-3'
                              style={{ borderTop: '1px solid rgba(249,115,22,0.08)' }}>
                              <span className='text-xs font-bold uppercase tracking-[0.12em] text-slate-600'>Item Total</span>
                              <span className='text-lg font-bold text-green-400'>
                                {currency} {(productData.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Products */}
                  {customDataArray.length > 0 && customDataArray.map((data, index) => (
                    <div key={`custom-${index}`} className='relative p-5 md:p-6 transition-colors duration-300'
                      style={{ borderBottom: '1px solid rgba(249,115,22,0.07)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div className='flex flex-col sm:flex-row sm:items-start gap-5'>

                        {/* Image */}
                        <div className='flex-shrink-0 flex justify-center sm:justify-start'>
                          <img
                            className='w-20 sm:w-24 md:w-28 object-contain rounded-xl transition-all duration-300'
                            style={{ border: '1px solid rgba(168,85,247,0.25)', aspectRatio: '5/6' }}
                            src={(Array.isArray(data.reviewImageCustom) ? data.reviewImageCustom[0] : data.reviewImageCustom) || data.aiDesignUrl}
                            alt={data.name}
                          />
                        </div>

                        {/* Details */}
                        <div className='flex-1 min-w-0 flex flex-col relative'>
                          {/* Mobile remove */}
                          <button
                            onClick={() => updateCustomQuantity(data._id, data.size, 0)}
                            className='absolute top-0 right-0 sm:hidden p-1.5 rounded-lg transition-all duration-200'
                            style={{ color: '#475569' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>

                          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                            <div className='flex-1'>
                              <div className='flex flex-wrap items-center gap-2 mb-1'>
                                <h3 className='text-base md:text-lg font-bold' style={{ color: '#f1f5f9' }}>{data.name}</h3>
                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]'
                                  style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                                  Custom Design
                                </span>
                              </div>
                              <p className='text-xl font-bold mb-3' style={{ color: '#c084fc' }}>{currency} {data.price}</p>

                              <div className='flex flex-row items-center gap-4 mb-3'>
                                <div className='flex items-center gap-2'>
                                  <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600'>Size</span>
                                  <span className='text-sm font-bold text-slate-300'>{data.size}</span>
                                </div>
                                <div className='w-px h-4' style={{ background: 'rgba(255,255,255,0.08)' }} />
                                <div className='flex items-center gap-2'>
                                  <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600'>Qty</span>
                                  <span className='text-sm font-bold text-slate-300'>{data.quantity}</span>
                                </div>
                              </div>
                            </div>

                            {/* Desktop remove */}
                            <button
                              onClick={() => updateCustomQuantity(data._id, data.size, 0)}
                              className='hidden sm:flex flex-shrink-0 p-2 rounded-xl self-start transition-all duration-200'
                              style={{ color: '#475569' }}
                              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            </button>
                          </div>

                          {/* Item total */}
                          <div className='flex items-center justify-between mt-3 pt-3'
                            style={{ borderTop: '1px solid rgba(249,115,22,0.08)' }}>
                            <span className='text-xs font-bold uppercase tracking-[0.12em] text-slate-600'>Item Total</span>
                            <span className='text-lg font-bold' style={{ color: '#c084fc' }}>
                              {currency} {(data.price * data.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Order Summary Sidebar ── */}
            <div className='lg:col-span-1'>
              <div className='relative rounded-2xl overflow-hidden sticky top-4'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}>
                {/* Top accent bar */}
                <div className='absolute top-0 left-0 w-full h-0.5'
                  style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
                {/* Corner glow */}
                <div className='absolute top-0 right-0 w-40 h-40 pointer-events-none'
                  style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,0.06), transparent 70%)' }} />

                {/* Header */}
                <div className='relative px-6 py-5 flex items-center gap-2'
                  style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
                  <div className='w-0.5 h-5 rounded-full' style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '1.15rem', color: '#f1f5f9' }}>
                    Order Summary
                  </h2>
                </div>

                <div className='relative p-6'>
                  <CartTotal />

                  <div className='mt-6 space-y-3'>
                    <button
                      onClick={() => navigate('/place-order')}
                      className='w-full py-3.5 font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.1em]'
                      style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e', boxShadow: '0 0 20px rgba(249,115,22,0.2)' }}
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                      </svg>
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      className='w-full py-3.5 font-semibold rounded-xl transition-all duration-200 text-xs uppercase tracking-[0.08em]'
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security badge */}
                  <div className='mt-5 pt-4 flex items-center gap-2.5'
                    style={{ borderTop: '1px solid rgba(249,115,22,0.08)' }}>
                    <svg className='w-4 h-4 text-green-400 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                    </svg>
                    <span className='text-xs text-slate-400'>Secure checkout with SSL encryption</span>
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
