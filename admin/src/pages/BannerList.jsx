import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const BannerList = ({ token }) => {
  const [banners, setBanners] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [imageBanner, setImageBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/banner-list", { headers: { token } });
      if (response.data.success) {
        setBanners(response.data.banners);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteBanner = async (id) => {
    try {
      const response = await axios.delete(backendUrl + `/api/product/delete-banner/${id}`, { headers: { token } });
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchBanners(); // Refresh the banner list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const editBanner = (banner) => {
    setSelectedBanner(banner);
    setImageBanner(banner.imageBanner[0]);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBanner(null);
    setImageBanner(null);
  };

  const handleImageChange = (e) => {
    setImageBanner(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('imageBanner', e.target.imageBanner.files[0]);

      const response = await axios.put(
        `${backendUrl}/api/product/update-banner/${selectedBanner._id}`,
        formData,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBanners();
        closeEditModal();
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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Banner List</h2>
      <div className="grid grid-cols-1 gap-4">
        {banners.map((banner, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded">
            <img src={banner.imageBanner[0]} alt={`Banner ${index + 1}`} className="w-20 h-20 object-cover" />
            <div className="flex gap-2">
              <button onClick={() => editBanner(banner)} className="px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
              <button onClick={() => deleteBanner(banner._id)} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Banner</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Banner Image</label>
                <input type="file" name="imageBanner" onChange={handleImageChange} />
                {imageBanner && <img src={imageBanner} alt="Banner" className="mt-2 w-20 h-20 object-cover" />}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerList;