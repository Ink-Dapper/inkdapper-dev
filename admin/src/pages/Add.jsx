import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [reviewImage1, setReviewImage1] = useState(false);
  const [reviewImage2, setReviewImage2] = useState(false);
  const [reviewImage3, setReviewImage3] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(599);
  const [beforePrice, setBeforePrice] = useState(699);
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Customtshirt');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the product list and set the default product code
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`, {
          headers: { token },
        });

        if (response.data.success) {
          const productList = response.data.products;
          if (productList.length > 0) {
            const lastProduct = productList[productList.length - 1];
            const lastCode = lastProduct.code;
            const match = lastCode.match(/(\d+)$/);
            const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
            const newCode = `O001BL05-S${String(nextNumber).padStart(4, '0')}`;
            setCode(newCode);
          } else {
            setCode('O001BL05-S0001');
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch product list.');
      }
    };

    fetchProductList();
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('beforePrice', beforePrice);
      formData.append('category', category);
      formData.append('code', code);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      reviewImage1 && formData.append('reviewImage1', reviewImage1);
      reviewImage2 && formData.append('reviewImage2', reviewImage2);
      reviewImage3 && formData.append('reviewImage3', reviewImage3);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setReviewImage1(false);
        setReviewImage2(false);
        setReviewImage3(false);
        setPrice('');
        setBeforePrice('');
        setCode('');
        setSizes('');
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">Create and upload a new product to your store</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[1, 2, 3, 4].map((num) => (
                <label key={num} htmlFor={`image${num}`} className="group cursor-pointer">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-blue-50">
                    <img
                      className="w-full h-20 object-cover rounded-md"
                      src={eval(`!image${num}`) ? assets.upload_area : URL.createObjectURL(eval(`image${num}`))}
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">Image {num}</p>
                  </div>
                  <input onChange={(e) => eval(`setImage${num}(e.target.files[0])`)} type="file" id={`image${num}`} hidden accept="image/*" />
                </label>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[1, 2, 3].map((num) => (
                  <label key={num} htmlFor={`reviewImage${num}`} className="group cursor-pointer">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-green-400 transition-colors duration-200 bg-gray-50 hover:bg-green-50">
                      <img
                        className="w-full h-24 object-cover rounded-md"
                        src={eval(`!reviewImage${num}`) ? assets.upload_area : URL.createObjectURL(eval(`reviewImage${num}`))}
                        alt=""
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">Review {num}</p>
                    </div>
                    <input onChange={(e) => eval(`setReviewImage${num}(e.target.files[0])`)} type="file" id={`reviewImage${num}`} hidden accept="image/*" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  type="text"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Code *</label>
                <input
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 uppercase font-mono"
                  type="text"
                  placeholder="Product code"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                rows="4"
                placeholder="Describe your product..."
                required
              />
            </div>
          </div>

          {/* Category & Pricing Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Category & Pricing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <FormControl fullWidth size="small">
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: '#3B82F6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3B82F6',
                        },
                      },
                    }}>
                    <MenuItem value="Men">Men</MenuItem>
                    <MenuItem value="Women">Women</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                <FormControl fullWidth size="small">
                  <Select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="rounded-lg"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: '#3B82F6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3B82F6',
                        },
                      },
                    }}>
                    <MenuItem value="Customtshirt">Custom T-shirt</MenuItem>
                    <MenuItem value="Oversizedtshirt">Over Sized T-shirt</MenuItem>
                    <MenuItem value="Solidoversized">Solid Oversized T-shirt</MenuItem>
                    <MenuItem value="Quotesdesigns">Quotes Designs</MenuItem>
                    <MenuItem value="Plaintshirt">Plain T-shirt</MenuItem>
                    <MenuItem value="Polotshirt">Polo T-shirt</MenuItem>
                    <MenuItem value="Acidwash">Acid Wash</MenuItem>
                    <MenuItem value="Hoddies">Hoddies</MenuItem>
                    <MenuItem value="Sweattshirts">Sweat T-shirt</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (₹)</label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  type="number"
                  placeholder="599"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                <input
                  onChange={(e) => setBeforePrice(e.target.value)}
                  value={beforePrice}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  type="number"
                  placeholder="699"
                />
              </div>
            </div>
          </div>

          {/* Sizes & Options Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Sizes & Options</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${sizes.includes(size)
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                onChange={() => setBestseller(prev => !prev)}
                checked={bestseller}
                type="checkbox"
                id="bestseller"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="cursor-pointer text-sm font-medium text-gray-700" htmlFor="bestseller">
                Mark as Bestseller
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;