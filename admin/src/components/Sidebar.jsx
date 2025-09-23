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
  Mail,
  Tag,
  Star,
  Droplets
} from 'lucide-react'

const Sidebar = () => {
  const scrollTop = () => {
    // Target the main content container instead of window
    const mainContainer = document.querySelector('.main-container-right');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback to window scroll if container not found
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='w-[280px] bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm flex flex-col'>
      {/* Logo/Brand Section */}
      <div className='p-6 border-b border-slate-200 flex-shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
            <LayoutDashboard className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-slate-800'>Admin Panel</h1>
            <p className='text-sm text-slate-500'>InkDapper</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className='p-4 space-y-2 overflow-y-auto main-container-left'>
        {/* Dashboard */}
        <NavLink
          to='/'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <LayoutDashboard className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Dashboard</span>
        </NavLink>

        {/* Users List */}
        <NavLink
          to='/user-list'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <Users className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Users List</span>
        </NavLink>

        {/* Newsletter */}
        <NavLink
          to='/newsletter-subscribers'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <Mail className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Newsletter</span>
        </NavLink>

        {/* Add Banner */}
        <NavLink
          to='/add-banner'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <Image className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Add Banner</span>
        </NavLink>

        {/* Add Items */}
        <NavLink
          to='/add'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <PlusCircle className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Add Items</span>
        </NavLink>

        {/* List Items */}
        <NavLink
          to='/list'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <List className='w-5 h-5 transition-colors' />
          <span className='font-medium'>List Items</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to='/orders'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <ShoppingBag className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Orders</span>
        </NavLink>

        {/* Return Orders */}
        <NavLink
          to='/return-orders'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <RotateCcw className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Return Orders</span>
        </NavLink>

        {/* Cancel Orders */}
        <NavLink
          to='/cancel-orders'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <XCircle className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Cancel Orders</span>
        </NavLink>

        {/* Highlighted Products */}
        <NavLink
          to='/highlighted-products'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <Star className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Highlighted Products</span>
        </NavLink>

        {/* Acid Wash Products */}
        <NavLink
          to='/acid-wash-products'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <Droplets className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Acid Wash Products</span>
        </NavLink>

        {/* Coupons */}
        <NavLink
          to='/coupons'
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
          onClick={() => { scrollTop() }}
        >
          <Tag className='w-5 h-5 transition-colors' />
          <span className='font-medium'>Coupons</span>
        </NavLink>
      </div>

      {/* Footer Section */}
      <div className='p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0'>
        <div className='text-center'>
          <p className='text-sm text-slate-500'>Admin Panel v1.0</p>
          <p className='text-xs text-slate-400 mt-1'>© 2024 InkDapper</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar