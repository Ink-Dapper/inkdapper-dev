import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  Upload,
  Image,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Info
} from 'lucide-react';

const BannerImages = ({ token }) => {
  const [imageBanner, setImageBanner] = useState(null);
  const [colorLabel, setColorLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setImageBanner(file);
      setPreviewUrl(URL.createObjectURL(file));
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
      setImageBanner(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error('Please drop a valid image file');
    }
  };

  const clearImage = () => {
    setImageBanner(null);
    setPreviewUrl(null);
    // Reset file input
    const fileInput = document.getElementById('imageBanner');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!imageBanner) {
      toast.error('Please select an image to upload');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("imageBanner", imageBanner);
      formData.append("colorLabel", colorLabel);

      const response = await axios.post(backendUrl + "/api/product/add-banner", formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setColorLabel('');
        clearImage();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to upload banner');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to='/banner-list'
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Banner List
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Page Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Upload Banner Image</h1>
          <p className="text-gray-600 mt-1">Add a new promotional banner to your website</p>
        </div>

        <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Banner Image
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${dragOver
                ? 'border-blue-500 bg-blue-50'
                : previewUrl
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!previewUrl ? (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your banner image here
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    or click to browse from your computer
                  </p>
                  <input
                    onChange={handleImageChange}
                    type="file"
                    id="imageBanner"
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="imageBanner"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    PNG, JPG, GIF up to 5MB • Recommended: 1200x400px
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Banner preview"
                      className="max-w-full max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                    <input
                      onChange={handleImageChange}
                      type="file"
                      id="imageBanner"
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="imageBanner"
                      className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      Change Image
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slider Color Label
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This label appears in the slider control bar below the banner (e.g. "Classic Black", "Ocean Blue"). Leave blank to auto-detect from the image.
            </p>
            <input
              type="text"
              value={colorLabel}
              onChange={(e) => setColorLabel(e.target.value)}
              placeholder="e.g. Classic Black, Ocean Blue, Bold Red..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={40}
            />
          </div>

          {/* Image Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-1">Image Requirements</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Maximum file size: 5MB</li>
                  <li>• Supported formats: PNG, JPG, GIF</li>
                  <li>• Recommended dimensions: 1200x400 pixels</li>
                  <li>• Aspect ratio: 3:1 (landscape)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              to="/banner-list"
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || !imageBanner}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Banner
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerImages;