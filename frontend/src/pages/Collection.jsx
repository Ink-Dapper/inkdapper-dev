import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import SearchBar from '../components/SearchBar'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const MAX_RENDERED_PRODUCTS = 60

const pickRandomHeroImages = (pool) => {
  if (!pool.length) return []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  if (shuffled.length >= 3) return shuffled.slice(0, 3)
  return Array.from({ length: 3 }, (_, i) => shuffled[i % shuffled.length])
}

const Collection = () => {

  const { products, search, showSearch, scrollToTop } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState([])
  const [colors, setColors] = useState([])
  const [sortType, SetSortType] = useState('relevant')
  const [sortValue, setSortValue] = useState('');
  const [categoryView, setCategoryView] = useState('block')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(16)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarFixed, setIsSidebarFixed] = useState(false)
  const layoutRef = useRef(null)
  const [heroBannerImages, setHeroBannerImages] = useState([])
  const [bannerImgLoaded, setBannerImgLoaded] = useState([false, false, false])
  const heroImagePool = useMemo(
    () => [...new Set(products.flatMap((item) => (Array.isArray(item.image) ? item.image : [])).filter(Boolean))],
    [products]
  )
  const categoryCounts = useMemo(() => {
    let men = 0
    let women = 0
    for (const product of products) {
      if (product.category === 'Men') men += 1
      if (product.category === 'Women') women += 1
    }
    return {
      all: products.length,
      men,
      women
    }
  }, [products])
  const colorCounts = useMemo(() => {
    const counts = {}
    for (const product of products) {
      if (!Array.isArray(product.colors)) continue
      for (const color of product.colors) {
        counts[color] = (counts[color] || 0) + 1
      }
    }
    return counts
  }, [products])
  const uniqueColors = useMemo(() => Object.keys(colorCounts), [colorCounts])

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (value === '') {
      if (e.target.checked) {
        setCategoryView('hidden')
        const allSubCategories = products.map(item => item.subCategory);
        setSubCategory([...new Set(allSubCategories)]);
      } else {
        setSubCategory([]);
      }
    } else {
      if (subCategory.includes(value)) {
        setSubCategory(subCategory.filter(item => item !== value));
      } else {
        setSubCategory([...subCategory, value]);
      }
    }
    setShowFilter(false);
  }

  const allChecked = (e) => {
    if (e.target.checked) {
      const allSubCategories = products.map(item => item.subCategory);
      setSubCategory([...new Set(allSubCategories)]);
    } else {
      setSubCategory([]);
    }
  }

  const toggleColor = (color) => {
    if (colors.includes(color)) {
      setColors(colors.filter(item => item !== color));
    } else {
      setColors([...colors, color]);
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice()
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    if (colors.length > 0) {
      productsCopy = productsCopy.filter(item =>
        item.colors && item.colors.some(color => colors.includes(color))
      )
    }
    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice()
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)))
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)))
        break;
      default:
        applyFilter()
        break;
    }
  }

  const loadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      const endIndex = Math.min(nextPage * itemsPerPage, MAX_RENDERED_PRODUCTS, filterProducts.length)
      setDisplayedProducts(filterProducts.slice(0, endIndex))
      setCurrentPage(nextPage)
      setHasMore(endIndex < filterProducts.length && endIndex < MAX_RENDERED_PRODUCTS)
      setIsLoading(false)
    }, 500)
  }

  const resetPagination = () => {
    setCurrentPage(1)
    const initialEndIndex = Math.min(itemsPerPage, MAX_RENDERED_PRODUCTS, filterProducts.length)
    setDisplayedProducts(filterProducts.slice(0, initialEndIndex))
    setHasMore(initialEndIndex < filterProducts.length && initialEndIndex < MAX_RENDERED_PRODUCTS)
  }

  useEffect(() => { applyFilter() }, [category, subCategory, colors, search, showSearch, products])
  useEffect(() => { sortProduct() }, [sortType])
  useEffect(() => { resetPagination() }, [filterProducts])
  useEffect(() => {
    if (!heroImagePool.length) return undefined

    setHeroBannerImages(pickRandomHeroImages(heroImagePool))
    setBannerImgLoaded([false, false, false])

    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640
    const isDataSaver = typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData)
    const shouldRotate = !isSmallScreen && !isDataSaver
    if (!shouldRotate) return undefined

    const rotateInterval = setInterval(() => {
      setHeroBannerImages(pickRandomHeroImages(heroImagePool))
      setBannerImgLoaded([false, false, false])
    }, 5000)

    return () => clearInterval(rotateInterval)
  }, [heroImagePool])

  // Scroll-driven sidebar: fix when products section reaches navbar
  useEffect(() => {
    if (window.innerWidth < 1024) return undefined

    const NAVBAR_H = 76
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      window.requestAnimationFrame(() => {
        ticking = false

        if (!layoutRef.current) return
        const { top, bottom } = layoutRef.current.getBoundingClientRect()
        const sidebarH = Math.min(window.innerHeight - NAVBAR_H, layoutRef.current.offsetHeight)
        setIsSidebarFixed(top <= NAVBAR_H && bottom >= NAVBAR_H + sidebarH)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Shared MUI Select dark styles ──────────────────────────────
  const muiSelectDarkSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: 'rgba(249,115,22,0.08)',
      '& fieldset': { border: '1px solid rgba(249,115,22,0.3)' },
      '&:hover fieldset': { border: '1px solid rgba(249,115,22,0.55)' },
      '&.Mui-focused fieldset': { border: '1px solid rgba(249,115,22,0.7)' },
    },
    '& .MuiSelect-select': {
      padding: '7px 12px',
      fontSize: '12px',
      fontWeight: '700',
      color: '#fed7aa',
      letterSpacing: '0.05em',
    },
    '& .MuiSvgIcon-root': { color: '#f97316' },
  }

  const muiMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#111113',
        border: '1px solid rgba(249,115,22,0.25)',
        borderRadius: '10px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  }

  const muiMenuItemSx = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#cbd5e1',
    '&:hover': { backgroundColor: 'rgba(249,115,22,0.12)', color: '#fed7aa' },
    '&.Mui-selected': { backgroundColor: 'rgba(249,115,22,0.18)', color: '#fdba74' },
    '&.Mui-selected:hover': { backgroundColor: 'rgba(249,115,22,0.22)' },
  }

  // ── Reusable sidebar section renderer ──────────────────────────
  const SidebarSection = ({ label, icon, children }) => (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <div className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
            {icon}
          </div>
        )}
        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-400">{label}</h3>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)' }} />
      </div>
      {children}
    </div>
  )

  // ── Sidebar filter contents (shared between desktop + mobile) ──
  const FilterContents = () => {
    const colorMap = {
      'Black': '#000000', 'White': '#FFFFFF', 'Red': '#EF4444',
      'Blue': '#3B82F6', 'Green': '#10B981', 'Yellow': '#F59E0B',
      'Purple': '#8B5CF6', 'Pink': '#EC4899', 'Orange': '#F97316',
      'Gray': '#6B7280', 'Navy': '#1E40AF', 'Brown': '#92400E'
    };

    return (
      <>
        {/* Category */}
        <SidebarSection label="Category" icon={<svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
          <div className="space-y-1">
            {[
              { value: '', label: 'All', count: categoryCounts.all },
              { value: 'Men', label: 'Men', count: categoryCounts.men },
              { value: 'Women', label: 'Women', count: categoryCounts.women },
            ].map((cat) => (
              <label key={cat.value}
                className="flex items-center justify-between cursor-pointer group px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: category === cat.value ? 'rgba(249,115,22,0.15)' : 'transparent',
                  border: `1px solid ${category === cat.value ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                }}
                onMouseEnter={e => { if (category !== cat.value) e.currentTarget.style.background = 'rgba(249,115,22,0.07)' }}
                onMouseLeave={e => { if (category !== cat.value) e.currentTarget.style.background = 'transparent' }}
              >
                <div className="flex items-center gap-2.5">
                  <input type="radio" value={cat.value} name="category" className="sr-only"
                    onChange={(e) => setCategory(e.target.value)} checked={category === cat.value} />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${category === cat.value ? 'border-orange-500 bg-orange-500' : 'border-slate-600'}`}>
                    {category === cat.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-200 ${category === cat.value ? 'text-orange-300' : 'text-slate-300'}`}>{cat.label}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{cat.count}</span>
              </label>
            ))}
          </div>
        </SidebarSection>

        {/* Product Type */}
        <div className={`${categoryView} mb-5`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-400">Product Type</h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)' }} />
          </div>
          <div className="space-y-1">
            {[
              { value: 'Customtshirt', label: 'Custom T-shirt' },
              { value: 'Solidoversized', label: 'Solid Oversized' },
              { value: 'Quotesdesigns', label: 'Quotes Designs' },
              { value: 'Plaintshirt', label: 'Solid T-shirt' },
              { value: 'Acidwash', label: 'Acid Wash' },
            ].map((type) => {
              const active = subCategory.includes(type.value)
              return (
                <label key={type.value}
                  className="flex items-center gap-2.5 cursor-pointer group px-3 py-2.5 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? 'rgba(249,115,22,0.15)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(249,115,22,0.07)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <input type="checkbox" value={type.value} className="sr-only"
                    onChange={toggleSubCategory} checked={active} />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${active ? 'border-orange-500 bg-orange-500' : 'border-slate-600'}`}>
                    {active && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-200 ${active ? 'text-orange-300' : 'text-slate-300'}`}>{type.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Colors */}
        <SidebarSection label="Colors" icon={<svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}>
          {uniqueColors.length > 0 ? (
            <div className="space-y-1">
              {uniqueColors.map((color) => {
                const active = colors.includes(color)
                const hex = colorMap[color] || '#000'
                return (
                  <label key={color}
                    className="flex items-center justify-between cursor-pointer group px-3 py-2 rounded-xl transition-all duration-200"
                    style={{
                      background: active ? 'rgba(249,115,22,0.15)' : 'transparent',
                      border: `1px solid ${active ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(249,115,22,0.07)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" value={color} className="sr-only"
                        onChange={() => toggleColor(color)} checked={active} />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${active ? 'border-orange-500 bg-orange-500' : 'border-slate-600'}`}>
                        {active && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div
                        className="w-5 h-5 rounded-md flex-shrink-0"
                        style={{
                          backgroundColor: hex,
                          border: hex === '#FFFFFF' ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(0,0,0,0.3)',
                          boxShadow: active ? `0 0 8px ${hex}60` : 'none',
                        }}
                      />
                      <span className={`text-sm font-semibold transition-colors duration-200 ${active ? 'text-orange-300' : 'text-slate-300'}`}>{color}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full flex-shrink-0">
                      {colorCounts[color] || 0}
                    </span>
                  </label>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-600 text-center py-4">No color options available</p>
          )}
        </SidebarSection>
      </>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0e' }}>

      {/* ══════════════════════════════════════════════════
          COLLECTION HERO BANNER — ragged dark
      ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden ragged-section">
        <div className="ragged-noise" />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 12% 20%, rgba(249,115,22,0.16), transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(245,158,11,0.12), transparent 42%)'
          }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(transparent 96%, rgba(255,255,255,0.08) 100%), linear-gradient(90deg, transparent 96%, rgba(255,255,255,0.08) 100%)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="md:grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center flex flex-col-reverse md:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-300">Drop Room</span>
              </div>

              <h1 className="ragged-title leading-none mb-3" style={{ fontSize: 'clamp(2.6rem, 6.6vw, 5rem)' }}>
                Build Your
                <br />
                Signature Fit
              </h1>
              <p className="text-slate-300 max-w-lg text-sm md:text-base leading-relaxed mb-6">
                From clean essentials to statement prints, explore a different side of streetwear crafted for your daily rotation.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="ragged-pill text-[11px] font-semibold px-3 py-1.5">{filterProducts.length} Products Live</span>
                <span className="ragged-pill text-[11px] font-semibold px-3 py-1.5">New Drops Weekly</span>
                <span className="ragged-pill text-[11px] font-semibold px-3 py-1.5">Premium Fabric</span>
              </div>
            </div>

            <div className="relative w-full md:w-auto">
              <div className="absolute -inset-2 rounded-2xl blur-2xl opacity-30"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.4), rgba(245,158,11,0.22))' }} />
              <div className="relative grid grid-cols-2 gap-3 p-3 rounded-2xl"
                style={{ background: 'rgba(15,16,18,0.7)', border: '1px solid rgba(249,115,22,0.22)' }}>
                {/* Main banner image */}
                <div className="col-span-2 rounded-xl overflow-hidden h-40 sm:h-48 border border-orange-500/20 relative">
                  {!bannerImgLoaded[0] && (
                    <div className="absolute inset-0 banner-skeleton rounded-xl" />
                  )}
                  <img
                    src={heroBannerImages[0] || ''}
                    alt="Collection featured product"
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                    style={{ opacity: bannerImgLoaded[0] ? 0.9 : 0 }}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    onLoad={() => setBannerImgLoaded(prev => { const n = [...prev]; n[0] = true; return n })}
                  />
                </div>
                {/* Secondary image left */}
                <div className="rounded-xl overflow-hidden h-32 sm:h-36 border border-orange-500/20 relative">
                  {!bannerImgLoaded[1] && (
                    <div className="absolute inset-0 banner-skeleton rounded-xl" />
                  )}
                  <img
                    src={heroBannerImages[1] || heroBannerImages[0] || ''}
                    alt="Streetwear product preview one"
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                    style={{ opacity: bannerImgLoaded[1] ? 0.9 : 0 }}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setBannerImgLoaded(prev => { const n = [...prev]; n[1] = true; return n })}
                  />
                </div>
                {/* Secondary image right */}
                <div className="rounded-xl overflow-hidden h-32 sm:h-36 border border-orange-500/20 relative">
                  {!bannerImgLoaded[2] && (
                    <div className="absolute inset-0 banner-skeleton rounded-xl" />
                  )}
                  <img
                    src={heroBannerImages[2] || heroBannerImages[0] || ''}
                    alt="Streetwear product preview two"
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                    style={{ opacity: bannerImgLoaded[2] ? 0.9 : 0 }}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setBannerImgLoaded(prev => { const n = [...prev]; n[2] = true; return n })}
                  />
                </div>
                <div className="absolute top-5 right-5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] rounded-full"
                  style={{ background: 'rgba(13,13,14,0.75)', border: '1px solid rgba(249,115,22,0.3)', color: '#fdba74' }}>
                  Collection 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-5 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(249,115,22,0.22), rgba(245,158,11,0.15), rgba(249,115,22,0.22))',
            clipPath: 'polygon(0 52%, 3% 38%, 7% 55%, 12% 37%, 17% 54%, 22% 38%, 28% 56%, 34% 39%, 40% 55%, 46% 37%, 52% 55%, 58% 38%, 64% 54%, 70% 36%, 76% 55%, 82% 37%, 88% 54%, 93% 39%, 97% 55%, 100% 40%, 100% 100%, 0 100%)',
          }}
        />
      </div>

      <SearchBar />

      {/* ══════════════════════════════════════════════════════
          MAIN LAYOUT — flex row, sticky sidebar + products
      ══════════════════════════════════════════════════════ */}
      <div ref={layoutRef} className="flex items-start gap-5 lg:gap-6 px-4 sm:px-6 lg:px-6 py-4 lg:py-6">

        {/* ── DESKTOP SIDEBAR — spacer holds layout, aside is conditionally fixed ── */}
        <div className="hidden lg:block flex-shrink-0 w-64">
          <aside
            className="flex flex-col w-64 max-h-[calc(100vh-76px)] overflow-hidden rounded-2xl"
            style={{
              position: isSidebarFixed ? 'fixed' : 'relative',
              top: isSidebarFixed ? '35px' : 'auto',
              background: 'linear-gradient(180deg, #0a0a0b 0%, #0d0d0e 100%)',
              border: '1px solid rgba(249,115,22,0.2)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.06) inset',
            }}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.45), transparent)' }} />
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-5 pb-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(245,158,11,0.2))', border: '1px solid rgba(249,115,22,0.35)' }}>
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="ragged-title text-2xl leading-none">Filters</h2>
                    <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mt-0.5">Refine Results</p>
                  </div>
                </div>
                {(category || subCategory.length > 0 || colors.length > 0) && (
                  <button
                    onClick={() => { setCategory(''); setSubCategory([]); setColors([]) }}
                    className="text-[10px] font-extrabold text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-colors px-2.5 py-1 rounded-lg border border-orange-500/30 hover:border-orange-500/50"
                    style={{ background: 'rgba(249,115,22,0.08)' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Active filter pill */}
              {(category || subCategory.length > 0 || colors.length > 0) && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-bold text-orange-300">
                    {[category ? 1 : 0, subCategory.length, colors.length].reduce((a, b) => a + b, 0)} filter{[category ? 1 : 0, subCategory.length, colors.length].reduce((a, b) => a + b, 0) > 1 ? 's' : ''} active
                  </span>
                  <span className="ml-auto text-[10px] text-slate-500">{filterProducts.length} results</span>
                </div>
              )}

              <div className="mt-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.45), rgba(249,115,22,0.1), transparent)' }} />
            </div>

            {/* Scrollable filters */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-4">
              <FilterContents />
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 py-3" style={{ borderTop: '1px solid rgba(249,115,22,0.08)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40" />
                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest">Ink Dapper</span>
              </div>
            </div>
          </aside>
        </div>

        {/* ── CONTENT: mobile filter bar + products ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter bar */}
          <div className="lg:hidden mb-4">
            <div className="p-2 rounded-2xl border border-orange-500/25"
              style={{ background: 'rgba(13,13,14,0.95)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="flex-1 ragged-solid-btn px-4 py-3 font-bold flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  {showMobileFilter ? 'Hide' : 'Filters'}
                  {(category || subCategory.length > 0 || colors.length > 0) && (
                    <span className="bg-white/25 rounded-full w-5 h-5 text-xs font-extrabold flex items-center justify-center">
                      {[category ? 1 : 0, subCategory.length, colors.length].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>
                <div className="flex-shrink-0 flex items-center gap-2 px-2 py-1 rounded-xl border border-orange-500/25"
                  style={{ background: 'rgba(249,115,22,0.07)' }}>
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M9 12h6M11 16h2" />
                  </svg>
                  <FormControl sx={{ minWidth: 100 }} size="small">
                    <Select value={sortType} onChange={(e) => SetSortType(e.target.value)}
                      sx={{ ...muiSelectDarkSx, '& .MuiSelect-select': { padding: '5px 8px', fontSize: '11px', fontWeight: '700', color: '#fed7aa' } }}
                      MenuProps={muiMenuProps}>
                      <MenuItem value="relevant" sx={muiMenuItemSx}>Relevant</MenuItem>
                      <MenuItem value="low-high" sx={muiMenuItemSx}>Low → High</MenuItem>
                      <MenuItem value="high-low" sx={muiMenuItemSx}>High → Low</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile filter bottom sheet */}
          {showMobileFilter && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />

              {/* Sheet: flex column so header + button stay fixed, content scrolls */}
              <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl flex flex-col"
                style={{
                  maxHeight: '82vh',
                  background: '#0f0f11',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderBottom: 'none',
                }}>

                {/* ── Fixed header ── */}
                <div className="flex-shrink-0 px-4 pt-4 pb-0">
                  {/* Drag pill */}
                  <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(249,115,22,0.3)' }} />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                      </div>
                      <h2 className="ragged-title text-2xl">Filters</h2>
                      {(category || subCategory.length > 0 || colors.length > 0) && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(249,115,22,0.18)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.35)' }}>
                          {[category ? 1 : 0, subCategory.length, colors.length].reduce((a, b) => a + b, 0)} active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {(category || subCategory.length > 0 || colors.length > 0) && (
                        <button
                          onClick={() => { setCategory(''); setSubCategory([]); setColors([]) }}
                          className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-lg"
                          style={{ color: '#fb923c', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}>
                          Clear
                        </button>
                      )}
                      <button onClick={() => setShowMobileFilter(false)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-orange-300 border border-orange-500/40"
                        style={{ background: 'rgba(249,115,22,0.12)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.5), transparent)' }} />
                </div>

                {/* ── Scrollable filter content ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
                  <FilterContents />
                </div>

                {/* ── Fixed Apply button ── */}
                <div className="flex-shrink-0 px-4 pt-3 pb-5"
                  style={{
                    borderTop: '1px solid rgba(249,115,22,0.15)',
                    background: 'linear-gradient(to top, #0f0f11 80%, rgba(15,15,17,0))',
                    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                  }}>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="w-full ragged-solid-btn py-4 font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Apply Filters
                    {filterProducts.length > 0 && (
                      <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-extrabold">
                        {filterProducts.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products header */}
          <div className="rounded-2xl p-4 lg:p-5 mb-5 lg:mb-6"
            style={{
              background: 'rgba(13,13,14,0.97)',
              border: '1px solid rgba(249,115,22,0.2)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="ragged-title text-3xl md:text-4xl leading-none mb-1">All Collections</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Showing <span className="font-bold text-orange-400">{displayedProducts.length}</span> of{' '}
                  <span className="font-bold text-slate-300">{filterProducts.length}</span> products
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest hidden sm:block">Sort by</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-orange-500/25"
                  style={{ background: 'rgba(249,115,22,0.07)' }}>
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M9 12h6M11 16h2" />
                  </svg>
                  <FormControl sx={{ minWidth: 150 }} size="small">
                    <Select value={sortType} onChange={(e) => SetSortType(e.target.value)}
                      sx={muiSelectDarkSx} MenuProps={muiMenuProps}>
                      <MenuItem value="relevant" sx={muiMenuItemSx}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Most Relevant
                        </div>
                      </MenuItem>
                      <MenuItem value="low-high" sx={muiMenuItemSx}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                          Price: Low to High
                        </div>
                      </MenuItem>
                      <MenuItem value="high-low" sx={muiMenuItemSx}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8V4m0 0l4 4m-4-4l-4 4m-6 0v12m0 0l-4-4m4 4l4-4" />
                          </svg>
                          Price: High to Low
                        </div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {displayedProducts.map((item, index) => (
              <div
                key={index}
                className="group transition-all duration-300 hover:-translate-y-1.5"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    border: '1px solid rgba(249,115,22,0.12)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1px solid rgba(249,115,22,0.35)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(249,115,22,0.18)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid rgba(249,115,22,0.12)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
                  }}
                >
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    beforePrice={item.beforePrice}
                    subCategory={item.subCategory}
                    soldout={item.soldout}
                    slug={item.slug}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasMore && displayedProducts.length > 0 && (
            <div className="flex justify-center mt-10 lg:mt-14">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="ragged-solid-btn px-10 py-4 font-extrabold uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                    <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-extrabold text-slate-600">
                      {filterProducts.length - displayedProducts.length}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty state */}
          {displayedProducts.length === 0 && (
            <div className="text-center py-16 lg:py-24">
              <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <svg className="w-10 h-10 text-orange-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="ragged-title text-3xl lg:text-4xl mb-3">No Products Found</h3>
              <p className="ragged-subtitle text-sm mb-7 max-w-xs mx-auto">
                Try adjusting your filters to discover amazing products
              </p>
              <button
                onClick={() => { setCategory(''); setSubCategory([]); setColors([]) }}
                className="ragged-solid-btn px-8 py-3.5 font-extrabold text-sm uppercase tracking-widest"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection







