import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItemWrapper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-custom.css'
import { Droplets } from 'lucide-react'

const AcidWashTees = () => {
  const { products } = useContext(ShopContext)
  const [acidWashProducts, setAcidWashProducts] = useState([])
  const [acidSwiper, setAcidSwiper] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const filtered = products
      .filter((p) => p.subCategory === 'Acidwash')
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, 8)
    setAcidWashProducts(filtered)
    setLoading(false)
  }, [products])

  useEffect(() => {
    if (acidSwiper) {
      const prev = document.querySelector('.acid-swiper-prev')
      const next = document.querySelector('.acid-swiper-next')
      if (prev) prev.style.opacity = acidSwiper.isBeginning ? '0' : '1'
      if (next) next.style.opacity = acidSwiper.isEnd ? '0' : '1'
    }
  }, [acidSwiper])

  const handleSlideChange = (s) => {
    const prev = document.querySelector('.acid-swiper-prev')
    const next = document.querySelector('.acid-swiper-next')
    if (prev) prev.style.opacity = s.isBeginning ? '0' : '1'
    if (next) next.style.opacity = s.isEnd ? '0' : '1'
  }

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-52 bg-slate-700 rounded-xl animate-pulse mb-6" />
          <div className="md:hidden flex gap-3 overflow-hidden">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[80%] aspect-[3/4] rounded-2xl bg-slate-800 animate-pulse" />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!acidWashProducts || acidWashProducts.length === 0) {
    return (
      <section className="py-10 md:py-14 ragged-section">
        <div className="ragged-divider" />
        <div className="ragged-noise" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Droplets className="w-10 h-10 text-orange-300 mx-auto mb-4" />
          <h2 className="ragged-title text-4xl mb-3">Acid Wash Tees</h2>
          <p className="ragged-subtitle mb-6">Coming soon - vintage vibes and unique designs.</p>
          <a href="/collection" className="inline-flex items-center gap-2 ragged-solid-btn font-semibold px-5 py-2.5 transition-colors">
            Explore Other Collections
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 md:py-14 overflow-hidden ragged-section">
      <div className="ragged-divider" />
      <div className="ragged-noise" />
      <div className="hidden sm:block absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-2.5 py-1">
                <Droplets className="w-3 h-3" />
                Collection
              </span>
            </div>
            <h2 className="ragged-title text-3xl sm:text-4xl md:text-5xl leading-tight">
              Acid Wash Tees
            </h2>
            <p className="ragged-subtitle text-sm mt-1">
              Vintage vibes with a modern edge
            </p>
          </div>
          <a
            href="/collection?subCategory=Acidwash"
            className="hidden sm:inline-flex items-center gap-1.5 ragged-outline-btn font-semibold text-sm px-4 py-2 transition-all duration-200 flex-shrink-0"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="md:hidden relative">
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={setAcidSwiper}
            onSlideChange={handleSlideChange}
            slidesPerView={1.15}
            spaceBetween={12}
            centeredSlides={false}
            loop={false}
            navigation={{
              nextEl: '.acid-swiper-next',
              prevEl: '.acid-swiper-prev',
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
            className="acid-mobile-swiper w-full pb-10"
          >
            {acidWashProducts.map((item, index) => (
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
                    bestseller={item.bestseller}
                  />
                </div>
              </SwiperSlide>
            ))}

            <div
              className="acid-swiper-prev absolute left-2 z-10 w-9 h-9 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-orange-400/30 cursor-pointer transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-500/50 active:scale-95"
              style={{ top: '33%', transform: 'translateY(-50%)', opacity: 0 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div
              className="acid-swiper-next absolute right-2 z-10 w-9 h-9 bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-orange-400/30 cursor-pointer transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-500/50 active:scale-95"
              style={{ top: '33%', transform: 'translateY(-50%)', opacity: 1 }}
            >
              <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </div>

        <div className="sm:hidden text-center mt-4">
          <a
            href="/collection?subCategory=Acidwash"
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-6 py-2.5 transition-all duration-200"
          >
            Explore All Acid Wash
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {acidWashProducts.map((item, index) => (
            <div
              key={index}
              className="group transition-all duration-300 hover:-translate-y-1.5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="rounded-2xl overflow-hidden transition-shadow duration-300 ring-1 ring-orange-500/20 group-hover:shadow-[0_16px_48px_rgba(249,115,22,0.28)]">
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  beforePrice={item.beforePrice}
                  soldout={item.soldout}
                  subCategory={item.subCategory}
                  slug={item.slug}
                  bestseller={item.bestseller}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center justify-between mt-6 md:mt-8 pt-5 md:pt-6 border-t border-slate-700/60 gap-3">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-orange-300">{acidWashProducts.length}</span> unique acid wash designs
          </p>
          <a
            href="/collection?subCategory=Acidwash"
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-5 py-2.5 transition-all duration-200"
          >
            Explore All Acid Wash
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default AcidWashTees
