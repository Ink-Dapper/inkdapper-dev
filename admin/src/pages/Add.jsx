import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const Add = ({ token }) => {
  const navigate = useNavigate();
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
  const [comboPrices, setComboPrices] = useState([]);
  const [colors, setColors] = useState([]);

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
      formData.append('comboPrices', JSON.stringify(comboPrices));
      formData.append('colors', JSON.stringify(colors));

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
        setComboPrices([]);
        setColors([]);

        // Navigate to the list page after successful product creation
        setTimeout(() => {
          navigate('/list');
        }, 1500); // Small delay to show the success message
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

          {/* Combo Pricing Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Combo Pricing</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Set special pricing for bulk purchases. Customers will get better deals when buying multiple items.
              </p>

              {comboPrices.map((combo, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="2"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per item (₹)</label>
                    <input
                      type="number"
                      min="1"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="499"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount % (Auto-calculated)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="10"
                      readOnly={false}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Auto-calculated from original price: ₹{beforePrice}
                      {combo.discount > 0 && (
                        <span className="ml-2 text-green-600 font-medium">
                          (Save ₹{Math.round((beforePrice - combo.price) * combo.quantity)} for {combo.quantity} items)
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newComboPrices = comboPrices.filter((_, i) => i !== index);
                      setComboPrices(newComboPrices);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setComboPrices([...comboPrices, { quantity: 2, price: 0, discount: 0 }]);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Combo Pricing
              </button>
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

          {/* Color Options Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Color Options</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Colors</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { name: 'Black', hex: '#000000' },
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Red', hex: '#EF4444' },
                  { name: 'Blue', hex: '#3B82F6' },
                  { name: 'Green', hex: '#10B981' },
                  { name: 'Yellow', hex: '#F59E0B' },
                  { name: 'Purple', hex: '#8B5CF6' },
                  { name: 'Pink', hex: '#EC4899' },
                  { name: 'Orange', hex: '#F97316' },
                  { name: 'Gray', hex: '#6B7280' },
                  { name: 'Navy', hex: '#1E40AF' },
                  { name: 'Brown', hex: '#92400E' }
                ].map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setColors(prev =>
                      prev.includes(color.name)
                        ? prev.filter(item => item !== color.name)
                        : [...prev, color.name]
                    )}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${colors.includes(color.name)
                      ? 'border-blue-500 shadow-lg transform scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div
                      className="w-full h-12 rounded-md mb-2 border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.hex === '#FFFFFF' && (
                        <div className="w-full h-full border border-gray-300 rounded-md"></div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-center">{color.name}</p>
                    {colors.includes(color.name) && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {colors.length > 0 ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Colors:</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((colorName) => {
                    const colorData = [
                      { name: 'Black', hex: '#000000' },
                      { name: 'White', hex: '#FFFFFF' },
                      { name: 'Red', hex: '#EF4444' },
                      { name: 'Blue', hex: '#3B82F6' },
                      { name: 'Green', hex: '#10B981' },
                      { name: 'Yellow', hex: '#F59E0B' },
                      { name: 'Purple', hex: '#8B5CF6' },
                      { name: 'Pink', hex: '#EC4899' },
                      { name: 'Orange', hex: '#F97316' },
                      { name: 'Gray', hex: '#6B7280' },
                      { name: 'Navy', hex: '#1E40AF' },
                      { name: 'Brown', hex: '#92400E' }
                    ].find(c => c.name === colorName);

                    return (
                      <span
                        key={colorName}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colorData?.hex || '#000000' }}
                        ></div>
                        {colorName}
                        <button
                          type="button"
                          onClick={() => setColors(prev => prev.filter(c => c !== colorName))}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">No color options selected</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Click on the color options above to select available colors for this product</p>
              </div>
            )}
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