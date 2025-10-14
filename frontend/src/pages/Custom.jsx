import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import apiInstance from '../utils/axios'
import { assets, teesCollection } from '../assets/assets'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Custom = () => {
  const { token, backendUrl, addToCart, setCartItems, getCustomData, cartItems, customDataArray, updateQuantity } = useContext(ShopContext)
  const [imageId, setImageId] = useState('00010')
  const [image, setImage] = useState('')
  const [reviewImageCustom, setReviewImageCustom] = useState(false)
  const [imageValue, setImageValue] = useState('white')
  const [size, setSize] = useState('')
  const [views, setViews] = useState('Front')
  const [gender, setGender] = useState('Men')
  const [userId, setUserId] = useState(null)
  const [customQuantity, setCustomQuantity] = useState(0);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (!token) {
          return;
        }
        const response = await apiInstance.post("/user/profile", {});
        if (response.data.success) {
          setUserId(response.data.users._id);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserId();
  }, [token, backendUrl]);

  const getCustomImage = () => {
    teesCollection.map((items) => (
      setImage(items.image[0])
    ))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!size) {
      return;
    }

    if (!reviewImageCustom) {
      return;
    }

    if (!customQuantity || customQuantity <= 0) {
      return;
    }

    console.log("userId:", userId);
    console.log("ImageId:", imageId);
    console.log("Size:", size);
    console.log("Views:", views);
    console.log("Gender:", gender);
    console.log("Image Value:", imageValue);
    console.log("customQuantity:", customQuantity);
    console.log("Review Image:", reviewImageCustom);

    try {
      const formDataOne = new FormData();
      formDataOne.append("userId", userId);
      formDataOne.append("imageId", imageId);
      formDataOne.append("customQuantity", customQuantity);
      formDataOne.append("size", size);
      formDataOne.append("reviewImageCustom", reviewImageCustom);
      formDataOne.append("views", views);
      formDataOne.append("gender", gender);
      formDataOne.append("imageValue", imageValue);

      // Send the custom data to the backend
      const response = await apiInstance.post("/cart/custom", formDataOne);
      console.log(response.data)
      if (response.data.success) {
        toast.success(response.data.message);

        setReviewImageCustom(false);
        setImageValue('white');
        setViews('Front');
        setGender('Men');
        setSize('');
        setCustomQuantity(0);
        setImageId('00010')
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const passTheCustomValue = () => {
    if (!size) {
      toast.error("Size is required.");
      return;
    }
    if (!reviewImageCustom) {
      toast.error("Review image is required.");
      return;
    }
    if (!customQuantity || customQuantity <= 0) {
      toast.error("Custom quantity must be greater than zero.");
      return;
    }

    customDataArray.forEach((item) => {
      const existingQuantity = cartItems[item._id]?.[item.size] || 0;
      if (existingQuantity > 0) {
        updateQuantity(item._id, item.size, existingQuantity + customQuantity);
      } else {
        addToCart(item._id, item.size);
      }
    });
  };

  useEffect(() => {
    getCustomImage()
  }, [token, getCustomData])

  return (
    <div className='border-t-2 pt-4'>
      <h1 className="sr-only">Custom T-shirt</h1>
      <div className=' text-xl md:text-2xl lg:text-3xl mb-3'>
        <Title text1={'YOUR'} text2={'CUSTOM TOOL'} />
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className='flex justify-between'>
          <div className='w-1/2'>
            <div className='grid grid-cols-8 mt-6 h-44 gap-4'>
              {
                teesCollection.map((item, index) => (
                  <div key={index} className=''>
                    <div className='w-12 h-16 flex gap-2'>
                      <img onClick={() => { setImageId(item._id); setImage(item.image); setImageValue(item.color); }} src={item.image} key={index} alt="product-image" className='w-[100%] h-[100%] flex-shrink-0 cursor-pointer' />
                    </div>
                  </div>
                ))
              }
            </div>

            <div className='mt-8'>
              <p className='mb-3 font-medium text-lg'>Select Size</p>
              <div className='flex gap-3'>
                <div onClick={() => setSize("S")}>
                  <p className={`${size === "S" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
                </div>
                <div onClick={() => setSize("M")}>
                  <p className={`${size === "M" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
                </div>
                <div onClick={() => setSize("L")}>
                  <p className={`${size === "L" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
                </div>
                <div onClick={() => setSize("XL")}>
                  <p className={`${size === "XL" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
                </div>
                <div onClick={() => setSize("XXL")}>
                  <p className={`${size === "XXL" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
                </div>
              </div>
            </div>

            <div className='mt-8'>
              <p className='mb-3 font-medium text-lg'>Select View</p>
              <div className='flex gap-3'>
                <div onClick={() => setViews("Front")}>
                  <p className={`${views === "Front" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Front Side</p>
                </div>
                <div onClick={() => setViews("Back")}>
                  <p className={`${views === "Back" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Back Side</p>
                </div>
              </div>
            </div>
            <div className='flex'>
              <div className='mt-8'>
                <p className='mb-3 font-medium text-lg'>Select Gender</p>
                <div className='flex gap-3'>
                  <div onClick={() => setGender("Men")}>
                    <p className={`${gender === "Men" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Men</p>
                  </div>
                  <div onClick={() => setGender("Women")}>
                    <p className={`${gender === "Women" ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Women</p>
                  </div>
                </div>
              </div>
              <div className='mt-8 ml-8'>
                <p className='mb-3 font-medium text-lg'>Select Quantity</p>
                <div className='flex items-center gap-3'>
                  <span
                    onClick={() => setCustomQuantity(customQuantity - 1)}
                    className='bg-slate-200 text-black px-2 py-1 sm:px-3 hover:bg-pink-100 hover:text-black cursor-pointer'>-
                  </span>
                  <p>{customQuantity < 0 ? setCustomQuantity(0) : customQuantity}</p>
                  <span
                    onClick={() => setCustomQuantity(customQuantity + 1)}
                    className='bg-slate-200 text-black px-2 py-1 sm:px-3 hover:bg-pink-100 hover:text-black cursor-pointer'>+
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='w-1/2'>
            <div className={`w-[80%] h-[100%] ml-24 flex justify-center relative ${views === "Front" ? 'block' : 'hidden'}`}>
              <img src={image} className='h-[100%]' alt="product-image" />
              <div className='absolute top-[25%] z-10'>
                <p className='text-base font-medium mb-2'>Front</p>
                <img className='w-64 h-72 object-contain' src={!reviewImageCustom ? assets.upload_here : URL.createObjectURL(reviewImageCustom)} alt="" />
                <input onChange={(e) => setReviewImageCustom(e.target.files[0])} type="file" id='reviewImageCustom' className='opacity-0 absolute w-64 h-72 top-0 z-20 cursor-pointer' />
              </div>
            </div>
            <div className={`w-[80%] h-[100%] ml-24 flex justify-center relative ${views === "Back" ? 'block' : 'hidden'}`}>
              <img src={image} className='h-[100%]' alt="product-image" />
              <div className='absolute top-[25%] z-10'>
                <p className='text-base font-medium mb-2'>Back</p>
                <img className='w-64 h-72 object-contain' src={!reviewImageCustom ? assets.upload_here : URL.createObjectURL(reviewImageCustom)} alt="" />
                <input onChange={(e) => setReviewImageCustom(e.target.files[0])} type="file" id='reviewImageCustom' className='opacity-0 absolute w-64 h-72 top-0 z-20 cursor-pointer' />
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => passTheCustomValue()} type='submit' className='px-6 py-3 mt-4 bg-black text-white'>ADD TO CART</button>
      </form>
    </div>
  )
}

export default Custom