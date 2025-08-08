import React, { useContext, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProfileListItems from '../components/ProfileListItems';
import CreditPoints from '../components/CreditPoints';

const Profile = () => {
  const { usersDetails, orderCount, fetchOrderDetails, getCreditScore, navigate } = useContext(ShopContext);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      getCreditScore();
      fetchOrderDetails();
      effectRan.current = true;
    }

    return () => {
      effectRan.current = false;
    };
  }, []);

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 right-10 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000'></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-200/15 rounded-full blur-3xl animate-pulse animation-delay-1000'></div>

      <div className='max-w-8xl mx-auto px-1 py-6 md:py-12 relative z-10'>
        <h1 className="sr-only">Your Profile</h1>
        {
          usersDetails.map((user) => (
            <div key={user.users._id} className='space-y-6 md:space-y-10'>
              {/* Hero Section */}
              <div className='relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-6 md:p-16 shadow-2xl border border-orange-400/20'>
                <div className='absolute inset-0 bg-gradient-to-br from-black/5 to-transparent'></div>
                <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl'></div>
                <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 blur-3xl'></div>

                <div className='relative z-10'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                    <div className='space-y-4 md:space-y-6'>
                      <div className='inline-flex items-center px-3 md:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 w-fit'>
                        <span className='text-white text-sm font-medium'>👋 Welcome back</span>
                      </div>
                      <h2 className='text-3xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg'>
                        {user.users.name}
                      </h2>
                      <p className='text-white/90 text-base md:text-xl max-w-2xl leading-relaxed drop-shadow-md'>
                        Ready to discover your next favorite style? Let's explore what's new for you.
                      </p>
                    </div>
                    <div className='mt-6 md:mt-0'>
                      <div className='inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/25 shadow-lg'>
                        <div className='w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full mr-2 md:mr-3 animate-pulse'></div>
                        <span className='text-white text-xs md:text-sm font-medium'>Active Member</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
                {/* Purchase Count Card */}
                <div className='group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-3'>
                  <div className='absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  <div className='relative p-6 md:p-8'>
                    <div className='flex items-center justify-between mb-6 md:mb-8'>
                      <div className='w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg'>
                        <svg className='w-6 h-6 md:w-7 md:h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                        </svg>
                      </div>
                      <div className='text-right'>
                        <p className='text-slate-700 text-xs md:text-sm font-semibold'>Total Purchases</p>
                        <p className='text-slate-500 text-xs mt-1'>Lifetime orders</p>
                      </div>
                    </div>
                    <div className='space-y-2 md:space-y-3'>
                      <div className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'>
                        {orderCount}
                      </div>
                      <p className='text-slate-700 text-xs md:text-sm font-medium'>Orders completed successfully</p>
                    </div>
                  </div>
                </div>

                {/* Credit Points Card */}
                <div className='group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-3'>
                  <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  <div className='relative p-6 md:p-8'>
                    <CreditPoints />
                  </div>
                </div>
              </div>

              {/* Profile Actions - Mobile Optimized */}
              <div className='bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/60 shadow-xl p-6 md:p-8'>
                <div className='mb-4 md:mb-6'>
                  <h3 className='text-lg md:text-xl font-bold text-slate-800 mb-1 md:mb-2'>Quick Actions</h3>
                  <p className='text-slate-600 text-xs md:text-sm'>Manage your account and preferences</p>
                </div>

                {/* Mobile Grid - 2x2 layout */}
                <div className='grid grid-cols-2 gap-3 md:hidden'>
                  <Link to="/profile" className='group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 p-4 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-md'>
                    <div className='flex flex-col items-center space-y-2 text-center'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                      <span className='text-sm'>Edit Profile</span>
                    </div>
                  </Link>

                  <Link to="/orders" className='group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 p-4 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-md'>
                    <div className='flex flex-col items-center space-y-2 text-center'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <span className='text-sm'>My Orders</span>
                    </div>
                  </Link>

                  <Link to="/wishlist" className='group relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-md'>
                    <div className='flex flex-col items-center space-y-2 text-center'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                      <span className='text-sm'>Wishlist</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => navigate("/collection")}
                    className='group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-red-600 p-4 text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-md'
                  >
                    <div className='flex flex-col items-center space-y-2 text-center'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                      </svg>
                      <span className='text-sm'>Shop Now</span>
                    </div>
                  </button>
                </div>

                {/* Desktop Grid - 4 columns */}
                <div className='hidden md:grid md:grid-cols-4 gap-4'>
                  <Link to="/profile" className='group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 p-5 text-white font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg'>
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                      <span>Edit Profile</span>
                    </div>
                  </Link>

                  <Link to="/orders" className='group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 p-5 text-white font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg'>
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <span>My Orders</span>
                    </div>
                  </Link>

                  <Link to="/wishlist" className='group relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-5 text-white font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg'>
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                      <span>Wishlist</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => navigate("/collection")}
                    className='group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 p-5 text-white font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                      </svg>
                      <span>Shop Now</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className='space-y-6 md:space-y-8'>
                <ProfileListItems />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default memo(Profile);