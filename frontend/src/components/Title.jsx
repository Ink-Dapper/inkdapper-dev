import React from 'react'

const Title = ({ text1, text2, text3, className }) => {
  return (
    <div className='relative mb-8'>
      {/* Main title container */}
      <div className='flex items-center gap-4 mb-2'>
        {/* Decorative line */}
        <div className='w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full'></div>

        {/* Title text */}
        <h2 className='text-2xl sm:text-4xl font-bold tracking-tight'>
          <span className='text-gray-600'>{text1}</span>
          <span className='bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent mx-2'>{text2}</span>
          <span className={`${className} text-gray-800`}>{text3}</span>
        </h2>

        {/* Decorative dot */}
        <div className='w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse'></div>
      </div>

      {/* Subtitle line */}
      <div className='flex items-center gap-2'>
        <div className='w-8 h-0.5 bg-orange-200 rounded-full'></div>
        <div className='w-4 h-0.5 bg-amber-200 rounded-full'></div>
        <div className='w-2 h-0.5 bg-yellow-200 rounded-full'></div>
      </div>
    </div>
  )
}

export default Title