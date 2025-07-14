import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, setCartItems, customDataArray, updateCustomQuantity, getCustomData } = useContext(ShopContext)
  const [cartData, SetCartData] = useState([])
  const [showCartTotal, setShowCartTotal] = useState([])

  const updateSize = (productId, newSize, quantity) => {
    setCartItems(prevCartItems => {
      const updatedCart = { ...prevCartItems };
      const currentSizes = updatedCart[productId];
      if (currentSizes) {
        const currentSizeKey = Object.keys(currentSizes).find(size => currentSizes[size] === quantity);
        if (currentSizeKey) {
          delete currentSizes[currentSizeKey];
        }
        if (!currentSizes[newSize]) {
          currentSizes[newSize] = 0;
        }
        currentSizes[newSize] += quantity;
      }
      return updatedCart;
    });
  };

  useEffect(() => {
    if (products.length > 0 || customDataArray.length > 0) {
      const tempData = []
      for (const items in cartItems) {
        console.log(cartItems[items])
        for (const item in cartItems[items]) {
          console.log(cartItems[items][item])
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      // // Add custom data to the cart display
      if (customDataArray.length > 0) {
        customDataArray.forEach(customItem => {
          tempData.push({
            _id: customItem._id,
            size: customItem.size,
            quantity: customItem.quantity
          });
        });
      }

      // Remove duplicates based on _id and size
      tempData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t._id === item._id && t.size === item.size
        ))
      );

      SetCartData(tempData)
      setShowCartTotal(tempData);
      console.log(tempData)
    }
  }, [cartItems, products, getCustomData])

  return (
    <div className='border-t p-6 md:p-14'>
      <h1 className="sr-only">Your Cart</h1>
      <div className=' text-xl md:text-2xl lg:text-3xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {
          showCartTotal.length === 0 ? (
            <div className='text-center text-4xl md:text-9xl pt-16 md:pt-32 text-gray-400'>Empty Cart</div>
          ) : (
            <>
              {cartData.length > 0 && cartData.map((item, index) => {
                const productData = products.find((product) => product._id === item._id);
                if (!productData) {
                  return null;
                }
                return (
                  <div key={index} className='py-4 pr-9 border-t border-b text-gray-700 flex flex-col md:grid md:grid-cols-[4fr_2fr_0.5fr] items-start md:items-center gap-4 relative'>
                    <div className='flex items-start gap-6'>
                      <img className='w-16 sm:w-20' src={productData.image[0]} alt={productData.name} />
                      <div>
                        <p className='text-sm sm:text-lg font-medium'>{productData.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency} {productData.price}</p>
                          <FormControl sx={{ m: 1, minWidth: 70 }} size="small">
                            <InputLabel id="demo-select-small-label" sx={{ fontWeight: 'bold' }} style={{ top: '-6px', left: '-8px' }}>sizes</InputLabel>
                            <Select
                              value={item.size} onChange={(e) => updateSize(item._id, e.target.value, item.quantity)}
                              labelId="demo-select-small-label"
                              id="demo-select-small">
                              {productData.sizes.map((size) => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                    <div className='relative w-full mb-6 md:mb-0'>
                      <div className='flex items-center gap-4 absolute -right-8 md:static'>
                        <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className='bg-gray-500 text-white px-2 py-0 sm:px-3 hover:bg-slate-200 hover:text-black'>-</button>
                        <p>{item.quantity}</p>
                        <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className='bg-gray-500 text-white px-2 py-0 sm:px-3 hover:bg-slate-200 hover:text-black'>+</button>
                      </div>
                    </div>
                    <img onClick={() => updateQuantity(item._id, item.size, 0)} src={assets.bin_icon} alt="bin_icon" className='w-4 mr-4 sm:w-5 cursor-pointer sm:static absolute right-0' />
                  </div>
                );
              })}

              {customDataArray.length > 0 && customDataArray.map((data, index) => (
                <div key={index} className='py-4 pr-9 border-t border-b text-gray-700 flex flex-col md:grid md:grid-cols-[4fr_2fr_0.5fr] items-start md:items-center gap-4 relative'>
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={data.reviewImageCustom} alt={data.name} />
                    <div>
                      <p className='text-sm sm:text-lg font-medium'>{data.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency} {data.price}</p>
                        <p>size : <span>{data.size}</span></p>
                      </div>
                    </div>
                  </div>
                  <div className='relative w-full mb-6 md:mb-0'>
                    <div className='flex items-center gap-4 absolute -right-8 md:static'>
                      <p className='bg-gray-500 text-white px-2 py-0 sm:px-3 hover:bg-slate-200 hover:text-black'>Quantity: {data.quantity}</p>
                    </div>
                  </div>
                  <img onClick={() => updateCustomQuantity(data._id, data.size, 0)} src={assets.bin_icon} alt="bin_icon" className='w-4 mr-4 sm:w-5 cursor-pointer sm:static absolute right-0' />
                </div>
              ))}
            </>
          )
        }
      </div>

      <div className={`flex justify-end my-8 md:my-20 ${showCartTotal.length === 0 ? 'hidden' : 'block'}`}>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-xs md:text-sm my-8 px-6 md:px-8 py-2 md:py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart