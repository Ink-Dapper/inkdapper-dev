import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItemWrapper'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-custom.css'

const HighlightedProducts = () => {
  const { highlightedProducts, fetchHighlightedProducts } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)
  const [highlightSwiper, setHighlightSwiper] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (highlightedProducts.length === 0) {
        try { await fetchHighlightedProducts() } catch (_) { }
      }
      setLoading(false)
    }
    load()
  }, [highlightedProducts.length])

  useEffect(() => {
    if (highlightSwiper) {
      const prev = document.querySelector('.highlight-swiper-prev')
      const next = document.querySelector('.highlight-swiper-next')
      if (prev) prev.style.opacity = highlightSwiper.isBeginning ? '0' : '1'
      if (next) next.style.opacity = highlightSwiper.isEnd ? '0' : '1'
    }
  }, [highlightSwiper])

  const handleSlideChange = (s) => {
    const prev = document.querySelector('.highlight-swiper-prev')
    const next = document.querySelector('.highlight-swiper-next')
    if (prev) prev.style.opacity = s.isBeginning ? '0' : '1'
    if (next) next.style.opacity = s.isEnd ? '0' : '1'
  }

  if (loading) {
    return (
      <section className="py-10 md:py-14 ragged-section">
        <div className="ragged-noise" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div className="space-y-2">
              <div className="h-5 w-28 bg-orange-500/20 rounded-full animate-pulse" />
              <div className="h-8 w-52 bg-slate-700/60 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="md:hidden flex gap-3 overflow-hidden">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[80%] aspect-[3/4] rounded-2xl bg-slate-800 animate-pulse" />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!highlightedProducts || highlightedProducts.length === 0) return null

  return (
    <section className="py-10 md:py-14 overflow-hidden ragged-section relative">
      <div className="ragged-divider" />
      <div className="ragged-noise" />

      {/* Amber glow accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-2.5 py-1">
                <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                Featured
              </span>
            </div>
            <h2 className="ragged-title text-3xl sm:text-4xl md:text-5xl leading-tight">
              Handpicked Favorites
            </h2>
            <p className="ragged-subtitle text-sm mt-1">
              Curated picks our team loves most
            </p>
          </div>
          <Link
            to="/collection"
            className="hidden sm:inline-flex items-center gap-1.5 ragged-outline-btn font-semibold text-sm px-4 py-2 transition-all duration-200 flex-shrink-0"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Mobile swiper ──────────────────────────────────── */}
        <div className="md:hidden relative">
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={setHighlightSwiper}
            onSlideChange={handleSlideChange}
            slidesPerView={1.15}
            spaceBetween={12}
            centeredSlides={false}
            loop={false}
            navigation={{
              nextEl: '.highlight-swiper-next',
              prevEl: '.highlight-swiper-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (_, cls) =>
                `<span class="${cls}" style="background:#f59e0b;width:7px;height:7px"></span>`,
            }}
            breakpoints={{
              320: { slidesPerView: 1.1, spaceBetween: 10 },
              375: { slidesPerView: 1.15, spaceBetween: 12 },
              425: { slidesPerView: 1.2, spaceBetween: 14 },
            }}
            className="highlight-mobile-swiper w-full pb-10"
          >
            {highlightedProducts.map((item, index) => (
              <SwiperSlide key={index} className="!relative">
                <div className="absolute -top-2 -right-2 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Pick
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm w-full ring-1 ring-orange-500/20">
                  <ProductItem
                    id={item.productId._id}
                    image={item.productId.image}
                    name={item.productId.name}
                    price={item.productId.price}
                    beforePrice={item.productId.beforePrice}
                    soldout={Boolean(item.productId.soldout)}
                    subCategory={item.productId.subCategory}
                    slug={item.productId.slug}
                    bestseller={Boolean(item.productId.bestseller)}
                  />
                </div>
              </SwiperSlide>
            ))}

            <div
              className="highlight-swiper-prev absolute left-2 z-10 w-9 h-9 bg-slate-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-orange-400/30 cursor-pointer transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-300 active:scale-95"
              style={{ top: '33%', transform: 'translateY(-50%)', opacity: 0 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div
              className="highlight-swiper-next absolute right-2 z-10 w-9 h-9 bg-slate-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-orange-400/30 cursor-pointer transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-300 active:scale-95"
              style={{ top: '33%', transform: 'translateY(-50%)', opacity: 1 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </div>

        {/* ── Mobile CTA ─────────────────────────────────────── */}
        <div className="sm:hidden text-center mt-4">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-6 py-2.5 transition-all duration-200"
          >
            Explore All Featured
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Desktop grid ───────────────────────────────────── */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {highlightedProducts.map((item, index) => (
            <div
              key={index}
              className="group relative transition-all duration-300 hover:-translate-y-1.5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute -top-2 -right-2 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  Pick
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden transition-shadow duration-300 ring-1 ring-orange-500/20 group-hover:shadow-[0_16px_40px_rgba(249,115,22,0.24)]">
                <ProductItem
                  id={item.productId._id}
                  image={item.productId.image}
                  name={item.productId.name}
                  price={item.productId.price}
                  beforePrice={item.productId.beforePrice}
                  soldout={Boolean(item.productId.soldout)}
                  subCategory={item.productId.subCategory}
                  slug={item.productId.slug}
                  bestseller={Boolean(item.productId.bestseller)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop bottom bar ─────────────────────────────── */}
        <div className="hidden md:flex flex-row items-center justify-between mt-6 md:mt-8 pt-5 md:pt-6 border-t border-slate-700/70 gap-3">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-orange-300">{highlightedProducts.length}</span> handpicked designs
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-5 py-2.5 transition-all duration-200"
          >
            Explore All Featured
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default HighlightedProducts
