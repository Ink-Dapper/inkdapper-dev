import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import CouponSection from '../components/CouponSection'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from '../utils/axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, getCreditScore, creditPoints, validateCoupon, removeCoupon, appliedCoupon, couponDiscount, clearCart, getFinalAmount } = useContext(ShopContext)
  const [creditPtsVisible, setCreditPtsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const initPay = (order, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log('Razorpay response:', response);
        try {
          const { data } = await axios.post(backendUrl + '/api/order/verify-razorpay', { ...response, ...orderData, razorpay_order_id: order.id }, { headers: { token } });
          if (data.success) {
            console.log('Verification successful:', data);
            clearCart();
            navigate('/orders');
            toast.success('Payment successful');
          } else {
            console.log('Verification failed:', data);
            navigate('/place-order');
            toast.error('Payment failed, please try again');
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast.error('Payment failed');
        }
      },
      prefill: {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.street + ', ' + formData.city + ', ' + formData.state + ', ' + formData.zipcode + ', ' + formData.country,
      },
      theme: {
        color: '#F37254',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getFinalAmount() + (typeof delivery_fee === 'number' ? delivery_fee : 0) - (creditPtsVisible ? creditPoints : 0)
      }

      if (creditPtsVisible) {
        await axios.post(backendUrl + '/api/order/credit-clear', {}, { headers: { token } })
        console.log('Credit is cleared')
      } else {
        console.log('Credit is not cleared')
      }

      switch (method) {
        //API calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            clearCart()
            navigate('/orders')
            toast.success('Order placed successfully')
          } else {
            toast.error(response.data.message)
          }
          break;

        case 'razorpay':
          const razorpayResponse = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
          if (razorpayResponse.data.success) {
            initPay(razorpayResponse.data.order, orderData)
            console.log(razorpayResponse.data.order)
          }

          break;

        default:
          break
      }

    } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCreditScore()
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={onSubmitHandler} className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          <h1 className="sr-only">Place Order</h1>

          {/* Left Side - Delivery Information */}
          <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                  Delivery Information
                </h2>
              </div>
              <p className='text-gray-600 text-sm'>Please provide your delivery details</p>
            </div>

            <div className='space-y-6'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>First Name</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='firstName'
                    value={formData.firstName}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                    placeholder='Enter first name'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Last Name</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='lastName'
                    value={formData.lastName}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                    placeholder='Enter last name'
                  />
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Email Address</label>
                <input
                  required
                  onChange={onChangeHandler}
                  name='email'
                  value={formData.email}
                  type="email"
                  className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                  placeholder='Enter email address'
                />
              </div>

              {/* Street Address */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Street Address</label>
                <input
                  required
                  onChange={onChangeHandler}
                  name='street'
                  value={formData.street}
                  type="text"
                  className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                  placeholder='Enter street address'
                />
              </div>

              {/* City and State */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>City</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='city'
                    value={formData.city}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                    placeholder='Enter city'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>State</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='state'
                    value={formData.state}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                    placeholder='Enter state'
                  />
                </div>
              </div>

              {/* Zipcode and Country */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Zipcode</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='zipcode'
                    value={formData.zipcode}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                    placeholder='Enter zipcode'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Country</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='country'
                    value={formData.country}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                    placeholder='Enter country'
                  />
                </div>
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Phone Number</label>
                <input
                  required
                  onChange={onChangeHandler}
                  name='phone'
                  value={formData.phone}
                  type="text"
                  className='w-full px-4 py-3 border-2 border-gray-400 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50'
                  placeholder='Enter phone number'
                />
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary & Payment */}
          <div className='space-y-6'>
            {/* Order Summary */}
            <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
              <CartTotal
                creditPtsVisible={creditPtsVisible}
                setCreditPtsVisible={setCreditPtsVisible}
              />
            </div>

            {/* Coupon Section */}
            <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
              <CouponSection />
            </div>

            {/* Payment Method */}
            <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
              <div className='mb-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                    Payment Method
                  </h3>
                </div>
                <p className='text-gray-600 text-sm'>Choose your preferred payment option</p>
              </div>

              <div className='space-y-4'>
                {/* Razorpay Option */}
                <div
                  onClick={() => setMethod('razorpay')}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${method === 'razorpay'
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                >
                  <div className='flex items-center gap-4'>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'razorpay' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                      {method === 'razorpay' && (
                        <div className='w-2 h-2 bg-white rounded-full'></div>
                      )}
                    </div>
                    <img src={assets.razorpay_logo} alt="razorpay_logo" className='h-6' />
                    <span className={`font-medium ${method === 'razorpay' ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                      Pay Online
                    </span>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setMethod('cod')}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${method === 'cod'
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                >
                  <div className='flex items-center gap-4'>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                      {method === 'cod' && (
                        <div className='w-2 h-2 bg-white rounded-full'></div>
                      )}
                    </div>
                    <div className='flex items-center gap-3'>
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={`font-medium ${method === 'cod' ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                        Cash on Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Place Order
              </button>
              <p className='text-xs text-gray-500 text-center mt-3'>
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder