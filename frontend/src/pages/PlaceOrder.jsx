import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import CouponSection from '../components/CouponSection'
import CartProductsDisplay from '../components/CartProductsDisplay'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import apiInstance from '../utils/axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, getCreditScore, creditPoints, validateCoupon, removeCoupon, appliedCoupon, couponDiscount, clearCart, getFinalAmount, paymentMethod, updatePaymentMethod, getShippingMessage } = useContext(ShopContext)
  const [creditPtsVisible, setCreditPtsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
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

  const handlePaymentMethodChange = (newMethod) => {
    setMethod(newMethod)
    updateShippingFee(newMethod)
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
          const { data } = await apiInstance.post('/order/verify-razorpay', { ...response, ...orderData, razorpay_order_id: order.id });
          if (data.success) {
            console.log('Verification successful:', data);
            clearCart();
            navigate('/thank-you');
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

    // Prevent multiple submissions
    if (isLoading) return

    // Check if user is authenticated
    if (!token) {
      toast.error('Please login to place an order.')
      navigate('/login')
      return
    }

    // Validate cart is not empty
    const hasItems = Object.values(cartItems).some(item =>
      Object.values(item).some(quantity => quantity > 0)
    )

    if (!hasItems) {
      toast.error('Your cart is empty. Please add items before placing an order.')
      return
    }

    // Validate required form fields
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']
    const missingFields = requiredFields.filter(field => !formData[field]?.trim())

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields.')
      return
    }

    setIsLoading(true)

    try {
      console.log('Starting order process...')
      console.log('Cart items:', cartItems)
      console.log('Products:', products)
      console.log('Token:', token ? 'Present' : 'Missing')

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

      console.log('Order items:', orderItems)

      if (orderItems.length === 0) {
        toast.error('No valid items found in cart.')
        return
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getFinalAmount() + delivery_fee - (creditPtsVisible ? creditPoints : 0)
      }

      console.log('Order data:', orderData)

      if (creditPtsVisible) {
        await apiInstance.post('/order/credit-clear', {})
        console.log('Credit is cleared')
      } else {
        console.log('Credit is not cleared')
      }

      switch (paymentMethod) {
        //API calls for COD
        case 'cod':
          const response = await apiInstance.post('/order/place', orderData)
          if (response.data.success) {
            clearCart()
            navigate('/thank-you')
            toast.success('Order placed successfully')
          } else {
            toast.error(response.data.message)
          }
          break;

        case 'razorpay':
          const razorpayResponse = await apiInstance.post('/order/razorpay', orderData)
          if (razorpayResponse.data.success) {
            initPay(razorpayResponse.data.order, orderData)
            console.log(razorpayResponse.data.order)
          } else {
            toast.error(razorpayResponse.data.message || 'Failed to initialize payment')
          }
          break;

        default:
          console.log('Unknown payment method:', method)
          toast.error('Please select a valid payment method')
          break
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message || 'An error occurred while placing the order')
    }
  }

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      toast.error('Please login to place an order.')
      navigate('/login')
      return
    }

    // Only initialize once to prevent multiple API calls
    if (!isInitialized) {
      setIsInitialized(true);
      getUserCart(token)
      getCreditScore()
      // Initialize shipping fee based on default method (COD)
      updateShippingFee('cod')
    }
  }, [token, navigate, getUserCart, getCreditScore, isInitialized, updateShippingFee]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={onSubmitHandler} className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          <h1 className="sr-only">Place Order</h1>

          {/* Left Side - Delivery Information */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100'>
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600  bg-clip-text text-transparent'>
                  Delivery Information
                </h2>
              </div>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>Please provide your delivery details</p>
            </div>

            <div className='space-y-6 mb-6'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>First Name</label>
                  <input
                    id="firstName"
                    required
                    onChange={onChangeHandler}
                    name='firstName'
                    value={formData.firstName}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    placeholder='Enter first name'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Last Name</label>
                  <input
                    id="lastName"
                    required
                    onChange={onChangeHandler}
                    name='lastName'
                    value={formData.lastName}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    placeholder='Enter last name'
                  />
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Email Address</label>
                <input
                  id="email"
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
                  id="street"
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
                    id="city"
                    required
                    onChange={onChangeHandler}
                    name='city'
                    value={formData.city}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    placeholder='Enter city'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>State</label>
                  <input
                    id="state"
                    required
                    onChange={onChangeHandler}
                    name='state'
                    value={formData.state}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    placeholder='Enter state'
                  />
                </div>
              </div>

              {/* Zipcode and Country */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Zipcode</label>
                  <input
                    id="zipcode"
                    required
                    onChange={onChangeHandler}
                    name='zipcode'
                    value={formData.zipcode}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    placeholder='Enter zipcode'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Country</label>
                  <input
                    id="country"
                    required
                    onChange={onChangeHandler}
                    name='country'
                    value={formData.country}
                    type="text"
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    placeholder='Enter country'
                  />
                </div>
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Phone Number</label>
                <input
                  id="phone"
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

            {/* Cart Products Display */}
            <div className='overflow-hidden'>
              <CartProductsDisplay />
            </div>
          </div>

          {/* Right Side - Order Summary & Payment */}
          <div className='space-y-6'>
            {/* Order Summary */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 '>
              <CartTotal
                creditPtsVisible={creditPtsVisible}
                setCreditPtsVisible={setCreditPtsVisible}
              />
            </div>

            {/* Coupon Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 '>
              <CouponSection />
            </div>

            {/* Payment Method */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 '>
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
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 my-2'>
                  <div className='flex items-start gap-2'>
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className='text-blue-800 text-xs font-medium'>Shipping Information</p>
                      <p className='text-blue-700 text-xs mt-1'>
                        • Online payments: <span className='font-semibold'>Free shipping</span> (₹0.00)
                      </p>
                      <p className='text-blue-700 text-xs'>
                        • Cash on Delivery: <span className='font-semibold'>Shipping charges apply</span> (₹49.00)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                {/* Razorpay Option */}
                <div
                  onClick={() => updatePaymentMethod('razorpay')}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'razorpay'
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                >
                  <div className='flex items-center gap-4'>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                      {paymentMethod === 'razorpay' && (
                        <div className='w-2 h-2 bg-white rounded-full'></div>
                      )}
                    </div>
                    <img src={assets.razorpay_logo} alt="razorpay_logo" className='h-6' />
                    <span className={`font-medium ${paymentMethod === 'razorpay' ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                      Pay Online
                    </span>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => updatePaymentMethod('cod')}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                >
                  <div className='flex items-center gap-4'>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                      {paymentMethod === 'cod' && (
                        <div className='w-2 h-2 bg-white rounded-full'></div>
                      )}
                    </div>
                    <div className='flex items-center gap-3'>
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={`font-medium ${paymentMethod === 'cod' ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                        Cash on Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-bold text-blue-800'>Shipping Information</h4>
                    <p className='text-xs text-blue-700'>{getShippingMessage()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 '>
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full font-semibold py-4 px-6 rounded-xl transform transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${isLoading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-[1.02] hover:shadow-xl'
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Place Order
                  </>
                )}
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