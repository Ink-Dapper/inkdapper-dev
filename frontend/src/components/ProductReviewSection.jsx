import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const ProductReviewSection = ({ productId }) => {
  const { backendUrl, usersDetails } = useContext(ShopContext)
  const [reviewDesc, setReviewDesc] = useState("")
  const [reviewSub, setReviewSub] = useState("")
  const [rating, setRating] = useState(0)
  const [usersName, setUsersName] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Please select a rating stars')
      return null
    } else if (!reviewSub) {
      toast.error('Please enter a subject')
      return null
    }

    try {
      const response = await axios.post(backendUrl + "/api/review/post", {
        reviewSub: reviewSub,
        reviewDesc: reviewDesc,
        productId: productId,
        rating: rating,
        usersName: usersName
      });

      if (response.data.success) {
        toast.success(response.data.message)
        setReviewDesc('')
        setReviewSub('')
        setRating(0)
      } else {
        toast.error(response.data.message)
      }
      // Handle response...
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getUserNameDetails = () => {
    try {
      usersDetails.map((items) => {
        setUsersName(items.users.name)
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUserNameDetails()
  }, [usersDetails])

  return (
    <div className='mt-4 md:mt-4 w-full lg:w-1/2'>
      <h2 className='font-medium text-xl md:text-2xl mb-1'>Product Reviews</h2>
      <form onSubmit={onSubmitHandler} className=''>
        <div className='label_star mt-2 w-56 flex justify-between items-center'>
          <label htmlFor="rating" className='font-medium text-lg md:text-xl gap-1'>Ratings :</label>
          <div className='flex gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className={`cursor-pointer ${rating >= star ? 'text-red-500' : 'text-gray-300'}`} onClick={() => setRating(star)} size={20} />
            ))}
          </div>
        </div>
        <div className='grid md:grid-rows-1 md:grid-flow-col grid-flow-row gap-3 mt-4'>
          <img src={assets.about_us} alt="review" className='w-full h-64 lg:w-44 lg:h-64 hidden md:block col-span-1 row-span-1 md:col-span-1 md:row-span-3' />
          <div className='flex flex-col items-start col-span-2 row-span-1'>
            <input type="text" onChange={(e) => setReviewSub(e.target.value)} value={reviewSub} placeholder="Subject here..." className='w-full lg:w-[450px] h-10 border border-gray-300 p-4 outline-none' required />
          </div>
          <div className='flex flex-col items-start col-span-2 row-span-1'>
            <textarea onChange={(e) => setReviewDesc(e.target.value)} value={reviewDesc} type="text" placeholder="Your review here..." className='w-full lg:w-[450px] h-36 border border-gray-300 p-4 outline-none' required></textarea>
          </div>
          <button type="submit" className='w-full lg:w-[450px] text-lg px-8 py-2 col-span-2 row-span-1 bg-gray-700 text-white'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default ProductReviewSection