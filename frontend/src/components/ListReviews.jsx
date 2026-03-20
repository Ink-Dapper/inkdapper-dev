import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link, useParams } from 'react-router-dom'

const ReviewViewMore = () => {
  const { reviewList } = useContext(ShopContext);
  const { productId } = useParams();
  const [filteredReviews, setFilteredReviews] = useState([]);

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-amber-400 drop-shadow-sm">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  const filterReviewData = async () => {
    const filteredReviews = reviewList.filter((item) => item.productId === productId);
    setFilteredReviews(filteredReviews);
  };

  useEffect(() => {
    filterReviewData();
    console.log(filteredReviews.length)
  }, [reviewList, productId]);

  return (
    filteredReviews.length > 0 && (
      <div className='w-full lg:w-[650px] mt-8 md:mt-10 lg:mt-16 animate-fade-in-up'>
        {/* Header Section */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full'></div>
            <h1 className='font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent'>
              Customer Reviews
            </h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
            <span className='text-sm font-medium text-gray-600'>{filteredReviews.length} reviews</span>
          </div>
        </div>

        {/* Reviews Container */}
        <div className='relative'>
          {/* Glass morphism background */}
          <div className='absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white/80 to-amber-50/50 rounded-2xl backdrop-blur-sm border border-white/20'></div>

          {/* Main content */}
          <div className='relative bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 overflow-hidden'>
            {/* Decorative top border */}
            <div className='h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400'></div>

            {/* Reviews scrollable area */}
            <div className='max-h-[350px] overflow-y-auto p-6 custom-scrollbar'>
              <div className='space-y-6'>
                {filteredReviews.map((review, index) => (
                  <div key={index} className='group relative'>
                    {/* Review card */}
                    <div className='bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-white/40 hover:shadow-md transition-all duration-300 hover:scale-[1.02]'>
                      {/* Header with user info and rating */}
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          {/* User avatar */}
                          <div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-md'>
                            <span className='text-white font-bold text-sm'>
                              {review.usersName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className='font-semibold text-gray-800 text-sm'>{review.usersName}</p>
                            <div className='flex items-center gap-1 mt-1'>
                              {renderStars(review.rating)}
                              <span className='text-xs text-gray-500 ml-1'>({review.rating}/5)</span>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className='text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full'>
                          {new Date(review.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Review content */}
                      <div className='space-y-2'>
                        <h3 className='font-semibold text-gray-900 text-base leading-tight'>
                          {review.reviewSub}
                        </h3>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                          {review.reviewDesc}
                        </p>
                      </div>

                      {/* Decorative bottom accent */}
                      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className='absolute -top-4 -right-4 w-8 h-8 bg-orange-200 rounded-full opacity-60 blur-xl'></div>
          <div className='absolute -bottom-4 -left-4 w-12 h-12 bg-amber-200 rounded-full opacity-40 blur-xl'></div>
        </div>

        {/* Custom scrollbar styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #f97316, #f59e0b);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #ea580c, #d97706);
          }
        `}</style>
      </div>
    )
  );
};

export default ReviewViewMore