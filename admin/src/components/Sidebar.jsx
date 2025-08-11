import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Image,
  PlusCircle,
  List,
  ShoppingBag,
  RotateCcw,
  XCircle,
  Mail
} from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='w-[18%] border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink to='/' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <LayoutDashboard className='w-5 h-5' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        <NavLink to='/user-list' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <Users className='w-5 h-5' />
          <p className='hidden md:block'>Users List</p>
        </NavLink>

        <NavLink to='/newsletter-subscribers' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <Mail className='w-5 h-5' />
          <p className='hidden md:block'>Newsletter</p>
        </NavLink>

        <NavLink to='/add-banner' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <Image className='w-5 h-5' />
          <p className='hidden md:block'>Add Banner</p>
        </NavLink>

        <NavLink to='/add' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <PlusCircle className='w-5 h-5' />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink to='/list' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <List className='w-5 h-5' />
          <p className='hidden md:block'>List Items</p>
        </NavLink>

        <NavLink to='/orders' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <ShoppingBag className='w-5 h-5' />
          <p className='hidden md:block'>Orders</p>
        </NavLink>

        {/* <NavLink to='/complete-delivery' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <img className='w-5 h-5' src={assets.order_icon} alt="add_icon" />
          <p className='hidden md:block'>Completed Orders</p>
        </NavLink> */}

        <NavLink to='/return-orders' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <RotateCcw className='w-5 h-5' />
          <p className='hidden md:block'>Return Orders</p>
        </NavLink>

        {/* <NavLink to='/return-orders-complete' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <img className='w-5 h-5' src={assets.order_icon} alt="add_icon" />
          <p className='hidden md:block'>Return Completed</p>
        </NavLink> */}

        <NavLink to='/cancel-orders' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
          <XCircle className='w-5 h-5' />
          <p className='hidden md:block'>Cancel Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar