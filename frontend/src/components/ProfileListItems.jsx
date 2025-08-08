import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-custom.css'

const ProfileListItems = () => {

  const { backendUrl, token, currency, scrollToTop } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [orderDataOne, setOrderDataOne] = useState([])

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const fetchOrderDetails = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await axios.post(backendUrl + '/api/order/user-details', {}, { headers: { token } })
      if (response.data.success) {
        setOrderData(response.data.orders.reverse().slice(0, 6))
        setOrderDataOne(shuffleArray(response.data.orders).slice(0, 5))
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderDetails()
  }, [token]);


  return (
    <div className='space-y-12'>
      {/* Recent Orders Section */}
      <div className='bg-white/90 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl p-8'>
        <div className='flex items-center space-x-4 mb-8'>
          <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
            </svg>
          </div>
          <div>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'>
              Recent Orders
            </h2>
            <p className='text-slate-600 text-sm mt-1'>Your latest purchases and deliveries</p>
          </div>
        </div>

        {/* Desktop View - Horizontal Scroll */}
        <div className='hidden md:block w-full overflow-x-auto'>
          <div className='flex gap-6 pb-4 min-w-max'>
            {
              orderData.map((item, index) => (
                <Link key={index} to={`/order-details/${item._id}`}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-0 hover:shadow-xl ${index === 0 ? 'w-64 h-80 md:w-80 md:h-96' :
                    index === 1 ? 'w-56 h-72 md:w-72 md:h-88' :
                      index === 2 ? 'w-52 h-68 md:w-64 md:h-80' :
                        index === 3 ? 'w-48 h-64 md:w-56 md:h-72' :
                          index === 4 ? 'w-44 h-60 md:w-48 md:h-64' : 'w-40 h-56 md:w-44 md:h-60'
                    }`}>
                  <div className='relative w-full h-full'>
                    <img
                      src={item.items[0].image[0]}
                      alt=""
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <p className='text-white text-sm font-medium drop-shadow-lg'>View Details</p>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        {/* Mobile View - Swiper Slider */}
        <div className='md:hidden w-full'>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={orderData.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="recent-orders-swiper"
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
              }
            }}
          >
            {orderData.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/order-details/${item._id}`}
                  className='group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl block h-80'>
                  <div className='relative w-full h-full'>
                    <img
                      src={item.items[0].image[0]}
                      alt=""
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <p className='text-white text-sm font-medium drop-shadow-lg'>View Details</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Buy Again Section */}
      <div className='bg-white/90 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl p-8'>
        <div className='flex items-center space-x-4 mb-8'>
          <div className='w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
          </div>
          <div>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent'>
              Buy Again
            </h2>
            <p className='text-slate-600 text-sm mt-1'>Re-order your favorite items</p>
          </div>
        </div>

        {/* Desktop View - Horizontal Scroll */}
        <div className='hidden md:block w-full overflow-x-auto'>
          <div className='flex gap-6 pb-4 min-w-max'>
            {
              orderDataOne.map((item, index) => (
                <Link key={index} to={`/product/${item.items[0]._id}/${item.items[0].slug}`}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-0 hover:shadow-xl ${index === 2 ? 'w-64 h-80 md:w-80 md:h-96' :
                    index === 1 ? 'w-56 h-72 md:w-72 md:h-88' :
                      index === 0 ? 'w-52 h-68 md:w-64 md:h-80' :
                        index === 3 ? 'w-56 h-72 md:w-72 md:h-88' :
                          index === 4 ? 'w-52 h-68 md:w-64 md:h-80' : 'w-48 h-64 md:w-56 md:h-72'
                    }`} onClick={scrollToTop()}>
                  <div className='relative w-full h-full'>
                    <img
                      src={item.items[0].image[0]}
                      alt=""
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <p className='text-white text-sm font-medium drop-shadow-lg'>Buy Again</p>
                    </div>
                  </div>
                </Link>
              )).reverse()
            }
          </div>
        </div>

        {/* Mobile View - Swiper Slider */}
        <div className='md:hidden w-full'>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={orderDataOne.length > 3}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="buy-again-swiper"
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
              }
            }}
          >
            {orderDataOne.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/product/${item.items[0]._id}/${item.items[0].slug}`}
                  className='group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl block h-80'
                  onClick={scrollToTop()}>
                  <div className='relative w-full h-full'>
                    <img
                      src={item.items[0].image[0]}
                      alt=""
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <p className='text-white text-sm font-medium drop-shadow-lg'>Buy Again</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default ProfileListItems