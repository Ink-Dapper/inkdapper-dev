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
        stars.push(<span key={i} className="text-yellow-500">★</span>);
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
      <div className='w-full lg:w-[650px] mt-8 md:mt-10 lg:mt-16'>
        <div className='flex justify-between items-center'>
          <h1 className='font-medium text-2xl'>Reviews</h1>
          {/* <Link to='/review-page'>
            <p className='cursor-pointer'>View more...</p>
          </Link> */}
        </div>
        <div className='border-4 p-4 mt-4'>
          <div className='w-full h-[250px] overflow-auto'>
            <div>
              {filteredReviews.map((review, index) => (
                <div key={index} className='mb-3 relative'>
                  <div className='flex items-center gap-2'>
                    <p className='font-medium text-sm text-gray-500'>{review.usersName}</p>
                    <span>{renderStars(review.rating)}</span>
                  </div>
                  <p className='font-medium text-base pl-2 pb-1 underline'>{review.reviewSub}</p>
                  <p className='text-sm mb-6 pl-2 text-gray-500'>{review.reviewDesc}</p>
                  <div className='text-xs text-gray-400 mb-1 absolute right-0 bottom-0'>{new Date(review.date).toDateString()}</div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ReviewViewMore