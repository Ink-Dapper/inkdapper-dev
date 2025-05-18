import React from 'react'
import { assets } from '../assets/assets'
import NotificationBell from './NotificationBell'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <div className='flex items-center gap-2'>
        <img className='w-[max(4%,40px)]' src={assets.ink_dapper_logo} alt="logo" />
        <p className='text-3xl font-medium'>Ink Dapper</p>
      </div>
      <div className='flex items-center gap-4'>
        <NotificationBell />
        <button onClick={() => setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar