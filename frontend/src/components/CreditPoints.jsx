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
    <div className='credit-points'>
      <div className='flex flex-col pl-4'>
        <p className='flex justify-center items-center px-6 w-36 md:w-60 h-28 md:h-40 shadow-lg shadow-slate-500 bg-slate-100 text-5xl md:text-8xl relative -z-10'>{creditPoints} <span className='text-4xl absolute right-4 bottom-4'>{currency}</span></p>
        <p className='font-medium text-base md:text-lg w-36 md:w-60 h-auto px-7 py-3 md:px-6 text-center bg-gray-950 text-white'>Your Credit Score</p>
      </div>
    </div>
  )
}

export default CreditPoints