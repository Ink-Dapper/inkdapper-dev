import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { assets } from '../assets/assets';

const ProductItem = ({ id, image, name, price, beforePrice, subCategory }) => {

  const { currency, scrollToTop, addToWishlist, token, wishlist } = useContext(ShopContext)
  const [favWishlist, setFavWishlist] = useState([])
  const [changeText, setChangeText] = useState('')

  const addToWishlistPage = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, })
    } else {
      addToWishlist(id)
    }
  }
  const funcFavWishlist = () => {
    const obj = wishlist;
    const keys = Object.keys(obj);
    setFavWishlist(keys)
  }

  const createNew = () => {
    const subCategoryMap = {
      'Customtshirt': 'Custom T-shirt',
      'Oversizedtshirt': 'Oversized T-shirt',
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
      'Polotshirt': 'Polo T-shirt',
      'Hoddies': 'Hoodies', // Fixed spelling
      'Sweattshirts': 'Sweat T-shirt' // Fixed spelling
    };

    // Use the mapping object to set the change text
    const newText = subCategoryMap[subCategory];
    if (newText) {
      setChangeText(newText);
    }
  }

  useEffect(() => {
    funcFavWishlist();
    createNew();
  }, [wishlist]);

  return (
    <div className='relative'>
      {favWishlist.includes(id) ? <FavoriteIcon onClick={() => addToWishlistPage()} className={`absolute right-3 top-2 z-20 cursor-pointer`} /> : <FavoriteBorderIcon onClick={() => addToWishlistPage()} className={`absolute right-3 top-2 z-20 cursor-pointer`} />}

      <Link onClick={() => scrollToTop()} className={`text-gray-700 cursor-pointer`} to={`/product/${id}`}>
        <div className='transition-shadow shadow-lg shadow-gray-400 rounded-b-md'>
          <div className="overflow-hidden h-52 sm:h-80 bg-gray-200 flex justify-center items-center rounded-t-md relative product-image">
            <img src={image[0]} alt={name} className="transition-all ease-in-out h-[100%] object-cover relative z-10" style={{ width: '-webkit-fill-available' }} />
            {/* <img src={assets.inkdapper_logo} alt="logo" className='w-full p-12 rotate-12 opacity-10 absolute'/> */}
          </div>
          <div className='border-l-2 border-l-gray-950 border-t-2 border-t-gray-950 rounded-b-md relative'>
            <p className='pt-1 pb-1 pl-2 pr-1 md:pt-2 md:pb-2 md:pl-3 md:pr-1 text-sm md:text-base font-medium md:font-semibold truncate'>{name}</p>
            {
              changeText &&
              <p className='py-[2px] px-1 mx-0 text-xs text-white truncate -left-[1.5px] z-10 absolute -top-[22px] bg-gray-900'>{changeText}</p>
            }
            <div className='flex items-center pt-2 bg-gray-950 rounded-b-md'>
              {
                beforePrice && <p className='text-sm pl-4 pb-2 text-gray-300 font-medium relative'>
                  <span className='w-11 h-[2px] bg-red-500 absolute top-[10px] -right-2 -rotate-12'></span>{currency} {beforePrice}</p>
              }
              <p className=' text-sm md:text-lg text-white pl-4 pb-2 font-semibold'>{currency} {price}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem