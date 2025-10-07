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
      const response = await axios.post("/review/post", {
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
    <div className='mt-8 md:mt-12 w-full'>
      <div className='bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-4 md:p-8 shadow-xl border border-orange-100'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center'>
            <FaStar className='text-white text-xl' />
          </div>
          <div>
            <h2 className='font-bold text-2xl md:text-3xl text-gray-800'>Share Your Experience</h2>
            <p className='text-gray-600 text-sm mt-1'>Help others by writing a review</p>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-6'>
          {/* Rating Section */}
          <div className='space-y-3'>
            <label className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'>
              Your Rating
            </label>
            <div className='flex gap-3'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-all duration-200 transform hover:scale-110 ${rating >= star
                    ? 'text-amber-400 drop-shadow-lg'
                    : 'text-gray-300 hover:text-amber-300'
                    }`}
                >
                  <FaStar size={28} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className='text-sm text-gray-600 mt-2'>
                You rated this product {rating} star{rating > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Subject Input */}
          <div className='space-y-2'>
            <label htmlFor="review-subject" className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'>
              Review Title
            </label>
            <input
              type="text"
              id="review-subject"
              name="reviewSubject"
              onChange={(e) => setReviewSub(e.target.value)}
              value={reviewSub}
              placeholder="What's most important to know?"
              className='w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400'
              required
            />
          </div>

          {/* Description Textarea */}
          <div className='space-y-2'>
            <label htmlFor="review-description" className='block text-sm font-semibold text-gray-700 uppercase tracking-wide'>
              Your Review
            </label>
            <textarea
              id="review-description"
              name="reviewDescription"
              onChange={(e) => setReviewDesc(e.target.value)}
              value={reviewDesc}
              placeholder="Share your thoughts about this product..."
              className='w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400 resize-none'
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className='w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2'
          >
            <FaStar className='text-sm' />
            Submit Review
          </button>
        </form>

        {/* Decorative Image */}
        <div className='hidden lg:block absolute top-16 right-8 opacity-10'>
          <img
            src={assets.about_us}
            alt="review"
            className='w-32 h-32 object-cover rounded-full'
          />
        </div>
      </div>
    </div>
  )
}

export default ProductReviewSection