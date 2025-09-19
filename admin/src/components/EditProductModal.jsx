import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { FaTimes, FaEdit, FaSave, FaSpinner, FaEye, FaEyeSlash, FaTag, FaImage, FaStar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

const EditProductModal = ({ token, product, close, onSuccess }) => {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)
  const [beforePrice, setBeforePrice] = useState(product.beforePrice) // New state for beforePrice
  const [code, setCode] = useState(product.code)
  const [category, setCategory] = useState(product.category)
  const [subCategory, setSubCategory] = useState(product.subCategory)
  const [sizes, setSizes] = useState(product.sizes)
  const [bestseller, setBestseller] = useState(product.bestseller)
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)
  const [reviewImage1, setReviewImage1] = useState(null)
  const [reviewImage2, setReviewImage2] = useState(null)
  const [reviewImage3, setReviewImage3] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isViewMode, setIsViewMode] = useState(product.viewMode || false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false)
  const [comboPrices, setComboPrices] = useState(product.comboPrices || [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
      if (showSubCategoryDropdown && !event.target.closest('.subcategory-dropdown')) {
        setShowSubCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown, showSubCategoryDropdown]);

  // Update view mode when product changes
  useEffect(() => {
    setIsViewMode(product.viewMode || false)
  }, [product.viewMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('beforePrice', beforePrice) // Include beforePrice in form data
      formData.append('code', code)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('bestseller', bestseller)
      formData.append('comboPrices', JSON.stringify(comboPrices))
      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)
      if (reviewImage1) formData.append('reviewImage1', reviewImage1)
      if (reviewImage2) formData.append('reviewImage2', reviewImage2)
      if (reviewImage3) formData.append('reviewImage3', reviewImage3)

      const response = await axios.put(backendUrl + `/api/product/edit/${product._id}`, formData, { headers: { token } })
      console.log(response.data)
      if (response.data.success) {
        toast.success('Product updated successfully')
        onSuccess()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  // View Detail Component
  const ViewDetailSection = () => (
    <div className='p-6 space-y-6'>
      {/* Product Overview */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center'>
            <FaTag className='text-blue-600 text-2xl' />
          </div>
          <div>
            <h3 className='text-2xl font-bold text-gray-800'>{name}</h3>
            <p className='text-gray-600'>Product Code: {code}</p>
          </div>
          <div className='ml-auto'>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${bestseller ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
              {bestseller ? 'Bestseller' : 'Regular Product'}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-500 mb-1'>Current Price</div>
            <div className='text-2xl font-bold text-green-600'>₹{price}</div>
          </div>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-500 mb-1'>Original Price</div>
            <div className='text-xl font-semibold text-gray-600 line-through'>₹{beforePrice}</div>
          </div>
          <div className='bg-white p-4 rounded-lg border'>
            <div className='text-sm text-gray-500 mb-1'>Discount</div>
            <div className='text-lg font-semibold text-red-600'>
              {beforePrice > price ? `${Math.round(((beforePrice - price) / beforePrice) * 100)}% OFF` : 'No Discount'}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Basic Information */}
        <div className='bg-white border border-gray-200 rounded-xl p-6'>
          <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            Basic Information
          </h4>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-500 mb-1'>Product Name</label>
              <div className='text-gray-800 font-medium'>{name}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-500 mb-1'>Description</label>
              <div className='text-gray-700 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed'>{description}</div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-500 mb-1'>Product Code</label>
              <div className='text-gray-800 font-mono bg-gray-100 px-3 py-2 rounded-lg'>{code}</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className='bg-white border border-gray-200 rounded-xl p-6'>
          <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            Categories
          </h4>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-500 mb-1'>Main Category</label>
              <div className='inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
                {category}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-500 mb-1'>Sub Category</label>
              <div className='inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                {subCategory}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-500 mb-1'>Status</label>
              <div className='flex items-center gap-2'>
                {bestseller ? (
                  <FaCheckCircle className='text-green-500' />
                ) : (
                  <FaTimesCircle className='text-gray-400' />
                )}
                <span className={bestseller ? 'text-green-700' : 'text-gray-600'}>
                  {bestseller ? 'Bestseller Product' : 'Regular Product'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className='bg-white border border-gray-200 rounded-xl p-6'>
          <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
            Pricing Details
          </h4>

          <div className='space-y-4'>
            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <span className='text-gray-600'>Current Price:</span>
              <span className='text-2xl font-bold text-green-600'>₹{price}</span>
            </div>

            <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
              <span className='text-gray-600'>Original Price:</span>
              <span className='text-xl font-semibold text-gray-500 line-through'>₹{beforePrice}</span>
            </div>

            {beforePrice > price && (
              <div className='flex justify-between items-center p-3 bg-red-50 rounded-lg'>
                <span className='text-gray-600'>You Save:</span>
                <span className='text-lg font-bold text-red-600'>₹{beforePrice - price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Available Sizes */}
        <div className='bg-white border border-gray-200 rounded-xl p-6'>
          <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
            Available Sizes
          </h4>

          <div className='space-y-3'>
            <div className='flex flex-wrap gap-2'>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <div
                  key={size}
                  className={`px-4 py-2 rounded-lg font-medium ${sizes.includes(size)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {size}
                </div>
              ))}
            </div>

            <div className='text-sm text-gray-500 mt-2'>
              {sizes.length} size{sizes.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>

        {/* Combo Pricing */}
        {comboPrices && comboPrices.length > 0 && (
          <div className='bg-white border border-gray-200 rounded-xl p-6'>
            <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
              Combo Pricing
            </h4>

            <div className='space-y-3'>
              {comboPrices.map((combo, index) => (
                <div key={index} className='flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                  <div className='flex items-center gap-4'>
                    <div className='text-2xl font-bold text-yellow-600'>{combo.quantity}x</div>
                    <div>
                      <div className='text-lg font-semibold text-gray-800'>₹{combo.price} per item</div>
                      <div className='text-sm text-gray-600'>Total: ₹{combo.quantity * combo.price}</div>
                    </div>
                  </div>
                  {combo.discount > 0 && (
                    <div className='text-right'>
                      <div className='text-sm font-medium text-green-600'>{combo.discount}% OFF</div>
                      <div className='text-xs text-gray-500'>Save ₹{Math.round((combo.quantity * combo.price * combo.discount) / 100)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Images */}
      <div className='bg-white border border-gray-200 rounded-xl p-6'>
        <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
          <FaImage className='text-indigo-500' />
          Product Images
        </h4>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          {product.image.map((img, index) => (
            <div key={index} className='relative group'>
              <img
                src={img}
                alt={`Product Image ${index + 1}`}
                className='w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200'
              />
              <div className='absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10'>
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>

        <h4 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
          <FaStar className='text-yellow-500' />
          Review Images
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {product.reviewImage.map((img, index) => (
            <div key={index} className='relative group'>
              <img
                src={img}
                alt={`Review Image ${index + 1}`}
                className='w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-yellow-400 transition-all duration-200'
              />
              <div className='absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10'>
                Review {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-[10000]'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-20'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                {isViewMode ? <FaEye className='text-blue-600 text-xl' /> : <FaEdit className='text-blue-600 text-xl' />}
              </div>
              <div>
                <h2 className='text-2xl font-bold text-gray-800'>
                  {isViewMode ? 'Product Details' : 'Edit Product'}
                </h2>
                <p className='text-sm text-gray-500'>
                  {isViewMode ? 'View complete product information' : 'Update product information and images'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              {/* Toggle Button */}
              <button
                onClick={() => setIsViewMode(!isViewMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${isViewMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {isViewMode ? (
                  <>
                    <FaEdit />
                    Edit Mode
                  </>
                ) : (
                  <>
                    <FaEye />
                    View Details
                  </>
                )}
              </button>
              <button
                onClick={close}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
              >
                <FaTimes className='text-gray-500 text-xl' />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isViewMode ? (
          <ViewDetailSection />
        ) : (
          <>
            {/* Form Content */}
            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              {/* Basic Information Section */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Left Column - Basic Info */}
                <div className='space-y-6'>
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                      Basic Information
                    </h3>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Product Name</label>
                        <input
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                          type="text"
                          placeholder='Enter product name'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Product Description</label>
                        <textarea
                          onChange={(e) => setDescription(e.target.value)}
                          value={description}
                          rows={4}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none'
                          placeholder='Write product description here'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Product Code</label>
                        <input
                          onChange={(e) => setCode(e.target.value)}
                          value={code}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 uppercase'
                          type="text"
                          placeholder='Enter product code'
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      Pricing
                    </h3>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Current Price</label>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>₹</span>
                          <input
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                            type="number"
                            placeholder='399'
                          />
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Before Price</label>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>₹</span>
                          <input
                            onChange={(e) => setBeforePrice(e.target.value)}
                            value={beforePrice}
                            className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                            type="number"
                            placeholder='499'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Images */}
                <div className='space-y-6'>
                  {/* Product Images */}
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                      Product Images
                    </h3>

                    <div className='grid grid-cols-2 gap-3'>
                      {[
                        { id: 'image1', state: image1, setState: setImage1, fallback: product.image[0] },
                        { id: 'image2', state: image2, setState: setImage2, fallback: product.image[1] },
                        { id: 'image3', state: image3, setState: setImage3, fallback: product.image[2] },
                        { id: 'image4', state: image4, setState: setImage4, fallback: product.image[3] }
                      ].map((img, index) => (
                        <label key={img.id} htmlFor={img.id} className='group cursor-pointer'>
                          <div className='relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200'>
                            <img
                              className='w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200'
                              src={img.state ? URL.createObjectURL(img.state) : img.fallback}
                              alt={`Product Image ${index + 1}`}
                            />
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center z-10'>
                              <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                <FaEdit className='text-white text-xl' />
                              </div>
                            </div>
                          </div>
                          <input onChange={(e) => img.setState(e.target.files[0])} type="file" id={img.id} hidden accept="image/*" />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Review Images */}
                  <div className='bg-gray-50 p-4 rounded-xl'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                      Review Images
                    </h3>

                    <div className='grid grid-cols-3 gap-3'>
                      {[
                        { id: 'reviewImage1', state: reviewImage1, setState: setReviewImage1, fallback: product.reviewImage[0] },
                        { id: 'reviewImage2', state: reviewImage2, setState: setReviewImage2, fallback: product.reviewImage[1] },
                        { id: 'reviewImage3', state: reviewImage3, setState: setReviewImage3, fallback: product.reviewImage[2] }
                      ].map((img, index) => (
                        <label key={img.id} htmlFor={img.id} className='group cursor-pointer'>
                          <div className='relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all duration-200'>
                            <img
                              className='w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200'
                              src={img.state ? URL.createObjectURL(img.state) : img.fallback}
                              alt={`Review Image ${index + 1}`}
                            />
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center z-10'>
                              <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                <FaEdit className='text-white text-lg' />
                              </div>
                            </div>
                          </div>
                          <input onChange={(e) => img.setState(e.target.files[0])} type="file" id={img.id} hidden accept="image/*" />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Combo Pricing Section */}
              <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>

                {/* Combo Pricing Section */}
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    Combo Pricing
                  </h3>

                  <div className='space-y-4'>
                    <p className='text-sm text-gray-600 mb-4'>
                      Set special pricing for bulk purchases. Customers will get better deals when buying multiple items.
                    </p>

                    {comboPrices.map((combo, index) => (
                      <div key={index} className='flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200'>
                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Quantity</label>
                          <input
                            type='number'
                            min='2'
                            value={combo.quantity === 0 ? '' : combo.quantity}
                            onChange={(e) => {
                              const newComboPrices = [...comboPrices];
                              newComboPrices[index].quantity = parseInt(e.target.value) || 2;
                              setComboPrices(newComboPrices);
                            }}
                            onFocus={(e) => {
                              if (e.target.value === '0' || e.target.value === '') {
                                e.target.value = '';
                              }
                            }}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='2'
                          />
                        </div>
                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Price per item (₹)</label>
                          <input
                            type='number'
                            min='1'
                            value={combo.price === 0 ? '' : combo.price}
                            onChange={(e) => {
                              const newComboPrices = [...comboPrices];
                              const comboPrice = parseInt(e.target.value) || 0;
                              newComboPrices[index].price = comboPrice;

                              // Auto-calculate discount percentage
                              if (comboPrice > 0 && beforePrice > 0) {
                                const calculatedDiscount = Math.round(((beforePrice - comboPrice) / beforePrice) * 100);
                                newComboPrices[index].discount = Math.max(0, calculatedDiscount);
                              }

                              setComboPrices(newComboPrices);
                            }}
                            onFocus={(e) => {
                              if (e.target.value === '0' || e.target.value === '') {
                                e.target.value = '';
                              }
                            }}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='499'
                          />
                        </div>
                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Discount % (Auto-calculated)</label>
                          <input
                            type='number'
                            min='0'
                            max='100'
                            value={combo.discount === 0 ? '' : combo.discount}
                            onChange={(e) => {
                              const newComboPrices = [...comboPrices];
                              newComboPrices[index].discount = parseInt(e.target.value) || 0;

                              // Auto-calculate price based on discount
                              if (beforePrice > 0) {
                                const calculatedPrice = Math.round(beforePrice * (1 - newComboPrices[index].discount / 100));
                                newComboPrices[index].price = Math.max(1, calculatedPrice);
                              }

                              setComboPrices(newComboPrices);
                            }}
                            onFocus={(e) => {
                              if (e.target.value === '0' || e.target.value === '') {
                                e.target.value = '';
                              }
                            }}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
                            placeholder='10'
                          />
                          <div className='text-xs text-gray-500 mt-1'>
                            Auto-calculated from original price: ₹{beforePrice}
                            {combo.discount > 0 && (
                              <span className='ml-2 text-green-600 font-medium'>
                                (Save ₹{Math.round((beforePrice - combo.price) * combo.quantity)} for {combo.quantity} items)
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={() => {
                            const newComboPrices = comboPrices.filter((_, i) => i !== index);
                            setComboPrices(newComboPrices);
                          }}
                          className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <button
                      type='button'
                      onClick={() => {
                        setComboPrices([...comboPrices, { quantity: 2, price: 0, discount: 0 }]);
                      }}
                      className='w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                      </svg>
                      Add Combo Pricing
                    </button>
                  </div>
                </div>
              </div>

              {/* Category and Settings Section */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

                {/* Categories */}
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-indigo-500 rounded-full'></div>
                    Categories
                  </h3>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className="relative category-dropdown">
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                      <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                          <div className="py-1">
                            {[
                              { value: 'Men', label: 'Men', color: 'bg-blue-500' },
                              { value: 'Women', label: 'Women', color: 'bg-pink-500' }
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setCategory(option.value);
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 ${category === option.value ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'
                                  }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                                <span className="font-medium">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative subcategory-dropdown">
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Sub Category</label>
                      <button
                        onClick={() => setShowSubCategoryDropdown(!showSubCategoryDropdown)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium text-gray-700">{subCategory}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showSubCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showSubCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {[
                              { value: 'Customtshirt', label: 'Custom T-shirt', color: 'bg-green-500' },
                              { value: 'Oversizedtshirt', label: 'Over Sized T-shirt', color: 'bg-blue-500' },
                              { value: 'Solidoversized', label: 'Solid Oversized T-shirt', color: 'bg-purple-500' },
                              { value: 'Quotesdesigns', label: 'Quotes Designs', color: 'bg-orange-500' },
                              { value: 'Plaintshirt', label: 'Plain T-shirt', color: 'bg-gray-500' },
                              { value: 'Polotshirt', label: 'Polo T-shirt', color: 'bg-indigo-500' },
                              { value: 'Acidwash', label: 'Acid Wash', color: 'bg-yellow-500' },
                              { value: 'Hoddies', label: 'Hoddies', color: 'bg-red-500' },
                              { value: 'Sweattshirts', label: 'Sweat T-shirt', color: 'bg-teal-500' }
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSubCategory(option.value);
                                  setShowSubCategoryDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 ${subCategory === option.value ? 'bg-green-50 text-green-700 border-r-2 border-green-500' : 'text-gray-700'
                                  }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                                <span className="font-medium">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sizes and Settings */}
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                    Sizes & Settings
                  </h3>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-3'>Available Sizes</label>
                      <div className='flex flex-wrap gap-2'>
                        {['S', 'M', 'L', 'XL'].map((size) => (
                          <button
                            key={size}
                            type='button'
                            onClick={() => setSizes(prev =>
                              prev.includes(size)
                                ? prev.filter(item => item !== size)
                                : [...prev, size]
                            )}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${sizes.includes(size)
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className='flex items-center gap-3 pt-2'>
                      <input
                        onChange={() => setBestseller(prev => !prev)}
                        checked={bestseller}
                        type="checkbox"
                        id="bestseller"
                        className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                      />
                      <label className='cursor-pointer font-medium text-gray-700' htmlFor="bestseller">
                        Add to bestseller collection
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer with Action Buttons */}
            <div className='sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl z-20'>
              <div className='flex justify-end gap-3'>
                <button
                  onClick={close}
                  className='px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className='px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2'
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EditProductModal