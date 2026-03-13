import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import {
  Image,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

const BannerList = ({ token }) => {
  const [banners, setBanners] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [imageBanner, setImageBanner] = useState(null);
  const [colorLabel, setColorLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(backendUrl + "/api/product/banner-list", { headers: { token } });
      if (response.data.success) {
        setBanners(response.data.banners);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch banners');
    } finally {
      setIsFetching(false);
    }
  };

  const deleteBanner = async () => {
    try {
      const response = await axios.delete(backendUrl + `/api/product/delete-banner/${bannerToDelete._id}`, { headers: { token } });
      if (response.data.success) {
        toast.success('Banner deleted successfully');
        fetchBanners();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete banner');
    } finally {
      setShowDeleteConfirm(false);
      setBannerToDelete(null);
    }
  };

  const confirmDelete = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteConfirm(true);
  };

  const editBanner = (banner) => {
    setSelectedBanner(banner);
    setImageBanner(banner.imageBanner[0]);
    setColorLabel(banner.colorLabel || '');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBanner(null);
    setImageBanner(null);
    setColorLabel('');
    setDragOver(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageBanner(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageBanner(URL.createObjectURL(file));
      // Update the file input
      const fileInput = document.getElementById('imageBanner');
      if (fileInput) {
        fileInput.files = e.dataTransfer.files;
      }
    } else {
      toast.error('Please drop a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      const fileInput = e.target.imageBanner;
      if (fileInput.files[0]) {
        formData.append('imageBanner', fileInput.files[0]);
      }
      formData.append('colorLabel', colorLabel);

      const response = await axios.put(
        `${backendUrl}/api/product/update-banner/${selectedBanner._id}`,
        formData,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        toast.success('Banner updated successfully');
        fetchBanners();
        closeEditModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update banner');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBanners = banners.filter(banner =>
    banner.imageBanner[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">Manage your website banners and promotional images</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanners}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{filteredBanners.length} of {banners.length} banners</span>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      {filteredBanners.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No banners found' : 'No banners yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first banner image'
            }
          </p>
          {!searchTerm && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBanners.map((banner, index) => (
            <div key={banner._id || index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative group">
                <img
                  src={banner.imageBanner[0]}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <button
                      onClick={() => editBanner(banner)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Edit banner"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(banner)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(banner.imageBanner[0], '_blank')}
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      title="View full size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Banner {index + 1}</span>
                  <span className="text-xs text-gray-500">ID: {banner._id?.slice(-6)}</span>
                </div>
                {banner.colorLabel && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-xs text-orange-600 font-medium truncate">{banner.colorLabel}</span>
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => editBanner(banner)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(banner)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Banner</h2>
              <button
                onClick={closeEditModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <input
                    type="file"
                    id="imageBanner"
                    name="imageBanner"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageBanner"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>

                {imageBanner && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={imageBanner}
                        alt="Banner preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute top-1 right-1">
                        <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slider Color Label
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Shown in the slider control bar (e.g. "Classic Black"). Leave blank to auto-detect.
                </p>
                <input
                  type="text"
                  value={colorLabel}
                  onChange={(e) => setColorLabel(e.target.value)}
                  placeholder="e.g. Classic Black, Ocean Blue..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={40}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Banner'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Banner</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <img
                  src={bannerToDelete?.imageBanner[0]}
                  alt="Banner to delete"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteBanner}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerList;