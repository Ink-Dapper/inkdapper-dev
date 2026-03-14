import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const RecentlyViewed = () => {
  const { recentlyViewed, scrollToTop } = useContext(ShopContext)
  const [recentProducts, setRecentProducts] = useState([])
  const [recentSwiperInstance, setRecentSwiperInstance] = useState(null)
  const navigate = useNavigate()

  const handleRecentlyViewedClick = () => {
    if (scrollToTop) scrollToTop()
    navigate('/collection')
  }

  useEffect(() => {
    setRecentProducts(recentlyViewed.slice(0, 4))
  }, [recentlyViewed])

  useEffect(() => {
    if (recentSwiperInstance) {
      const prev = document.querySelector('.swiper-button-prev-recent')
      const next = document.querySelector('.swiper-button-next-recent')
      if (prev) prev.style.opacity = recentSwiperInstance.isBeginning ? '0.3' : '1'
      if (next) next.style.opacity = recentSwiperInstance.isEnd ? '0.3' : '1'
    }
  }, [recentSwiperInstance])

  if (recentProducts.length === 0) return null

  return (
    <section className="py-10 md:py-14 ragged-section recently-viewed-section">
      <div className="ragged-divider" />
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-2.5 py-1">
                Your History
              </span>
            </div>
            <h2 className="ragged-title text-3xl sm:text-4xl md:text-5xl leading-tight">
              Recently Viewed
            </h2>
            <p className="ragged-subtitle text-sm mt-1.5">
              Continue where you left off
            </p>
          </div>
          <Link
            to="/collection"
            onClick={scrollToTop}
            className="hidden sm:inline-flex items-center gap-1.5 ragged-outline-btn font-semibold text-sm px-4 py-2 transition-all duration-200 flex-shrink-0"
          >
            Browse More
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="md:hidden relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={false}
            loop={false}
            onSwiper={setRecentSwiperInstance}
            navigation={{
              nextEl: '.swiper-button-next-recent',
              prevEl: '.swiper-button-prev-recent',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (_, cls) => `<span class="${cls}" style="background:#f97316"></span>`,
            }}
            onSlideChange={(s) => {
              const prev = document.querySelector('.swiper-button-prev-recent')
              const next = document.querySelector('.swiper-button-next-recent')
              if (prev) prev.style.opacity = s.isBeginning ? '0.3' : '1'
              if (next) next.style.opacity = s.isEnd ? '0.3' : '1'
            }}
            className="w-full pb-12"
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 14 },
              375: { slidesPerView: 1.3, spaceBetween: 16 },
              425: { slidesPerView: 1.4, spaceBetween: 18 },
            }}
          >
            {recentProducts.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-orange-500/20">
                  <ProductItem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    beforePrice={item.beforePrice}
                    bestseller={item.bestSeller}
                    soldout={item.soldout}
                    slug={item.slug}
                  />
                </div>
              </SwiperSlide>
            ))}

            <div
              className="swiper-button-prev-recent absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-900 rounded-full shadow-md flex items-center justify-center border border-orange-400/30 hover:bg-orange-500/20 transition-all cursor-pointer"
              style={{ opacity: recentSwiperInstance?.isBeginning ? 0.3 : 1 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div
              className="swiper-button-next-recent absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-900 rounded-full shadow-md flex items-center justify-center border border-orange-400/30 hover:bg-orange-500/20 transition-all cursor-pointer"
              style={{ opacity: recentSwiperInstance?.isEnd ? 0.3 : 1 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {recentProducts.map((item, index) => (
            <div
              key={index}
              className="group transition-all duration-300 hover:-translate-y-1.5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="rounded-2xl overflow-hidden transition-shadow duration-300 ring-1 ring-orange-500/20 group-hover:shadow-[0_12px_32px_rgba(249,115,22,0.18)]">
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  beforePrice={item.beforePrice}
                  bestseller={item.bestSeller}
                  soldout={item.soldout}
                  slug={item.slug}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-5 md:mt-7 pt-4 md:pt-5 border-t border-slate-700/70 gap-3">
          <p className="text-sm text-slate-500">
            Showing your <span className="font-semibold text-orange-300">{recentProducts.length}</span> most recent items
          </p>
          <button
            onClick={handleRecentlyViewedClick}
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-5 py-2.5 transition-all duration-200"
          >
            Explore More Products
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewed
