import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'

const CreditPoints = () => {

  const { creditPoints, currency, getCreditScore, token } = useContext(ShopContext)

  useEffect(() => {
    if (token) {
      getCreditScore();
    }
  }, [token, creditPoints]);

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-8'>
        <div className='w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg'>
          <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
          </svg>
        </div>
        <div className='text-right'>
          <p className='text-slate-300 text-sm font-semibold'>Credit Score</p>
          <p className='text-slate-500 text-xs mt-1'>Available balance</p>
        </div>
      </div>
      <div className='space-y-3'>
        <div className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent'>
          {creditPoints}
          <span className='text-3xl md:text-4xl ml-2'>{currency}</span>
        </div>
        <p className='text-slate-400 text-sm font-medium'>Available for your next purchase</p>
      </div>
    </div>
  )
}

export default CreditPoints