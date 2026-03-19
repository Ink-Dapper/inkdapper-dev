import React, { useContext, useEffect, useRef, useState } from 'react'
import CartTotal from '../components/CartTotal'
import CouponSection from '../components/CouponSection'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import apiInstance from '../utils/axios'
import { toast } from 'react-toastify'
import CheckoutProgress from '../components/CheckoutProgress'

const PlaceOrder = () => {
  const {
    navigate,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    getCreditScore,
    creditPoints,
    validateCoupon,
    removeCoupon,
    appliedCoupon,
    couponDiscount,
    clearCart,
    getFinalAmount,
    paymentMethod,
    setPaymentMethod,
    getShippingCharges,
    customDataArray
  } = useContext(ShopContext)

  const [creditPtsVisible, setCreditPtsVisible] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const redirectTimeoutRef = useRef(null)
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

  const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`

  const escapeHtml = (text) => String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  const buildReceiptData = (orderData, methodLabel) => {
    const shipping = getShippingCharges()
    const creditUsed = creditPtsVisible ? creditPoints : 0
    const itemsSubtotal = orderData.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
    const discount = Math.max(0, itemsSubtotal + shipping - creditUsed - orderData.amount)

    return {
      receiptNo: `ID-${Date.now().toString().slice(-8)}`,
      date: new Date(),
      paymentMethod: methodLabel,
      items: orderData.items,
      address: orderData.address,
      subtotal: itemsSubtotal,
      shipping,
      discount,
      creditUsed,
      total: orderData.amount
    }
  }

  const showThankYouAndRedirect = ({
    message = 'Thank you! Your order has been placed successfully.',
    receipt = null
  } = {}) => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current)
    }

    setReceiptData(receipt)
    setShowThankYou(true)
    toast.success(message)

    redirectTimeoutRef.current = setTimeout(() => {
      setShowThankYou(false)
      setReceiptData(null)
      navigate('/orders')
    }, 20000)
  }

  const closeReceiptDialog = () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = null
    }
    setShowThankYou(false)
    setReceiptData(null)
    navigate('/orders')
  }

  const downloadReceiptPdf = () => {
    if (!receiptData) return

    const itemsHtml = (receiptData.items || [])
      .map((item) => `
        <tr>
          <td style="padding:6px 0;">${escapeHtml(item.name)} (${escapeHtml(item.size)}) x ${escapeHtml(item.quantity)}</td>
          <td style="padding:6px 0; text-align:right;">${escapeHtml(formatCurrency((item.price || 0) * (item.quantity || 0)))}</td>
        </tr>
      `)
      .join('')

    const popup = window.open('', '_blank', 'width=900,height=700')
    if (!popup) {
      toast.error('Enable popups to download receipt PDF.')
      return
    }

    popup.document.write(`
      <html>
        <head>
          <title>Receipt ${escapeHtml(receiptData.receiptNo)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 28px; color: #1f2937; }
            h1 { margin: 0 0 14px; letter-spacing: 2px; text-align:center; }
            .row { display: flex; justify-content: space-between; margin: 4px 0; }
            .box { border-top: 1px dashed #94a3b8; border-bottom: 1px dashed #94a3b8; padding: 10px 0; margin: 12px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            .total { font-size: 16px; font-weight: bold; border-top: 1px solid #64748b; padding-top: 8px; margin-top: 8px; }
            .small { font-size: 12px; color: #475569; line-height: 1.5; }
          </style>
        </head>
        <body>
          <h1>RECEIPT</h1>
          <div class="row"><span>Receipt No</span><strong>${escapeHtml(receiptData.receiptNo)}</strong></div>
          <div class="row"><span>Date</span><strong>${escapeHtml(new Date(receiptData.date).toLocaleString())}</strong></div>
          <div class="row"><span>Payment</span><strong>${escapeHtml(receiptData.paymentMethod)}</strong></div>
          <div class="box">
            <table>
              ${itemsHtml}
            </table>
          </div>
          <div class="row"><span>Subtotal</span><span>${escapeHtml(formatCurrency(receiptData.subtotal))}</span></div>
          <div class="row"><span>Shipping</span><span>${escapeHtml(formatCurrency(receiptData.shipping))}</span></div>
          ${Number(receiptData.discount) > 0 ? `<div class="row"><span>Discount</span><span>- ${escapeHtml(formatCurrency(receiptData.discount))}</span></div>` : ''}
          ${Number(receiptData.creditUsed) > 0 ? `<div class="row"><span>Credit Used</span><span>- ${escapeHtml(formatCurrency(receiptData.creditUsed))}</span></div>` : ''}
          <div class="row total"><span>Total</span><span>${escapeHtml(formatCurrency(receiptData.total))}</span></div>
          <div class="box small">
            <div><strong>Billing Address</strong></div>
            <div>${escapeHtml(receiptData.address?.firstName)} ${escapeHtml(receiptData.address?.lastName)}, ${escapeHtml(receiptData.address?.street)}</div>
            <div>${escapeHtml(receiptData.address?.city)}, ${escapeHtml(receiptData.address?.state)} - ${escapeHtml(receiptData.address?.zipcode)}, ${escapeHtml(receiptData.address?.country)}</div>
            <div>Phone: ${escapeHtml(receiptData.address?.phone)} | Email: ${escapeHtml(receiptData.address?.email)}</div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `)
    popup.document.close()
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
        console.log('Razorpay response:', response)
        try {
          const { data } = await apiInstance.post('/order/verify-razorpay', { ...response, ...orderData, razorpay_order_id: order.id })
          if (data.success) {
            console.log('Verification successful:', data)
            const receipt = buildReceiptData(orderData, 'Online (Razorpay)')
            clearCart()
            showThankYouAndRedirect({
              message: 'Thank you! Your payment was successful and your order has been placed.',
              receipt
            })
          } else {
            console.log('Verification failed:', data)
            navigate('/place-order')
            toast.error('Payment failed, please try again')
          }
        } catch (error) {
          console.error('Verification error:', error)
          toast.error('Payment failed')
        }
      },
      prefill: {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: formData.street + ', ' + formData.city + ', ' + formData.state + ', ' + formData.zipcode + ', ' + formData.country
      },
      theme: {
        color: '#F37254'
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const orderItems = []
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
      // Include custom design items in the order
      customDataArray.forEach(customItem => {
        orderItems.push({
          name: customItem.name,
          size: customItem.size,
          quantity: Number(customItem.quantity),
          price: customItem.price,
          reviewImageCustom: customItem.reviewImageCustom,
          aiDesignUrl: customItem.aiDesignUrl || null,
          rawDesignUrl: customItem.rawDesignUrl || null,
          isCustom: true,
        })
      })

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getFinalAmount() + getShippingCharges() - (creditPtsVisible ? creditPoints : 0)
      }

      if (creditPtsVisible) {
        await axios.post(backendUrl + '/api/order/credit-clear', {}, { headers: { token } })
        console.log('Credit is cleared')
      } else {
        console.log('Credit is not cleared')
      }

      switch (paymentMethod) {
        case 'cod':
          const response = await apiInstance.post('/order/place', orderData)
          if (response.data.success) {
            const receipt = buildReceiptData(orderData, 'Cash on Delivery')
            clearCart()
            showThankYouAndRedirect({
              message: 'Thank you! Your order has been placed successfully.',
              receipt
            })
          } else {
            toast.error(response.data.message)
          }
          break

        case 'razorpay':
          const razorpayResponse = await apiInstance.post('/order/razorpay', orderData)
          if (razorpayResponse.data.success) {
            initPay(razorpayResponse.data.order, orderData)
            console.log(razorpayResponse.data.order)
          }
          break

        default:
          break
      }
    } catch (error) {
      console.log('Place order error:', error)
      const message = error.response?.data?.message || error.message || 'Something went wrong while placing your order'
      toast.error(message)
    }
  }

  useEffect(() => {
    getCreditScore()
  }, [])

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    }
  }, [])

  return (
    <>
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="rounded-2xl p-3 sm:p-4" style={{ background: '#38b2ac' }}>
              <div className="relative bg-white text-slate-700 mx-auto max-w-md shadow-2xl overflow-hidden">
                <div className="h-4" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 8px, transparent 8px, transparent 16px)', backgroundSize: '16px 16px', backgroundColor: '#e2e8f0' }} />
                <div className="px-5 sm:px-6 py-5">
                  <h2 className="text-center text-4xl sm:text-5xl font-black tracking-wide text-slate-700">RECEIPT</h2>
                  <div className="my-3 border-t-2 border-slate-500" />
                  <div className="text-xs sm:text-sm space-y-1">
                    <div className="flex justify-between gap-3">
                      <span className='text-slate-600'>Receipt No</span>
                      <span className="font-semibold text-slate-600">{receiptData?.receiptNo}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className='text-slate-600'>Date</span>
                      <span className="font-semibold text-slate-600">
                        {receiptData?.date ? new Date(receiptData.date).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className='text-slate-600'>Payment</span>
                      <span className="font-semibold text-slate-600">{receiptData?.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-dashed border-slate-400" />

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(receiptData?.items || []).map((item, index) => (
                      <div key={`${item._id}-${item.size}-${index}`} className="text-xs sm:text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="truncate text-slate-600">
                            {item.name} ({item.size}) x {item.quantity}
                          </span>
                          <span className="font-semibold whitespace-nowrap text-slate-600">
                            {formatCurrency((item.price || 0) * (item.quantity || 0))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="my-4 border-t border-dashed border-slate-400" />

                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className='text-slate-600'>Subtotal</span>
                      <span className='text-slate-600'>{formatCurrency(receiptData?.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className='text-slate-600'>Shipping</span>
                      <span className='text-slate-600'>{formatCurrency(receiptData?.shipping)}</span>
                    </div>
                    {Number(receiptData?.discount) > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span className='text-slate-600'>Discount</span>
                        <span className='text-slate-600'>- {formatCurrency(receiptData?.discount)}</span>
                      </div>
                    )}
                    {Number(receiptData?.creditUsed) > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span className='text-slate-600'>Credit Used</span>
                        <span className='text-slate-600'>- {formatCurrency(receiptData?.creditUsed)}</span>
                      </div>
                    )}
                    <div className="pt-1 mt-1 border-t border-slate-400 flex justify-between text-base sm:text-lg font-extrabold">
                      <span className='text-slate-600'>Total</span>
                      <span className='text-slate-600'>{formatCurrency(receiptData?.total)}</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-dashed border-slate-400" />

                  <div className="text-[11px] sm:text-xs leading-relaxed">
                    <p className="font-semibold text-slate-800">Billing Address</p>
                    <p className='text-slate-600'>
                      {receiptData?.address?.firstName} {receiptData?.address?.lastName}, {receiptData?.address?.street},{' '}
                      {receiptData?.address?.city}, {receiptData?.address?.state} - {receiptData?.address?.zipcode},{' '}
                      {receiptData?.address?.country}
                    </p>
                    <p className='text-slate-600'>Phone: {receiptData?.address?.phone}</p>
                    <p className='text-slate-600'>Email: {receiptData?.address?.email}</p>
                  </div>

                  <div className="mt-4 h-12 rounded" style={{ background: 'repeating-linear-gradient(90deg, #1f2937 0, #1f2937 2px, transparent 2px, transparent 6px)' }} />
                  <p className="mt-3 text-center text-[11px] text-slate-500">
                    Order confirmed. You can download the receipt PDF or close this dialog.
                  </p>
                  <div className="mt-3 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={downloadReceiptPdf}
                      className="w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-[0.08em] text-white"
                      style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={closeReceiptDialog}
                      className="w-full rounded-lg px-3 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-[0.08em] text-slate-700 border border-slate-300 bg-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="h-4" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 8px, transparent 8px, transparent 16px)', backgroundSize: '16px 16px', backgroundColor: '#e2e8f0' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
        <div className="ragged-noise" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:py-14">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="ragged-title mb-2" style={{ fontSize: 'clamp(2.1rem, 5.4vw, 3.4rem)' }}>
              Place Order
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              Add your address, pick payment, and complete checkout.
            </p>
            <CheckoutProgress currentStep={showThankYou ? 2 : 1} className="mt-5" />
          </div>

          <form onSubmit={onSubmitHandler} className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10'>
            <h2 className="sr-only">Place Order</h2>

            <div
              className='relative rounded-2xl overflow-hidden p-6 sm:p-8 h-full flex flex-col'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              <div className='mb-8'>
                <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4' style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Delivery Details</span>
                </div>
                <h3 className='ragged-title text-2xl sm:text-3xl'>Delivery Information</h3>
                <div className="mt-3 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)' }} />
              </div>

              <div className='space-y-6 flex flex-col h-full'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>First Name</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='firstName'
                      value={formData.firstName}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter first name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>Last Name</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='lastName'
                      value={formData.lastName}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter last name'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>Email Address</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='email'
                    value={formData.email}
                    type="email"
                    className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                    style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                    placeholder='Enter email address'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>Street Address</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='street'
                    value={formData.street}
                    type="text"
                    className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                    style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                    placeholder='Enter street address'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>City</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='city'
                      value={formData.city}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter city'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>State</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='state'
                      value={formData.state}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter state'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>Zipcode</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='zipcode'
                      value={formData.zipcode}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter zipcode'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>Country</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='country'
                      value={formData.country}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter country'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>Phone Number</label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='phone'
                    value={formData.phone}
                    type="text"
                    className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                    style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                    placeholder='Enter phone number'
                  />
                </div>

                <div
                  className='relative rounded-xl p-4 sm:p-5 overflow-hidden'
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(249,115,22,0.14)' }}
                >
                  <div className='absolute inset-x-0 top-0 h-0.5' style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.65), rgba(245,158,11,0.5), transparent)' }} />
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='w-1.5 h-1.5 rounded-full bg-orange-400' />
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-orange-300'>Delivery Assurance</p>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <div className='rounded-lg px-3 py-2.5' style={{ background: 'rgba(15,23,42,0.36)', border: '1px solid rgba(148,163,184,0.18)' }}>
                      <p className='text-[11px] font-semibold text-slate-200'>Secure Address</p>
                      <p className='text-[11px] text-slate-500 mt-0.5'>Your details stay encrypted.</p>
                    </div>
                    <div className='rounded-lg px-3 py-2.5' style={{ background: 'rgba(15,23,42,0.36)', border: '1px solid rgba(148,163,184,0.18)' }}>
                      <p className='text-[11px] font-semibold text-slate-200'>Quick Dispatch</p>
                      <p className='text-[11px] text-slate-500 mt-0.5'>Orders move fast after payment.</p>
                    </div>
                    <div className='rounded-lg px-3 py-2.5' style={{ background: 'rgba(15,23,42,0.36)', border: '1px solid rgba(148,163,184,0.18)' }}>
                      <p className='text-[11px] font-semibold text-slate-200'>Easy Support</p>
                      <p className='text-[11px] text-slate-500 mt-0.5'>Help available for address issues.</p>
                    </div>
                  </div>
                </div>

                <div
                  className='mt-auto relative rounded-xl p-4 sm:p-5 overflow-hidden'
                  style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.18)' }}
                >
                  <div className='absolute -top-10 -right-8 w-28 h-28 rounded-full blur-2xl opacity-40' style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.65), transparent 70%)' }} />
                  <div className='absolute -bottom-12 -left-8 w-32 h-32 rounded-full blur-2xl opacity-30' style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6), transparent 70%)' }} />
                  <div className='relative'>
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-orange-300 mb-2'>Order Confidence</p>
                    <p className='text-sm text-slate-300 leading-relaxed mb-3'>
                      Double-check your address for faster delivery and smoother order tracking.
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      <span className='text-[11px] px-2.5 py-1 rounded-full' style={{ background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(148,163,184,0.24)', color: '#cbd5e1' }}>Address Verified</span>
                      <span className='text-[11px] px-2.5 py-1 rounded-full' style={{ background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(148,163,184,0.24)', color: '#cbd5e1' }}>Live Tracking</span>
                      <span className='text-[11px] px-2.5 py-1 rounded-full' style={{ background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(148,163,184,0.24)', color: '#cbd5e1' }}>Support Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-6 text-slate-200'>
              <div
                className='relative rounded-2xl overflow-hidden p-6 sm:p-8'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
                <CartTotal
                  creditPtsVisible={creditPtsVisible}
                  setCreditPtsVisible={setCreditPtsVisible}
                />
              </div>

              <div
                className='relative rounded-2xl overflow-hidden p-6 sm:p-8'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316, transparent)' }} />
                <CouponSection />
              </div>

              <div
                className='relative rounded-2xl overflow-hidden p-6 sm:p-8'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
                <div className='mb-6'>
                  <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4' style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Payment Method</span>
                  </div>
                  <h3 className='ragged-title text-xl sm:text-2xl'>Payment Method</h3>
                  <p className='text-slate-300 text-sm mt-2'>Choose your preferred payment option</p>
                </div>

                <div className='space-y-4'>
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentMethod === 'razorpay' ? 'shadow-md' : 'hover:border-slate-500'}`}
                  >
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={paymentMethod === 'razorpay'
                        ? { background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.45)' }
                        : { background: 'rgba(15,23,42,0.2)', border: '1px solid rgba(148,163,184,0.25)' }}
                    />
                    <div className='relative flex items-center gap-4'>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-orange-500 bg-orange-500' : 'border-slate-500'}`}>
                        {paymentMethod === 'razorpay' && <div className='w-2 h-2 bg-white rounded-full'></div>}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3'>
                          <img src={assets.razorpay_logo} alt="razorpay_logo" className='h-6' />
                          <span className={`font-medium ${paymentMethod === 'razorpay' ? 'text-orange-300' : 'text-slate-300'}`}>
                            Pay Online
                          </span>
                        </div>
                        <p className='text-xs text-emerald-400 font-medium mt-1'>Free shipping</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentMethod === 'cod' ? 'shadow-md' : 'hover:border-slate-500'}`}
                  >
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={paymentMethod === 'cod'
                        ? { background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.45)' }
                        : { background: 'rgba(15,23,42,0.2)', border: '1px solid rgba(148,163,184,0.25)' }}
                    />
                    <div className='relative flex items-center gap-4'>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500' : 'border-slate-500'}`}>
                        {paymentMethod === 'cod' && <div className='w-2 h-2 bg-white rounded-full'></div>}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3'>
                          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className={`font-medium ${paymentMethod === 'cod' ? 'text-orange-300' : 'text-slate-300'}`}>
                            Cash on Delivery
                          </span>
                        </div>
                        <p className='text-xs text-orange-300 font-medium mt-1'>Rs.49 shipping</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-3 rounded-xl border' style={{ background: 'rgba(15,23,42,0.32)', borderColor: 'rgba(59,130,246,0.3)' }}>
                  <div className='flex items-start gap-3'>
                    <div className='w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5' style={{ background: 'rgba(59,130,246,0.2)' }}>
                      <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-sm font-semibold text-blue-200 mb-1'>Payment and Shipping</h4>
                      <p className='text-xs text-blue-300/90 leading-relaxed'>
                        <strong>Online:</strong> Free shipping. <strong>COD:</strong> Rs.49 shipping.
                        Select a method to see updated total.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className='relative rounded-2xl overflow-hidden p-6 sm:p-8'
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
              >
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
                <button
                  type='submit'
                  className='w-full text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:translate-y-[-1px]'
                  style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Place Order
                </button>
                <p className='text-xs text-slate-300 text-center mt-3'>
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default PlaceOrder
