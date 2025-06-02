import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Collection = () => {

  const { products, search, showSearch, scrollToTop } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState(''); // Default to 'All'
  const [subCategory, setSubCategory] = useState([])
  const [sortType, SetSortType] = useState('relevant')
  const [sortValue, setSortValue] = useState('');
  const [categoryView, setCategoryView] = useState('block')

  const toggleSubCategory = (e) => {
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
      if (subCategory.includes(value)) {
        setSubCategory(subCategory.filter(item => item !== value));
      } else {
        setSubCategory([...subCategory, value]);
      }
    }

    // Hide the filter section after selecting a subcategory
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

  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  return (
    <div className='flex flex-col md:flex-row gap-1 md:gap-10 pt-3 md:pt-10 border-t relative'>
      {/* Filter options */}
      <div className="w-[100%] md:w-[18%]">
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-sm md:text-lg flex items-center cursor-pointer gap-2'>FILTERS
          <img src={assets.dropdown_icon} alt="filter" className={`h-3 md:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </p>
        {/* category filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} md:block transition`}>
          <p className='text-sm mb-3 font-medium'>CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className='flex gap-2'>
              <input type="radio" value={''} name="category" className='w-3' onChange={(e) => setCategory(e.target.value)} checked={category === ''} /> All
            </p>
            <p className='flex gap-2'>
              <input type="radio" value={'Men'} name="category" className='w-3' onChange={(e) => setCategory(e.target.value)} checked={category === 'Men'} /> Men
            </p>
            <p className='flex gap-2'>
              <input type="radio" value={'Women'} name="category" className='w-3' onChange={(e) => setCategory(e.target.value)} checked={category === 'Women'} /> Women
            </p>
            {/* <p className='flex gap-2'>
              <input type="checkbox" value={'Kids'} className='w-3' onChange={toggleCategory}/> Kids
            </p> */}
          </div>
        </div>
        {/* sub category filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} md:block ${categoryView} transition`}>
          <p className='text-sm mb-3 font-medium'>TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className='flex gap-2'>
              <input type="checkbox" id="filter-all" name="filter-all" value={''} className='w-3' onChange={allChecked} /> All
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" id="filter-custom-tshirt" name="filter-custom-tshirt" value={'Customtshirt'} className='w-3' onChange={toggleSubCategory} /> Custom T-shirt
            </p>
            {/* <p className='flex gap-2'>
              <input type="checkbox" value={'Oversizedtshirt'} className='w-3' onChange={toggleSubCategory} /> Over Sized T-shirt
            </p> */}
            <p className='flex gap-2'>
              <input type="checkbox" id="filter-solid-oversized" name="filter-solid-oversized" value={'Solidoversized'} className='w-3' onChange={toggleSubCategory} /> Solid Oversized T-shirt
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" id="filter-quotes-designs" name="filter-quotes-designs" value={'Quotesdesigns'} className='w-3' onChange={toggleSubCategory} /> Quotes Designs
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" id="filter-plain-tshirt" name="filter-plain-tshirt" value={'Plaintshirt'} className='w-3' onChange={toggleSubCategory} /> Solid T-shirt
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" id="filter-acid-wash" name="filter-acid-wash" value={'Acidwash'} className='w-3' onChange={toggleSubCategory} /> Acid Wash
            </p>
            {/* <p className='flex gap-2'>
              <input type="checkbox" value={'Polotshirt'} className='w-3' onChange={toggleSubCategory} /> Polo T-shirt
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Hoddies'} className='w-3' onChange={toggleSubCategory} /> Hoddies
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={'Sweattshirts'} className='w-3' onChange={toggleSubCategory} /> Sweat T-shirt
            </p> */}
          </div>
        </div>
      </div>
      {/* right side */}
      <div className='w-[100%] md:w-[82%]'>
        <div className="md:flex justify-between text-sm sm:text-base md:text-2xl mb-4 relative">
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/* product sort */}
          <div className='absolute lg:static -top-10 right-0 md:-top-4'>
            <FormControl sx={{ m: 1, minWidth: { xs: 140, sm: 180 }, fontSize: { xs: 10, sm: 14 } }} size="small">
              <InputLabel id="demo-select-small-label" sx={{ fontSize: { xs: 14, sm: 18 }, top: { xs: 3, sm: 0 }, left: { xs: -3 } }} >Filter</InputLabel>
              <Select
                value={sortType}
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Age"
                onChange={(e) => SetSortType(e.target.value)}
                sx={{ fontSize: { xs: 12, sm: 14 }, width: { xs: 140, sm: '100%' }, padding: '0px' }}>
                <MenuItem sx={{ fontSize: { xs: 12, sm: 14 }, width: { xs: 140, sm: '100%' }, padding: '12px' }} value="relevant">Sort by: Relevant</MenuItem>
                <MenuItem sx={{ fontSize: { xs: 12, sm: 14 }, width: { xs: 140, sm: '100%' }, padding: '12px' }} value="low-high">Sort by: Low - High</MenuItem>
                <MenuItem sx={{ fontSize: { xs: 12, sm: 14 }, width: { xs: 140, sm: '100%' }, padding: '12px' }} value="high-low">Sort by: High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {
            filterProducts.map((item, index) => {
              return <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                beforePrice={item.beforePrice}
                subCategory={item.subCategory}
                soldout={item.soldout}
              />
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Collection