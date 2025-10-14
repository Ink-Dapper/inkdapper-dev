import React, { useContext, useEffect, useState, useMemo, useCallback, memo, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets, teesCollection } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import SearchBar from '../components/SearchBar'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// ProductItem is already memoized in its own component

const Collection = () => {
  const { products, search, showSearch, scrollToTop } = useContext(ShopContext)

  // State management with performance optimizations
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState('')

  // Handle category change with pagination reset
  const handleCategoryChange = useCallback((value) => {
    setCategory(value);
    setShowAllProducts(false);
  }, [])
  const [subCategory, setSubCategory] = useState([])
  const [colors, setColors] = useState([])
  const [sortType, SetSortType] = useState('relevant')
  const [sortValue, setSortValue] = useState('')
  const [categoryView, setCategoryView] = useState('block')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12) // Reduced for better mobile performance
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isIntersecting, setIsIntersecting] = useState(false)
  const loadMoreRef = useRef(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || '');
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load more function - defined early to avoid reference errors
  const loadMore = useCallback(() => {
    setIsLoading(true)

    // Reduced loading delay for better mobile experience
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = 0
      const endIndex = nextPage * itemsPerPage
      const newProducts = filterProducts.slice(startIndex, endIndex)

      setDisplayedProducts(newProducts)
      setCurrentPage(nextPage)
      setHasMore(endIndex < filterProducts.length)
      setIsLoading(false)
    }, 200) // Reduced from 500ms to 200ms
  }, [currentPage, itemsPerPage, filterProducts])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  const toggleSubCategory = useCallback((e) => {
    const value = e.target.value;

    if (value === '') { // If the "All" checkbox is checked/unchecked
      if (e.target.checked) {
        // If "All" is checked, add all unique subcategories
        setCategoryView('hidden')
        const allSubCategories = products.map(item => item.subCategory);
        setSubCategory([...new Set(allSubCategories)]);
      } else {
        // If "All" is unchecked, clear subcategories
        setSubCategory([]);
      }
    } else {
      // Handle individual subcategory checkboxes
      setSubCategory(prev => {
        if (prev.includes(value)) {
          return prev.filter(item => item !== value);
        } else {
          return [...prev, value];
        }
      });
    }

    // Reset to pagination when filters change
    setShowAllProducts(false);
    // Hide the filter section after selecting a subcategory
    setShowFilter(false);
  }, [subCategory, products])

  const allChecked = useCallback((e) => {
  const allChecked = useCallback((e) => {
    if (e.target.checked) {
      const allSubCategories = products.map(item => item.subCategory);
      setSubCategory([...new Set(allSubCategories)]);
    } else {
      setSubCategory([]);
    }
  }, [products])

  const toggleColor = useCallback((color) => {
    if (colors.includes(color)) {
      setColors(colors.filter(item => item !== color));
    } else {
      setColors([...colors, color]);
    }
  }, [colors])

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    let productsCopy = products.slice()

    if (showSearch && debouncedSearch) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
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
    return productsCopy
  }, [products, showSearch, debouncedSearch, category, subCategory, colors])

  const applyFilter = useCallback(() => {
    setFilterProducts(filteredProducts)
  }, [filteredProducts])

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts]

    switch (sortType) {
      case 'low-high':
        return sorted.sort((a, b) => (a.price - b.price))
      case 'high-low':
        return sorted.sort((a, b) => (b.price - a.price))
      default:
        return sorted
    }
  }, [filteredProducts, sortType])

  const sortProduct = useCallback(() => {
    setFilterProducts(sortedProducts)
  }, [sortedProducts])

  const resetPagination = useCallback(() => {
    setCurrentPage(1)
    setDisplayedProducts(filterProducts.slice(0, itemsPerPage))
    setHasMore(filterProducts.length > itemsPerPage)
  }, [filterProducts, itemsPerPage])

  useEffect(() => {
    applyFilter()
  }, [applyFilter])

  useEffect(() => {
    sortProduct()
  }, [sortProduct])

  // Cleanup effect
  useEffect(() => {
    resetPagination()
  }, [resetPagination])

  return (
    <div className='min-h-screen'>
      {/* Mobile-Optimized Product-Focused Banner Section - Hidden on Mobile */}
      <div className='relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 via-purple-600 to-teal-500 w-full hidden lg:block'>
        {/* Product Image Background Overlay */}
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='absolute inset-0'>
          {/* Left Side Product Images - Hidden on Mobile */}
          <div className='absolute left-0 top-0 w-1/3 h-full hidden lg:block'>
            <div className='relative h-full'>
              {/* Product Image 1 - Black T-shirt */}
              <div className='absolute top-10 left-8 w-32 h-40 bg-white/20 rounded-2xl backdrop-blur-sm transform -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-110 border border-white/30 overflow-hidden shadow-lg'>
                <img
                  src={teesCollection[0].image[0]}
                  alt="Black T-shirt"
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
              </div>

              {/* Product Image 2 - Navy Blue T-shirt */}
              <div className='absolute top-32 left-16 w-28 h-36 bg-white/20 rounded-2xl backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-110 border border-white/30 overflow-hidden shadow-lg'>
                <img
                  src={teesCollection[6].image[0]}
                  alt="Navy Blue T-shirt"
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
              </div>

              {/* Product Image 3 - Red T-shirt */}
              <div className='absolute bottom-20 left-4 w-36 h-44 bg-white/20 rounded-2xl backdrop-blur-sm transform -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110 border border-white/30 overflow-hidden shadow-lg'>
                <img
                  src={teesCollection[7].image[0]}
                  alt="Red T-shirt"
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
              </div>
            </div>
          </div>

          {/* Right Side Product Images - Hidden on Mobile */}
          <div className='absolute right-0 top-0 w-1/3 h-full hidden lg:block'>
            <div className='relative h-full'>
              {/* Product Image 1 - White T-shirt */}
              <div className='absolute top-8 right-8 w-40 h-48 bg-white/20 rounded-2xl backdrop-blur-sm transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-110 border border-white/30 overflow-hidden shadow-lg'>
                <img
                  src={teesCollection[9].image[0]}
                  alt="White T-shirt"
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
              </div>

              {/* Product Image 2 - Green T-shirt */}
              <div className='absolute top-40 right-16 w-32 h-40 bg-white/20 rounded-2xl backdrop-blur-sm transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-110 border border-white/30 overflow-hidden shadow-lg'>
                <img
                  src={teesCollection[4].image[0]}
                  alt="Green T-shirt"
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
              </div>

              {/* Product Image 3 - Lavender T-shirt */}
              <div className='absolute bottom-16 right-4 w-36 h-44 bg-white/20 rounded-2xl backdrop-blur-sm transform rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110 border border-white/30 overflow-hidden shadow-lg'>
                <img
                  src={teesCollection[5].image[0]}
                  alt="Lavender T-shirt"
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
              </div>
            </div>
          </div>

          {/* Mobile Product Showcase - Visible only on Mobile */}
          <div className='lg:hidden absolute inset-0 flex items-center justify-center'>
            <div className='relative w-full max-w-sm'>
              {/* Mobile Product Grid */}
              <div className='grid grid-cols-2 gap-4 p-6'>
                {/* Product 1 */}
                <div className='bg-white/25 backdrop-blur-md rounded-2xl transform -rotate-6 hover:rotate-0 transition-all duration-700 hover:scale-125 border border-white/40 overflow-hidden shadow-2xl hover:shadow-white/20'>
                  <img
                    src={teesCollection[0].image[0]}
                    alt="Black T-shirt"
                    className='w-full h-24 object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
                  <div className='absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20'></div>
                </div>
                {/* Product 2 */}
                <div className='bg-white/25 backdrop-blur-md rounded-2xl transform rotate-6 hover:rotate-0 transition-all duration-700 hover:scale-125 border border-white/40 overflow-hidden shadow-2xl hover:shadow-white/20'>
                  <img
                    src={teesCollection[9].image[0]}
                    alt="White T-shirt"
                    className='w-full h-24 object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
                  <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-teal-500/20'></div>
                </div>
                {/* Product 3 */}
                <div className='bg-white/25 backdrop-blur-md rounded-2xl transform -rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-125 border border-white/40 overflow-hidden shadow-2xl hover:shadow-white/20'>
                  <img
                    src={teesCollection[4].image[0]}
                    alt="Green T-shirt"
                    className='w-full h-24 object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
                  <div className='absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20'></div>
                </div>
                {/* Product 4 */}
                <div className='bg-white/25 backdrop-blur-md rounded-2xl transform rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-125 border border-white/40 overflow-hidden shadow-2xl hover:shadow-white/20'>
                  <img
                    src={teesCollection[7].image[0]}
                    alt="Red T-shirt"
                    className='w-full h-24 object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
                  <div className='absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20'></div>
                </div>
              </div>

              {/* Enhanced Floating Elements for Mobile */}
              <div className='absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-300/40 to-orange-400/40 rounded-full blur-xl animate-pulse'></div>
              <div className='absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-pink-300/40 to-purple-400/40 rounded-full blur-lg animate-pulse delay-1000'></div>
              <div className='absolute -bottom-4 -left-2 w-14 h-14 bg-gradient-to-br from-teal-300/40 to-cyan-400/40 rounded-full blur-xl animate-pulse delay-500'></div>
              <div className='absolute -bottom-2 -right-4 w-10 h-10 bg-gradient-to-br from-purple-300/40 to-pink-400/40 rounded-full blur-lg animate-pulse delay-1500'></div>
            </div>
          </div>

          {/* Floating Product Elements - Reduced on Mobile */}
          <div className='absolute top-10 left-1/3 w-12 h-12 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-xl lg:blur-2xl animate-pulse'></div>
          <div className='absolute top-20 right-1/3 w-16 h-16 lg:w-36 lg:h-36 bg-gradient-to-br from-pink-300/30 to-purple-400/30 rounded-full blur-xl lg:blur-2xl animate-pulse delay-1000'></div>
          <div className='absolute bottom-10 left-1/2 w-10 h-10 lg:w-20 lg:h-20 bg-gradient-to-br from-teal-300/30 to-cyan-400/30 rounded-full blur-lg lg:blur-2xl animate-pulse delay-500'></div>
          <div className='absolute top-1/2 left-2/3 w-8 h-8 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-lg lg:blur-xl animate-pulse delay-1500'></div>
        </div>

        <div className='relative z-10 py-16 lg:py-20 px-4 text-center w-full min-h-[60vh] lg:min-h-auto'>
          <div className='max-w-4xl mx-auto'>
            {/* Mobile-Optimized Main Heading - Hidden on Mobile */}
            <div className='mb-4 lg:mb-8 hidden lg:block'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-black text-white mb-3 lg:mb-6 leading-tight'>
                Discover
                <span className='block bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent'>
                  Amazing Styles
                </span>
              </h1>
              <p className='text-sm sm:text-base md:text-lg lg:text-2xl text-white/95 mb-4 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-2'>
                Explore our curated collection of trendy t-shirts and custom designs
              </p>
            </div>

            {/* Mobile-Optimized Product Stats and Features - Hidden on Mobile */}
            <div className='flex flex-wrap justify-center gap-2 lg:gap-4 mb-4 lg:mb-8 hidden lg:flex'>
              <div className='bg-white/25 backdrop-blur-md rounded-full px-3 lg:px-8 py-1.5 lg:py-3 text-white font-semibold border border-white/40 shadow-lg hover:bg-white/35 transition-all duration-300 text-xs lg:text-base'>
                <div className='flex items-center gap-1.5 lg:gap-2'>
                  <div className='w-1 h-1 lg:w-2 lg:h-2 bg-green-400 rounded-full animate-pulse'></div>
                  {filterProducts.length} Products
                </div>
              </div>
              <div className='bg-gradient-to-r from-yellow-400/80 to-orange-400/80 backdrop-blur-md rounded-full px-3 lg:px-8 py-1.5 lg:py-3 text-white font-semibold border border-yellow-300/50 shadow-lg hover:from-yellow-500/90 hover:to-orange-500/90 transition-all duration-300 text-xs lg:text-base'>
                <div className='flex items-center gap-1.5 lg:gap-2'>
                  <svg className="w-2.5 h-2.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Free Shipping
                </div>
              </div>
              <div className='bg-gradient-to-r from-pink-400/80 to-purple-400/80 backdrop-blur-md rounded-full px-3 lg:px-8 py-1.5 lg:py-3 text-white font-semibold border border-pink-300/50 shadow-lg hover:from-pink-500/90 hover:to-purple-500/90 transition-all duration-300 text-xs lg:text-base'>
                <div className='flex items-center gap-1.5 lg:gap-2'>
                  <svg className="w-2.5 h-2.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Premium Quality
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Product Categories Preview - Hidden on Mobile */}
            <div className='flex flex-wrap justify-center gap-1.5 lg:gap-3 hidden lg:flex'>
              {['Custom', 'Solid', 'Quotes', 'Acid Wash'].map((category, index) => (
                <div key={index} className='bg-white/15 backdrop-blur-sm rounded-full px-2 lg:px-6 py-1 lg:py-2 text-white/90 text-xs lg:text-sm font-medium border border-white/20 hover:bg-white/25 transition-all duration-300 cursor-pointer'>
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave Effect - Hidden on Mobile */}
        <div className='absolute bottom-0 left-0 w-full hidden lg:block'>
          <svg className='w-full h-16 text-white/10' viewBox='0 0 1200 120' preserveAspectRatio='none'>
            <path d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='currentColor'></path>
            <path d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='currentColor'></path>
            <path d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='currentColor'></path>
          </svg>
        </div>
      </div>

      <SearchBar />
      <div className=''>
        <div className='max-w-8xl mx-auto px-4 lg:px-0 py-0 pb-1 lg:py-6 flex flex-col md:flex-row md:gap-4 lg:gap-6'>
          {/* Simplified Mobile Filter and Sort Row */}
          <div className="lg:hidden mb-6 p-3 shadow-lg rounded-xl border border-gray-200 absolute w-[95%] left-1/2 -translate-x-1/2 mx-auto bg-white z-50">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="flex-1 bg-orange-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                {showMobileFilter ? 'Hide' : 'Filters'}
              </button>

              {/* Simplified Mobile Sort Section */}
              <div className="bg-gray-50 rounded-lg p-2 flex-shrink-0">
                <FormControl sx={{ minWidth: 90 }} size="small">
                  <Select
                    value={sortType}
                    onChange={(e) => SetSortType(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: 'none' },
                      },
                      '& .MuiSelect-select': {
                        padding: '4px 6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#374151',
                      },
                    }}
                  >
                    <MenuItem value="relevant" sx={{ fontSize: '11px', fontWeight: '500' }}>
                      Relevant
                    </MenuItem>
                    <MenuItem value="low-high" sx={{ fontSize: '11px', fontWeight: '500' }}>
                      Low-High
                    </MenuItem>
                    <MenuItem value="high-low" sx={{ fontSize: '11px', fontWeight: '500' }}>
                      High-Low
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Colorful Filter Sidebar - Hidden on Mobile by Default */}
          <div className={`lg:w-64 flex-shrink-0 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 p-4 lg:p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-thumb-orange-300 lg:scrollbar-track-orange-100 lg:scrollbar-thumb-rounded-full">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-2 lg:gap-3">
                  <div className="w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                  </div>
                  Filters
                </h2>
                {/* Mobile Close Button */}
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="lg:hidden w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4 lg:mb-6">
                <h3 className="text-sm lg:text-base font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                  Categories
                </h3>
                <div className="space-y-2 lg:space-y-3">
                  {[
                    { value: '', label: 'All Categories', count: products.length, color: 'from-gray-500 to-gray-600' },
                    { value: 'Men', label: 'Men', count: products.filter(p => p.category === 'Men').length, color: 'from-blue-500 to-indigo-600' },
                    { value: 'Women', label: 'Women', count: products.filter(p => p.category === 'Women').length, color: 'from-pink-500 to-rose-600' }
                  ].map((cat) => (
                    <label key={cat.value} className="flex items-center justify-between cursor-pointer group p-2.5 lg:p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-orange-200">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <input
                          type="radio"
                          id={`category-${cat.value}`}
                          value={cat.value}
                          name="category"
                          className="sr-only"
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          checked={category === cat.value}
                        />
                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${category === cat.value
                          ? `border-transparent bg-gradient-to-r ${cat.color}`
                          : 'border-gray-300 group-hover:border-orange-400'
                          }`}>
                          {category === cat.value && <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className={`font-semibold text-xs lg:text-sm transition-colors duration-300 ${category === cat.value ? 'text-orange-600' : 'text-gray-700'
                          }`}>{cat.label}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 px-1.5 lg:px-2 py-0.5 rounded-full font-medium">
                        {cat.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className={`${categoryView} mb-4`}>
                <h3 className="text-sm lg:text-base font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"></div>
                  Product Type
                </h3>
                <div className="space-y-2 lg:space-y-3">
                  {[
                    {
                      value: 'Customtshirt',
                      label: 'Custom T-shirt',
                      color: 'from-purple-500 to-pink-600'
                    },
                    {
                      value: 'Solidoversized',
                      label: 'Solid Oversized',
                      color: 'from-blue-500 to-indigo-600'
                    },
                    {
                      value: 'Quotesdesigns',
                      label: 'Quotes Designs',
                      color: 'from-green-500 to-teal-600'
                    },
                    {
                      value: 'Plaintshirt',
                      label: 'Solid T-shirt',
                      color: 'from-gray-500 to-slate-600'
                    },
                    {
                      value: 'Acidwash',
                      label: 'Acid Wash',
                      color: 'from-orange-500 to-red-600'
                    }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center justify-between cursor-pointer group p-2.5 lg:p-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 border border-transparent hover:border-teal-200">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <input
                          type="checkbox"
                          value={type.value}
                          className="sr-only"
                          onChange={toggleSubCategory}
                          checked={subCategory.includes(type.value)}
                        />
                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${subCategory.includes(type.value)
                          ? `border-transparent bg-gradient-to-r ${type.color}`
                          : 'border-gray-300 group-hover:border-teal-400'
                          }`}>
                          {subCategory.includes(type.value) && (
                            <svg className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-semibold text-xs lg:text-sm transition-colors duration-300 ${subCategory.includes(type.value) ? 'text-teal-600' : 'text-gray-700'
                          }`}>{type.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-4 lg:mb-6">
                <h3 className="text-sm lg:text-base font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                  Colors
                </h3>
                <div className="space-y-2 lg:space-y-3">
                  {(() => {
                    // Get unique colors from all products
                    const allColors = products.reduce((acc, product) => {
                      if (product.colors && Array.isArray(product.colors)) {
                        return [...acc, ...product.colors];
                      }
                      return acc;
                    }, []);
                    const uniqueColors = [...new Set(allColors)];

                    const colorMap = {
                      'Black': '#000000',
                      'White': '#FFFFFF',
                      'Red': '#EF4444',
                      'Blue': '#3B82F6',
                      'Green': '#10B981',
                      'Yellow': '#F59E0B',
                      'Purple': '#8B5CF6',
                      'Pink': '#EC4899',
                      'Orange': '#F97316',
                      'Gray': '#6B7280',
                      'Navy': '#1E40AF',
                      'Brown': '#92400E'
                    };

                    return uniqueColors.length > 0 ? uniqueColors.map((color) => (
                      <label key={color} className="flex items-center justify-between cursor-pointer group p-2.5 lg:p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-pink-200">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <input
                            type="checkbox"
                            value={color}
                            className="sr-only"
                            onChange={() => toggleColor(color)}
                            checked={colors.includes(color)}
                          />
                          <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${colors.includes(color)
                            ? 'border-transparent bg-gradient-to-r from-pink-500 to-purple-600'
                            : 'border-gray-300 group-hover:border-pink-400'
                            }`}>
                            {colors.includes(color) && (
                              <svg className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div
                              className="w-6 h-6 lg:w-8 lg:h-8 rounded-md border border-gray-200"
                              style={{ backgroundColor: colorMap[color] || '#000000' }}
                            >
                              {colorMap[color] === '#FFFFFF' && (
                                <div className="w-full h-full border border-gray-300 rounded-md"></div>
                              )}
                            </div>
                            <span className={`font-semibold text-xs lg:text-sm transition-colors duration-300 ${colors.includes(color) ? 'text-pink-600' : 'text-gray-700'
                              }`}>{color}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 px-1.5 lg:px-2 py-0.5 rounded-full font-medium">
                          {products.filter(p => p.colors && p.colors.includes(color)).length}
                        </span>
                      </label>
                    )) : (
                      <p className="text-xs text-gray-500 text-center py-4">No color options available</p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {showMobileFilter && (
            <div className="lg:hidden fixed inset-0 z-50">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMobileFilter(false)}
              ></div>

              {/* Filter Panel */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border border-white/60 transform transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                      </div>
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'All Categories', count: products.length, color: 'from-gray-500 to-gray-600' },
                        { value: 'Men', label: 'Men', count: products.filter(p => p.category === 'Men').length, color: 'from-blue-500 to-indigo-600' },
                        { value: 'Women', label: 'Women', count: products.filter(p => p.category === 'Women').length, color: 'from-pink-500 to-rose-600' }
                      ].map((cat) => (
                        <label key={cat.value} className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-orange-200">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              id={`category-mobile-${cat.value}`}
                              value={cat.value}
                              name="category"
                              className="sr-only"
                              onChange={(e) => handleCategoryChange(e.target.value)}
                              checked={category === cat.value}
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${category === cat.value
                              ? `border-transparent bg-gradient-to-r ${cat.color}`
                              : 'border-gray-300 group-hover:border-orange-400'
                              }`}>
                              {category === cat.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className={`font-semibold text-sm transition-colors duration-300 ${category === cat.value ? 'text-orange-600' : 'text-gray-700'
                              }`}>{cat.label}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-0.5 rounded-full font-medium">
                            {cat.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div className={`${categoryView} mb-6`}>
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"></div>
                      Product Type
                    </h3>
                    <div className="space-y-2">
                      {[
                        {
                          value: 'Customtshirt',
                          label: 'Custom T-shirt',
                          color: 'from-purple-500 to-pink-600'
                        },
                        {
                          value: 'Solidoversized',
                          label: 'Solid Oversized',
                          color: 'from-blue-500 to-indigo-600'
                        },
                        {
                          value: 'Quotesdesigns',
                          label: 'Quotes Designs',
                          color: 'from-green-500 to-teal-600'
                        },
                        {
                          value: 'Plaintshirt',
                          label: 'Solid T-shirt',
                          color: 'from-gray-500 to-slate-600'
                        },
                        {
                          value: 'Acidwash',
                          label: 'Acid Wash',
                          color: 'from-orange-500 to-red-600'
                        }
                      ].map((type) => (
                        <label key={type.value} className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 border border-transparent hover:border-teal-200">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              value={type.value}
                              className="sr-only"
                              onChange={toggleSubCategory}
                              checked={subCategory.includes(type.value)}
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${subCategory.includes(type.value)
                              ? `border-transparent bg-gradient-to-r ${type.color}`
                              : 'border-gray-300 group-hover:border-teal-400'
                              }`}>
                              {subCategory.includes(type.value) && (
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`font-semibold text-sm transition-colors duration-300 ${subCategory.includes(type.value) ? 'text-teal-600' : 'text-gray-700'
                              }`}>{type.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                      Colors
                    </h3>
                    <div className="space-y-2">
                      {(() => {
                        // Get unique colors from all products
                        const allColors = products.reduce((acc, product) => {
                          if (product.colors && Array.isArray(product.colors)) {
                            return [...acc, ...product.colors];
                          }
                          return acc;
                        }, []);
                        const uniqueColors = [...new Set(allColors)];

                        const colorMap = {
                          'Black': '#000000',
                          'White': '#FFFFFF',
                          'Red': '#EF4444',
                          'Blue': '#3B82F6',
                          'Green': '#10B981',
                          'Yellow': '#F59E0B',
                          'Purple': '#8B5CF6',
                          'Pink': '#EC4899',
                          'Orange': '#F97316',
                          'Gray': '#6B7280',
                          'Navy': '#1E40AF',
                          'Brown': '#92400E'
                        };

                        return uniqueColors.length > 0 ? uniqueColors.map((color) => (
                          <label key={color} className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-pink-200">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                value={color}
                                className="sr-only"
                                onChange={() => toggleColor(color)}
                                checked={colors.includes(color)}
                              />
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${colors.includes(color)
                                ? 'border-transparent bg-gradient-to-r from-pink-500 to-purple-600'
                                : 'border-gray-300 group-hover:border-pink-400'
                                }`}>
                                {colors.includes(color) && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-md border border-gray-200"
                                  style={{ backgroundColor: colorMap[color] || '#000000' }}
                                >
                                  {colorMap[color] === '#FFFFFF' && (
                                    <div className="w-full h-full border border-gray-300 rounded-md"></div>
                                  )}
                                </div>
                                <span className={`font-semibold text-sm transition-colors duration-300 ${colors.includes(color) ? 'text-pink-600' : 'text-gray-700'
                                  }`}>{color}</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-0.5 rounded-full font-medium">
                              {products.filter(p => p.colors && p.colors.includes(color)).length}
                            </span>
                          </label>
                        )) : (
                          <p className="text-xs text-gray-500 text-center py-4">No color options available</p>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-3 rounded-2xl font-semibold hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Section - Mobile Optimized */}
          <div className='flex-1 relative'>
            {/* Section specific overlay for better content visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/20 to-pink-50/30 backdrop-blur-sm rounded-3xl"></div>

            {/* Floating decorative elements */}
            <div className='absolute top-10 left-1/4 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-300/20 to-red-400/20 rounded-full blur-xl lg:blur-2xl animate-pulse'></div>
            <div className='absolute top-20 right-1/3 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-lg lg:blur-xl animate-pulse delay-1000'></div>
            <div className='absolute bottom-10 left-1/2 w-14 h-14 lg:w-18 lg:h-18 bg-gradient-to-br from-teal-300/20 to-cyan-400/20 rounded-full blur-lg lg:blur-xl animate-pulse delay-500'></div>
            <div className='absolute top-1/2 right-1/4 w-10 h-10 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-300/20 to-pink-400/20 rounded-full blur-lg lg:blur-xl animate-pulse delay-1500'></div>

            <div className="relative z-10">
              {/* Mobile-Optimized Header */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border border-white/60 p-4 mt-20 md:mt-0 lg:p-8 mb-6 lg:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 lg:gap-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800 mb-1 lg:mb-2">All Collections</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <p className="text-xs sm:text-sm lg:text-lg text-gray-600">
                        Showing {displayedProducts.length} of {filterProducts.length} amazing products
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {showAllProducts && displayedProducts.length === filterProducts.length && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            All Products Loaded
                          </span>
                        )}
                        {!showAllProducts && hasMore && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Load 15 more products
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Sort Section - Hidden on Mobile */}
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-2 border border-orange-200/50">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M9 12h6M11 16h2" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                        </div>
                        <FormControl sx={{ minWidth: 180 }} size="small">
                          <Select
                            value={sortType}
                            onChange={(e) => SetSortType(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                '& fieldset': {
                                  border: 'none',
                                },
                                '&:hover fieldset': {
                                  border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                  border: 'none',
                                },
                              },
                              '& .MuiSelect-select': {
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#374151',
                              },
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  borderRadius: '12px',
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                  border: '1px solid #f3f4f6',
                                },
                              },
                            }}
                          >
                            <MenuItem value="relevant" sx={{
                              fontSize: '14px',
                              fontWeight: '500',
                              '&:hover': { backgroundColor: '#fef3c7' },
                              '&.Mui-selected': { backgroundColor: '#fef3c7' }
                            }}>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Most Relevant
                              </div>
                            </MenuItem>
                            <MenuItem value="low-high" sx={{
                              fontSize: '14px',
                              fontWeight: '500',
                              '&:hover': { backgroundColor: '#fef3c7' },
                              '&.Mui-selected': { backgroundColor: '#fef3c7' }
                            }}>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                                Price: Low to High
                              </div>
                            </MenuItem>
                            <MenuItem value="high-low" sx={{
                              fontSize: '14px',
                              fontWeight: '500',
                              '&:hover': { backgroundColor: '#fef3c7' },
                              '&.Mui-selected': { backgroundColor: '#fef3c7' }
                            }}>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>

              {/* Optimized Products Grid with Virtual Scrolling for Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 relative">
                {/* Grid background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-red-50/20 rounded-3xl -z-10"></div>

                {/* Skeleton Loading */}
                {isLoading && displayedProducts.length === 0 && (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="animate-pulse">
                      <div className="bg-gray-200 rounded-2xl h-96"></div>
                    </div>
                  ))
                )}

                {displayedProducts.map((item, index) => (
                  <div
                    key={item._id} // Use item._id instead of index for better React performance
                    className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms` // Reduced delay for faster appearance
                    }}
                  >
                    {/* Simplified Shadow Wrapper for better mobile performance */}
                    <div className="relative">
                      {/* Reduced shadow effects for mobile */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-all duration-300"></div>

                      {/* Main card with simplified styling */}
                      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden min-h-[320px] lg:min-h-[380px]">
                        <ProductItem
                          id={item._id}
                          name={item.name}
                          image={item.image}
                          price={item.price}
                          beforePrice={item.beforePrice}
                          subCategory={item.subCategory}
                          soldout={item.soldout}
                          slug={item.slug}
                          comboPrices={item.comboPrices}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && displayedProducts.length > 0 && (
                <div ref={loadMoreRef} className="flex justify-center mt-8 lg:mt-12">
                  {isLoading ? (
                    <div className="flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Loading more products...
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 text-sm">Scroll down to load more products</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {filterProducts.length - displayedProducts.length} more products available
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile-Optimized Empty State */}
              {displayedProducts.length === 0 && (
                <div className="text-center py-12 lg:py-20">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-lg">
                    <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">No products found</h3>
                  <p className="text-sm lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto px-4">Try adjusting your filters or search terms to discover amazing products</p>
                  <button
                    onClick={() => {
                      setCategory('');
                      setSubCategory([]);
                      setColors([]);
                    }}
                    className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Optimized ProductCard component with React.memo
const ProductCard = React.memo(({ item, index, isMobile }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
        }`}
      style={{
        animationDelay: isVisible ? `${index * 100}ms` : '0ms'
      }}
    >
      {/* Simplified shadow wrapper for better performance */}
      <div className="relative">
        {/* Reduced shadow effects for mobile performance */}
        {!isMobile && (
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
        )}

        {/* Main card */}
        <div className={`relative bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-lg border border-white/60 overflow-hidden ${isMobile ? 'min-h-[300px]' : 'min-h-[350px] lg:min-h-[400px]'
          }`}>
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
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default Collection