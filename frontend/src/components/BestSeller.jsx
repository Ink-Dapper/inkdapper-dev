import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItemWrapper'
import { Link } from 'react-router-dom'

const RANK_LABELS = ['#1 Bestseller', '#2 Popular', '#3 Trending', '#4 Loved']

const BestSeller = () => {
  const { products, scrollToTop } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    setBestSeller(products.filter((item) => item.bestseller).slice(0, 4))
  }, [products])

  return (
    <section className="py-8 md:py-14 ragged-section">
      <div className="ragged-divider" />
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-2.5 py-1">
                Trending Now
              </span>
            </div>
            <h2 className="ragged-title text-2xl sm:text-4xl md:text-5xl leading-tight">
              Best Sellers
            </h2>
            <p className="ragged-subtitle text-sm mt-1.5">
              Fan favorites that move fast
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

        <Link
          to="/collection"
          onClick={scrollToTop}
          className="sm:hidden inline-flex w-full justify-center items-center gap-2 ragged-outline-btn font-semibold text-sm px-4 py-2.5 mb-4"
        >
          View All Best Sellers
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-5 mb-5 md:mb-8 sm:overflow-x-auto sm:pb-1 sm:scrollbar-none">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '4.9/5', label: 'Avg. Rating' },
            { value: '50+', label: 'Designs Sold' },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <div className="text-center rounded-xl py-2.5 px-2 bg-[rgba(15,16,18,0.58)] border border-orange-500/20 sm:bg-transparent sm:border-0">
                <div className="text-sm sm:text-base md:text-xl font-extrabold text-orange-300">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-slate-700 mt-0.5 leading-tight">{stat.label}</div>
              </div>
              {i < 2 && <div className="hidden sm:block flex-shrink-0 w-px h-8 bg-slate-700" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {bestSeller.map((item, index) => (
            <div
              key={index}
              className="group relative transition-all duration-300 hover:-translate-y-1.5 mx-auto w-full max-w-[360px] sm:max-w-none"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute -top-2 -left-2 z-20 pointer-events-none">
                <span className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md
                  ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-slate-900 text-slate-200 border border-slate-700'}
                `}>
                  {RANK_LABELS[index] || `#${index + 1}`}
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden transition-shadow duration-300 ring-1 ring-orange-500/20 group-hover:shadow-[0_16px_40px_rgba(249,115,22,0.22)]">
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

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 md:mt-8 pt-5 md:pt-6 border-t border-slate-700/70 gap-3">
          <p className="text-sm text-slate-500 text-center sm:text-left">
            Join <span className="font-semibold text-orange-300">10,000+</span> satisfied customers
          </p>
          <Link
            to="/collection"
            onClick={scrollToTop}
            className="hidden sm:inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-5 py-2.5 transition-all duration-200"
          >
            View All Best Sellers
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
