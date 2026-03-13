import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItemWrapper'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-custom.css'

const LatestCollection = () => {
  const { products, scrollToTop } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])
  const [latestSwiper, setLatestSwiper] = useState(null)

  useEffect(() => {
    setLatestProducts(
      products.slice().sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 8)
    )
  }, [products])

  useEffect(() => {
    if (latestSwiper) {
      const prev = document.querySelector('.latest-swiper-prev')
      const next = document.querySelector('.latest-swiper-next')
      if (prev) prev.style.opacity = latestSwiper.isBeginning ? '0' : '1'
      if (next) next.style.opacity = latestSwiper.isEnd ? '0' : '1'
    }
  }, [latestSwiper])

  const handleSlideChange = (s) => {
    const prev = document.querySelector('.latest-swiper-prev')
    const next = document.querySelector('.latest-swiper-next')
    if (prev) prev.style.opacity = s.isBeginning ? '0' : '1'
    if (next) next.style.opacity = s.isEnd ? '0' : '1'
  }

  return (
    <section className="py-10 md:py-14 ragged-section">
      <div className="ragged-divider" />
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                New Arrivals
              </span>
            </div>
            <h2 className="ragged-title text-3xl sm:text-4xl md:text-5xl leading-tight">
              Latest Updates
            </h2>
            <p className="ragged-subtitle text-sm mt-1">
              Fresh drops stitched with streetwear energy
            </p>
          </div>

          <Link
            to="/collection"
            onClick={scrollToTop}
            className="hidden sm:inline-flex items-center gap-1.5 ragged-outline-btn font-semibold text-sm px-4 py-2 transition-all duration-200 flex-shrink-0"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="md:hidden relative">
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={setLatestSwiper}
            onSlideChange={handleSlideChange}
            spaceBetween={12}
            slidesPerView={1.15}
            centeredSlides={false}
            loop={false}
            navigation={{
              nextEl: '.latest-swiper-next',
              prevEl: '.latest-swiper-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (_, cls) =>
                `<span class="${cls}" style="background:#f97316;width:7px;height:7px"></span>`,
            }}
            breakpoints={{
              320: { slidesPerView: 1.1, spaceBetween: 10 },
              375: { slidesPerView: 1.15, spaceBetween: 12 },
              425: { slidesPerView: 1.2, spaceBetween: 14 },
            }}
            className="latest-mobile-swiper w-full pb-10"
          >
            {latestProducts.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-2xl overflow-hidden shadow-sm w-full ring-1 ring-orange-500/20">
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    beforePrice={item.beforePrice}
                    soldout={item.soldout}
                    subCategory={item.subCategory}
                    slug={item.slug}
                  />
                </div>
              </SwiperSlide>
            ))}

            <div
              className="latest-swiper-prev absolute left-2 z-10 w-9 h-9 bg-slate-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-orange-400/30 cursor-pointer transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-300 active:scale-95"
              style={{ top: '33%', transform: 'translateY(-50%)', opacity: 0 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div
              className="latest-swiper-next absolute right-2 z-10 w-9 h-9 bg-slate-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-orange-400/30 cursor-pointer transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-300 active:scale-95"
              style={{ top: '33%', transform: 'translateY(-50%)', opacity: 1 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </div>

        <div className="sm:hidden text-center mt-4">
          <Link
            to="/collection"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-6 py-2.5 transition-all duration-200"
          >
            View All Products
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-1.5 text-xs text-slate-700">{products.length}+ designs available</p>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {latestProducts.map((item, index) => (
            <div
              key={index}
              className="group transition-all duration-300 hover:-translate-y-1.5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="rounded-2xl overflow-hidden transition-shadow duration-300 ring-1 ring-orange-500/20 group-hover:shadow-[0_16px_40px_rgba(249,115,22,0.24)]">
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  beforePrice={item.beforePrice}
                  soldout={item.soldout}
                  subCategory={item.subCategory}
                  slug={item.slug}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center justify-between mt-10 pt-6 border-t border-slate-700/70">
          <p className="text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-100">{latestProducts.length}</span> of{' '}
            <span className="font-semibold text-orange-300">{products.length}+</span> products
          </p>
          <Link
            to="/collection"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-slate-100 hover:text-orange-200 font-semibold text-sm transition-colors group"
          >
            Explore Full Collection
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestCollection
