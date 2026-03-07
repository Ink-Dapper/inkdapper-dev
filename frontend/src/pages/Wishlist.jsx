import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const Wishlist = () => {
  const { products, currency, wishlist, updateWishlistQuantity } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])
  const [showCartTotal, setShowCartTotal] = useState([])

  const wishlistLength = Object.keys(wishlist).filter(item => wishlist[item] > 0).length

  const removeFromWishlist = async (itemId) => {
    await updateWishlistQuantity(itemId, 0)
  }

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const items in wishlist) {
        if (wishlist[items] > 0) {
          tempData.push({ _id: items })
        }
      }
      setCartData(tempData)
      setShowCartTotal(tempData)
    }
  }, [wishlist, products])

  return (
    <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:py-14'>
        <h1 className="sr-only">Your Wishlist</h1>

        <div className='text-center mb-10 sm:mb-12'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4' style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Curated Picks</span>
          </div>
          <h2 className="ragged-title mb-2" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
            Your Wishlist
          </h2>
          <p className='text-slate-400 text-sm sm:text-base'>
            {wishlistLength} item{wishlistLength !== 1 ? 's' : ''} saved for later.
          </p>
        </div>

        {showCartTotal && showCartTotal.length === 0 ? (
          <div
            className='relative rounded-2xl overflow-hidden py-16 px-6 text-center max-w-2xl mx-auto'
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.18)' }}
          >
            <div className='absolute top-0 left-0 w-full h-0.5' style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
            <div className='w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-5' style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <svg className='w-10 h-10 text-orange-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'></path>
              </svg>
            </div>
            <h3 className='ragged-title text-3xl mb-2'>Wishlist Is Empty</h3>
            <p className='text-slate-400 max-w-md mx-auto'>
              Save your favorite fits and build your personal drop list.
            </p>
            <Link
              to='/collection'
              className='mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-[0.08em] transition-all duration-300 hover:-translate-y-0.5'
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e', boxShadow: '0 0 18px rgba(249,115,22,0.28)' }}
            >
              Browse Collection
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3'></path>
              </svg>
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id)
              if (!productData) {
                return null
              }

              return (
                <div
                  key={index}
                  className='group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1'
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.16)' }}
                >
                  <div className='absolute top-0 left-0 w-full h-0.5' style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />

                  <div className='relative aspect-square overflow-hidden' style={{ background: 'rgba(15,23,42,0.35)' }}>
                    <img
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      src={productData.image[0]}
                      alt={productData.name}
                    />

                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className='absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10'
                      style={{ background: 'rgba(13,13,14,0.82)', border: '1px solid rgba(248,113,113,0.35)', color: '#fca5a5' }}
                      title="Remove from wishlist"
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'></path>
                      </svg>
                    </button>
                  </div>

                  <div className='p-4'>
                    <h3 className='text-sm font-medium text-slate-100 mb-2 line-clamp-2 leading-tight'>
                      {productData.name}
                    </h3>

                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-lg font-semibold text-orange-300'>
                        {currency} {productData.price}
                      </span>
                      <div className='flex items-center text-xs text-slate-400'>
                        <svg className='w-3 h-3 text-amber-400 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                        </svg>
                        4.5
                      </div>
                    </div>

                    <Link to={`/product/${productData.slug}`} className='block'>
                      <button
                        className='w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2'
                        style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e' }}
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'></path>
                        </svg>
                        View Product
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
  )
}

export default Wishlist
