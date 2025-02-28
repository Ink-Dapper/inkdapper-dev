import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const BannerImages = ({ token }) => {
  const [imageBanner, setImageBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      imageBanner && formData.append("imageBanner", imageBanner);

      const response = await axios.post(backendUrl + "/api/product/add-banner", formData, { headers: { token } });
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        setImageBanner(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div className=''>
        <div className=''>
          <Link to='/banner-list' className='absolute right-10'>
            <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>Banner List</button>
          </Link>
        </div>
        <p className='font-semibold mt-3 text-2xl mb-3'>Upload Banner Image</p>
        <p className='mt-3 mb-2'>Product Banner Image</p>
        <div className='flex gap-2'>
          <label htmlFor="imageBanner">
            <img className='w-20 h-25' src={!imageBanner ? assets.upload_area : URL.createObjectURL(imageBanner)} alt="" />
            <input onChange={(e) => setImageBanner(e.target.files[0])} type="file" id='imageBanner' hidden />
          </label>
        </div>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white' disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'ADD'}
      </button>
    </form>
  );
};

export default BannerImages;