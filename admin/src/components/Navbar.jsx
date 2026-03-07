import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, LogOut, ChevronDown, User, Settings, Bell } from 'lucide-react'
import { assets } from '../assets/assets'
import NotificationBell from './NotificationBell'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/add': 'Add Product',
  '/list': 'All Products',
  '/orders': 'Orders',
  '/complete-delivery': 'Complete Delivery',
  '/return-orders': 'Return Orders',
  '/return-orders-complete': 'Completed Returns',
  '/add-banner': 'Add Banner',
  '/banner-list': 'Banner List',
  '/banner-images': 'Banner Images',
  '/user-list': 'Users',
  '/cancel-orders': 'Cancellations',
  '/cancel-order-completed': 'Completed Cancellations',
  '/newsletter-subscribers': 'Newsletter',
  '/highlighted-products': 'Highlighted Products',
  '/acid-wash-products': 'Acid Wash Products',
  '/coupons': 'Coupons',
  '/storage': 'Storage Manager',
  '/performance-reports': 'Control & Performance Reports',
}

const Navbar = ({ setToken, onMenuClick }) => {
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin'

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo (mobile only) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
          <img src={assets.ink_dapper_logo} alt="logo" className="w-5 h-5 object-contain brightness-0 invert" />
        </div>
        <span className="text-gray-900 font-bold text-sm">InkDapper</span>
      </div>

      {/* Page title (desktop) */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Admin</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-semibold text-sm">{pageTitle}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">Admin</p>
              <p className="text-xs text-gray-400 leading-tight">Super Admin</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Admin Account</p>
                <p className="text-xs text-gray-400 truncate">admin@inkdapper.com</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => { setToken(''); setDropdownOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
