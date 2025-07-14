import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Wishlist = () => {
  const { setWishlist, products, currency, wishlist, backendUrl, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showCartTotal, setShowCartTotal] = useState([]);

  const wishlistLength = Object.keys(wishlist).filter(item => wishlist[item] > 0).length;

  const updateWishlistQuantity = async (itemId, quantity) => {
    try {
      let updatedWishlist = { ...wishlist };

      if (quantity <= 0) {
        delete updatedWishlist[itemId];
      } else {
        updatedWishlist[itemId] = quantity;
      }

      setWishlist(updatedWishlist);
      if (token) {
        await axios.post(backendUrl + '/api/wishlist/update',
          { itemId, quantity },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  console.log(wishlist)

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const items in wishlist) {
        if (wishlist[items] > 0) {
          tempData.push({
            _id: items
          })
        }
      }
      setCartData(tempData)
      setShowCartTotal(tempData);
    }
  }, [wishlist, products])

  return (
    <div className='border-t-2 pt-4'>
      <h1 className="sr-only">Your Wishlist</h1>
      <div className='text-xl md:text-2xl lg:text-3xl mb-3'>
        <Title text1={'YOUR'} text2={'WISHLIST'} />
      </div>
      <div className=''>{
        showCartTotal && showCartTotal.length === 0 ?
          <div className='w-full text-center text-4xl md:text-9xl pt-16 md:pt-32 text-gray-400'>Empty Wishlist</div> :
          <div className='grid grid-cols-[1fr] md:grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] gap-4'>
            {
              cartData.map((item, index) => {
                const productData = products.find((product) => product._id === item._id);
                if (!productData) {
                  return null;
                }
                return (
                  <div key={index} className='w-68 md:w-96 py-4 border-slate-200 rounded-md relative shadow-xl text-gray-700 items-center gap-4'>
                    <div className='flex flex-col justify-center items-center gap-6'>
                      <img className='w-48 sm:w-48' src={productData.image[0]} alt={productData.name} />
                      <div className='flex flex-col items-center'>
                        <p className='text-sm sm:text-lg font-medium'>{productData.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency} {productData.price}</p>
                        </div>
                      </div>
                    </div>
                    <img onClick={() => updateWishlistQuantity(item._id, 0)} src={assets.bin_icon} alt="bin_icon" className='w-4 mr-4 sm:w-5 cursor-pointer absolute top-6 right-0 md:right-3' />
                    {
                      <Link key={index} to={`/product/${item._id}/${item.slug}`}>
                        <span>
                          <img src={assets.shopping_icon_wish} alt="bin_icon" className='w-4 mr-4 sm:w-6 cursor-pointer absolute bottom-6 right-0 md:right-3' />
                        </span>
                      </Link>
                    }
                  </div>
                )
              })
            }
          </div>
      }
      </div>
    </div>
  )
}

export default Wishlist