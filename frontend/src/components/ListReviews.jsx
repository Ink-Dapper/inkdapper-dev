import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link, useParams } from 'react-router-dom'
// Google Reviews - Commented out
// import CombinedReviewsSection from './CombinedReviewsSection'

const ListReviews = ({ productId, showSyncButton = true }) => {
  // Use productId from props if provided, otherwise get from URL params
  const { productId: urlProductId } = useParams();
  const actualProductId = productId || urlProductId;

  return (
    <div className='w-full lg:w-[650px] mt-8 md:mt-10 lg:mt-16 animate-fade-in-up'>
      {/* Google Reviews - Commented out */}
      {/* <CombinedReviewsSection productId={actualProductId} showSyncButton={showSyncButton} /> */}

      {/* Placeholder for reviews section */}
      <div className='text-center text-gray-500 py-8'>
        <p>Reviews section temporarily disabled</p>
      </div>
    </div>
  );
};

export default ListReviews