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
  Droplets,
  HardDrive,
  Layers,
  Activity,
  X,
  UserCircle,
  Settings,
} from 'lucide-react'
import { assets } from '../assets/assets'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/add', icon: PlusCircle, label: 'Add Product' },
      { to: '/list', icon: List, label: 'All Products' },
      { to: '/highlighted-products', icon: Star, label: 'Highlighted' },
      { to: '/acid-wash-products', icon: Droplets, label: 'Acid Wash' },
    ],
  },
  {
    label: 'Storefront',
    items: [
      { to: '/add-banner', icon: Image, label: 'Add Banner' },
      { to: '/banner-list', icon: Layers, label: 'Banner List' },
    ],
  },
  {
    label: 'Orders',
    items: [
      { to: '/orders', icon: ShoppingBag, label: 'All Orders' },
      { to: '/cancel-orders', icon: XCircle, label: 'Cancellations' },
      { to: '/return-orders', icon: RotateCcw, label: 'Returns' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { to: '/user-list', icon: Users, label: 'Users' },
      { to: '/newsletter-subscribers', icon: Mail, label: 'Newsletter' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { to: '/coupons', icon: Tag, label: 'Coupons' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/storage', icon: HardDrive, label: 'Storage' },
      { to: '/performance-reports', icon: Activity, label: 'Performance Reports' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', icon: UserCircle, label: 'My Profile' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          bg-gray-950 transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:translate-x-0 lg:shrink-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <img src={assets.ink_dapper_logo} alt="logo" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">InkDapper</p>
              <p className="text-gray-500 text-xs">Admin Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600 select-none">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label, exact }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                            isActive ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                          size={18}
                        />
                        {label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin</p>
              <p className="text-gray-500 text-[10px] truncate">admin@inkdapper.com</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
