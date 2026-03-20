import React, { useContext, useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProfileListItems from '../components/ProfileListItems'
import CreditPoints from '../components/CreditPoints'

const Profile = () => {
  const { usersDetails, orderCount, fetchOrderDetails, getCreditScore, navigate } = useContext(ShopContext)
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === false) {
      getCreditScore()
      fetchOrderDetails()
      effectRan.current = true
    }

    return () => {
      effectRan.current = false
    }
  }, [])

  return (
    <div className='ragged-section min-h-screen' style={{ background: '#0d0d0e' }}>
      <div className='ragged-noise' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:py-14'>
        <h1 className="sr-only">Your Profile</h1>

        {usersDetails.map((user) => (
          <div key={user.users._id} className='space-y-8 md:space-y-10'>
            <div
              className='relative overflow-hidden rounded-2xl p-6 md:p-10'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.2)' }}
            >
              <div className='absolute top-0 left-0 w-full h-0.5' style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              <div className='absolute -top-16 -right-10 w-44 h-44 rounded-full blur-3xl opacity-30' style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.75), transparent 70%)' }} />

              <div className='relative'>
                <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4' style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Welcome Back</span>
                </div>

                <h2 className='ragged-title text-4xl md:text-6xl mb-3'>{user.users.name}</h2>
                <p className='text-slate-400 max-w-2xl text-sm sm:text-base'>
                  Manage your account, track orders, and keep your style journey moving.
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6'>
              <div
                className='relative rounded-2xl p-6 sm:p-8 overflow-hidden'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <div className='absolute top-0 left-0 w-full h-0.5' style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
                <div className='flex items-center justify-between mb-6'>
                  <p className='text-xs uppercase tracking-[0.16em] text-slate-400 font-semibold'>Total Purchases</p>
                  <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                  </div>
                </div>
                <p className='text-5xl font-bold text-orange-300 leading-none'>{orderCount}</p>
                <p className='text-slate-400 text-sm mt-3'>Orders completed successfully</p>
              </div>

              <div
                className='relative rounded-2xl p-6 sm:p-8 overflow-hidden'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <div className='absolute top-0 left-0 w-full h-0.5' style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316, transparent)' }} />
                <CreditPoints />
              </div>
            </div>

            <div
              className='relative rounded-2xl p-6 sm:p-8 overflow-hidden'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              <div className='absolute top-0 left-0 w-full h-0.5' style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              <h3 className='ragged-title text-2xl mb-2'>Quick Actions</h3>
              <p className='text-slate-400 text-sm mb-5'>Manage your account and shopping flow.</p>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                <Link to="/profile" className='rounded-xl px-4 py-4 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5'
                  style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.32)', color: '#fdba74' }}>
                  Edit Profile
                </Link>
                <Link to="/orders" className='rounded-xl px-4 py-4 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5'
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.32)', color: '#fcd34d' }}>
                  My Orders
                </Link>
                <Link to="/wishlist" className='rounded-xl px-4 py-4 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5'
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', color: '#fde68a' }}>
                  Wishlist
                </Link>
                <button
                  onClick={() => navigate("/collection")}
                  className='rounded-xl px-4 py-4 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5'
                  style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e' }}
                >
                  Shop Now
                </button>
              </div>
            </div>

            <div className='space-y-6'>
              <ProfileListItems />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Profile)
