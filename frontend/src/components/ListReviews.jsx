import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link, useParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'

const ListReviews = ({ productId, showSyncButton = true }) => {
  // Use productId from props if provided, otherwise get from URL params
  const { productId: urlProductId, reviewList } = useParams();
  const { reviewList: reviews } = useContext(ShopContext);
  const actualProductId = productId || urlProductId;

  // Filter reviews for this specific product
  const productReviews = reviews.filter(review => review.productId === actualProductId);

  // Calculate average rating
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, review) => sum + Number(review.rating), 0) / productReviews.length
    : 0;

  return (
    <div className='w-full lg:w-[650px] mt-8 md:mt-10 lg:mt-16 animate-fade-in-up'>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center'>
            <FaStar className='text-white text-xl' />
          </div>
          <div>
            <h2 className='font-bold text-2xl md:text-3xl text-gray-800'>Customer Reviews</h2>
            <p className='text-gray-600 text-sm mt-1'>
              {productReviews.length} review{productReviews.length !== 1 ? 's' : ''}
              {averageRating > 0 && ` • ${averageRating.toFixed(1)} average rating`}
            </p>
          </div>
        </div>

        {productReviews.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FaStar className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Reviews Yet</h3>
            <p className='text-gray-600'>Be the first to share your experience with this product!</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {productReviews.map((review, index) => (
              <div key={index} className='border-b border-gray-100 pb-6 last:border-b-0'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-white font-bold text-lg'>
                      {review.usersName ? review.usersName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center flex-wrap gap-2 md:gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-900'>
                        {review.usersName || 'Anonymous User'}
                      </h4>
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${star <= Number(review.rating)
                              ? 'text-amber-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-500'>
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h5 className='font-medium text-gray-800 mb-2'>{review.reviewSub}</h5>
                    <p className='text-gray-700 leading-relaxed'>{review.reviewDesc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListReviews