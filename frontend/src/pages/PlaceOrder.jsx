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

  // Load Razorpay checkout.js lazily — only on this page so it doesn't
  // pollute every route with its internal preload hints.
  useEffect(() => {
    const RAZORPAY_URL = 'https://checkout.razorpay.com/v1/checkout.js'
    if (document.querySelector(`script[src="${RAZORPAY_URL}"]`)) return
    const script = document.createElement('script')
    script.src = RAZORPAY_URL
    script.async = true
    document.body.appendChild(script)
  }, [])

  const [creditPtsVisible, setCreditPtsVisible] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [zipLookup, setZipLookup] = useState({ loading: false, error: '', success: false })
  const [locLoading, setLocLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
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

  const persistAddress = () => {
    if (!token) return
    apiInstance.post('/user/save-address', formData).catch(() => {})
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
    if (!window.Razorpay) {
      toast.error('Payment gateway is still loading, please try again in a moment.')
      return
    }
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
            persistAddress()
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
    setOrderLoading(true)
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
            persistAddress()
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
    } finally {
      setOrderLoading(false)
    }
  }

  const selectSavedAddress = (addr) => {
    setFormData({
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      email: addr.email || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipcode: addr.zipcode || '',
      country: addr.country || '',
      phone: addr.phone || ''
    })
    setShowAddressModal(false)
  }

  useEffect(() => {
    if (!token) return
    const fetchSavedAddresses = async () => {
      try {
        const { data } = await apiInstance.post('/user/get-addresses', {})
        if (data.success) {
          setSavedAddresses(data.savedAddresses || [])
        }
      } catch (_) {}
    }
    fetchSavedAddresses()
  }, [token])

  useEffect(() => {
    getCreditScore()
  }, [])

  // Pre-fill email and phone from profile on mount
  useEffect(() => {
    const profileEmail = localStorage.getItem('user_email')
    const profilePhone = localStorage.getItem('user_phone')
    setFormData(prev => ({
      ...prev,
      email: prev.email || profileEmail || '',
      phone: prev.phone || profilePhone || '',
    }))
  }, [])

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    }
  }, [])

  // Auto-fill city/state/country when a complete zip code is entered
  useEffect(() => {
    const zip = formData.zipcode.trim()
    let cancelled = false

    const isIndian = /^\d{6}$/.test(zip)
    const isUS = /^\d{5}$/.test(zip)

    if (!zip) {
      setZipLookup({ loading: false, error: '', success: false })
      return
    }
    if (!isIndian && !isUS) return

    setZipLookup({ loading: true, error: '', success: false })

    const url = isIndian
      ? `https://api.postalpincode.in/pincode/${zip}`
      : `https://api.zippopotam.us/us/${zip}`

    fetch(url)
      .then(r => {
        if (!r.ok && !isIndian) throw new Error('not found')
        return r.json()
      })
      .then(data => {
        if (cancelled) return
        if (isIndian) {
          if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0]
            setFormData(prev => ({
              ...prev,
              city: po.District || po.Name || prev.city,
              state: po.State || prev.state,
              country: 'India'
            }))
            setZipLookup({ loading: false, error: '', success: true })
          } else {
            setZipLookup({ loading: false, error: 'Pincode not found. Fill manually.', success: false })
          }
        } else {
          if (data.places?.length > 0) {
            setFormData(prev => ({
              ...prev,
              city: data.places[0]['place name'] || prev.city,
              state: data.places[0]['state'] || prev.state,
              country: 'United States'
            }))
            setZipLookup({ loading: false, error: '', success: true })
          } else {
            setZipLookup({ loading: false, error: 'ZIP not found. Fill manually.', success: false })
          }
        }
      })
      .catch(() => {
        if (cancelled) return
        setZipLookup({ loading: false, error: 'Lookup failed. Fill manually.', success: false })
      })

    return () => { cancelled = true }
  }, [formData.zipcode])

  return (
    <>
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-1">
          <div className="w-full max-w-md" style={{ maxHeight: '100vh' }}>
            <div className="rounded-2xl p-2.5" style={{ background: '#38b2ac' }}>
              <div className="relative bg-white text-slate-700 mx-auto shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 16px)' }}>
                {/* Top ticket edge */}
                <div className="shrink-0 h-3" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 8px, transparent 8px, transparent 16px)', backgroundSize: '16px 16px', backgroundColor: '#e2e8f0' }} />

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-4 py-3">
                  {/* Header row: title + success icon */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black tracking-wide text-slate-700">RECEIPT</h2>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="border-t-2 border-slate-500 mb-2" />

                  {/* Meta info */}
                  <div className="text-sm space-y-0.5">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Receipt No</span>
                      <span className="font-semibold text-slate-600">{receiptData?.receiptNo}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Date</span>
                      <span className="font-semibold text-slate-600">
                        {receiptData?.date ? new Date(receiptData.date).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Payment</span>
                      <span className="font-semibold text-slate-600">{receiptData?.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="my-2 border-t border-dashed border-slate-400" />

                  {/* Items — scroll only this section if many items */}
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {(receiptData?.items || []).map((item, index) => (
                      <div key={`${item._id}-${item.size}-${index}`} className="text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="truncate text-slate-600">{item.name} ({item.size}) x {item.quantity}</span>
                          <span className="font-semibold whitespace-nowrap text-slate-600">
                            {formatCurrency((item.price || 0) * (item.quantity || 0))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="my-2 border-t border-dashed border-slate-400" />

                  {/* Totals */}
                  <div className="space-y-0.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-600">{formatCurrency(receiptData?.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shipping</span>
                      <span className="text-slate-600">{formatCurrency(receiptData?.shipping)}</span>
                    </div>
                    {Number(receiptData?.discount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Discount</span>
                        <span className="text-slate-600">- {formatCurrency(receiptData?.discount)}</span>
                      </div>
                    )}
                    {Number(receiptData?.creditUsed) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Credit Used</span>
                        <span className="text-slate-600">- {formatCurrency(receiptData?.creditUsed)}</span>
                      </div>
                    )}
                    <div className="pt-1 mt-1 border-t border-slate-400 flex justify-between text-sm font-extrabold">
                      <span className="text-slate-700">Total</span>
                      <span className="text-slate-700">{formatCurrency(receiptData?.total)}</span>
                    </div>
                  </div>

                  <div className="my-2 border-t border-dashed border-slate-400" />

                  {/* Billing address */}
                  <div className="text-[14px] leading-snug">
                    <p className="font-semibold text-slate-700 mb-0.5">Billing Address</p>
                    <p className="text-slate-500">
                      {receiptData?.address?.firstName} {receiptData?.address?.lastName}, {receiptData?.address?.street},{' '}
                      {receiptData?.address?.city}, {receiptData?.address?.state} - {receiptData?.address?.zipcode},{' '}
                      {receiptData?.address?.country}
                    </p>
                    <p className="text-slate-500">Ph: {receiptData?.address?.phone} &nbsp;|&nbsp; {receiptData?.address?.email}</p>
                  </div>

                  {/* Barcode strip */}
                  <div className="mt-3 h-6 rounded" style={{ background: 'repeating-linear-gradient(90deg, #1f2937 0, #1f2937 2px, transparent 2px, transparent 6px)' }} />
                  <p className="mt-1.5 text-center text-[14px] text-slate-400">Order confirmed. Download the receipt or close.</p>

                  {/* Action buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={downloadReceiptPdf}
                      className="w-full rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
                      style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={closeReceiptDialog}
                      className="w-full rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 border border-slate-300 bg-white"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Bottom ticket edge */}
                <div className="shrink-0 h-3" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 8px, transparent 8px, transparent 16px)', backgroundSize: '16px 16px', backgroundColor: '#e2e8f0' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowAddressModal(false)}>
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#1a1a1e', border: '1px solid rgba(249,115,22,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(249,115,22,0.15)' }}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-orange-400">Saved Addresses</h3>
              </div>
              <button type="button" onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Address list */}
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {savedAddresses.map((addr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSavedAddress(addr)}
                  className="w-full text-left rounded-xl px-4 py-3 transition-all hover:border-orange-500/60 hover:bg-orange-500/5 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.15)' }}
                >
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-orange-300 transition-colors">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{addr.street}</p>
                  <p className="text-xs text-slate-400">{addr.city}, {addr.state} - {addr.zipcode}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{addr.phone}</p>
                </button>
              ))}
            </div>

            <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}>
              <p className="text-[11px] text-slate-500 text-center">Select an address to auto-fill the delivery form</p>
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
              className='relative rounded-2xl p-6 sm:p-8'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              <div className='mb-5'>
                {/* Single compact row: label left, buttons right */}
                <div className='flex items-center justify-between gap-2'>
                  {/* Left: icon + title */}
                  <div className='flex items-center gap-2 min-w-0'>
                    <div className='shrink-0 w-7 h-7 rounded-lg flex items-center justify-center' style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}>
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400 leading-none'>Delivery Details</p>
                      <h3 className='ragged-title text-lg sm:text-2xl leading-tight truncate'>Delivery Information</h3>
                    </div>
                  </div>

                  {/* Right: Home (profile address) + Use Saved (order history) */}
                  <div className='shrink-0 flex items-center gap-2'>
                    {/* Home button — reads default address from Profile localStorage */}
                    <button
                      type="button"
                      title="Fill from profile address"
                      onClick={() => {
                        try {
                          const raw = localStorage.getItem('inkdapper_addresses')
                          const list = raw ? JSON.parse(raw) : []
                          if (!list.length) {
                            toast.info('No address in your profile. Go to Profile → Addresses to add one.', { autoClose: 3000 })
                            return
                          }
                          const addr = list.find(a => a.isDefault) || list[0]
                          const nameParts = (addr.name || '').trim().split(' ')
                          const firstName = nameParts[0] || ''
                          const lastName = nameParts.slice(1).join(' ') || ''
                          const street = [addr.line1, addr.line2].filter(Boolean).join(', ')
                          setFormData(prev => ({
                            ...prev,
                            firstName,
                            lastName,
                            email: localStorage.getItem('user_email') || prev.email,
                            phone: addr.phone || localStorage.getItem('user_phone') || prev.phone,
                            street: street || prev.street,
                            city: addr.city || prev.city,
                            state: addr.state || prev.state,
                            zipcode: addr.pincode || prev.zipcode,
                            country: prev.country || 'India',
                          }))
                          toast.success('Profile address filled!', { autoClose: 1200 })
                        } catch {
                          toast.error('Could not load profile address.')
                        }
                      }}
                      className='shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95'
                      style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}
                    >
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </button>

                    {/* Location button — reverse geocode current position */}
                    <button
                      type="button"
                      title="Use current location"
                      disabled={locLoading}
                      onClick={() => {
                        if (!navigator.geolocation) {
                          toast.error('Geolocation is not supported by your browser.')
                          return
                        }
                        setLocLoading(true)
                        navigator.geolocation.getCurrentPosition(
                          async ({ coords }) => {
                            try {
                              const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
                                { headers: { 'Accept-Language': 'en' } }
                              )
                              const data = await res.json()
                              const a = data.address || {}
                              const houseNo = a.house_number || ''
                              const road = a.road || a.pedestrian || a.footway || a.path || a.construction || ''
                              const area = a.suburb || a.neighbourhood || a.quarter || a.hamlet || ''
                              const street = [houseNo, road, area].filter(Boolean).join(', ')
                              const city = a.city || a.town || a.village || a.county || ''
                              const state = a.state || ''
                              const zipcode = a.postcode || ''
                              const country = a.country || ''
                              setFormData(prev => ({
                                ...prev,
                                street: street || prev.street,
                                city: city || prev.city,
                                state: state || prev.state,
                                zipcode: zipcode || prev.zipcode,
                                country: country || prev.country,
                              }))
                              toast.success('Location address filled!', { autoClose: 1500 })
                            } catch {
                              toast.error('Could not fetch address. Try again.')
                            } finally {
                              setLocLoading(false)
                            }
                          },
                          (err) => {
                            setLocLoading(false)
                            if (err.code === 1) toast.error('Location permission denied. Please allow access.')
                            else toast.error('Could not get your location. Try again.')
                          },
                          { timeout: 10000 }
                        )
                      }}
                      className='shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-60'
                      style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}
                    >
                      {locLoading ? (
                        <svg className='animate-spin w-4 h-4 text-orange-400' fill='none' viewBox='0 0 24 24'>
                          <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' className='opacity-25' />
                          <path fill='currentColor' className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>

                    {/* Use Saved — opens modal for order-history addresses */}
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(true)}
                        className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] text-orange-300 transition-all active:scale-95'
                        style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className='hidden xs:inline'>Use </span>Saved
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2.5 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.25), transparent)' }} />
              </div>

              <div className='space-y-6'>
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

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>Zipcode</label>
                  <div className='relative'>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='zipcode'
                      value={formData.zipcode}
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      className='w-full px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter zipcode to auto-fill city, state & country'
                    />
                    {zipLookup.loading && (
                      <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                        <svg className='animate-spin w-4 h-4 text-orange-400' fill='none' viewBox='0 0 24 24'>
                          <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' className='opacity-25' />
                          <path fill='currentColor' className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                      </div>
                    )}
                    {zipLookup.success && !zipLookup.loading && (
                      <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                        <svg className='w-4 h-4 text-emerald-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                        </svg>
                      </div>
                    )}
                  </div>
                  {zipLookup.success && (
                    <p className='text-[11px] text-emerald-400'>✓ City, state &amp; country auto-filled</p>
                  )}
                  {zipLookup.error && (
                    <p className='text-[11px] text-red-400'>{zipLookup.error}</p>
                  )}
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>
                      City
                      {zipLookup.success && <span className='ml-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wide'>Auto-filled</span>}
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='city'
                      value={formData.city}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: zipLookup.success ? 'rgba(52,211,153,0.55)' : 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter city'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-300'>
                      State
                      {zipLookup.success && <span className='ml-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wide'>Auto-filled</span>}
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name='state'
                      value={formData.state}
                      type="text"
                      className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                      style={{ background: 'rgba(15,23,42,0.35)', borderColor: zipLookup.success ? 'rgba(52,211,153,0.55)' : 'rgba(148,163,184,0.3)' }}
                      placeholder='Enter state'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>
                    Country
                    {zipLookup.success && <span className='ml-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wide'>Auto-filled</span>}
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name='country'
                    value={formData.country}
                    type="text"
                    className='w-full px-4 py-3 text-slate-900 placeholder:text-slate-500 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40'
                    style={{ background: 'rgba(15,23,42,0.35)', borderColor: zipLookup.success ? 'rgba(52,211,153,0.55)' : 'rgba(148,163,184,0.3)' }}
                    placeholder='Enter country'
                  />
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

                {/* Delivery Assurance */}
                <div
                  className='relative rounded-xl px-3 py-2.5 sm:p-5'
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(249,115,22,0.14)' }}
                >
                  <div className='absolute inset-x-0 top-0 h-0.5 rounded-t-xl' style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.65), rgba(245,158,11,0.5), transparent)' }} />
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300'>Delivery Assurance</p>
                  </div>
                  <div className='mt-2 grid grid-cols-3 gap-2'>
                    {[
                      { icon: '🔒', title: 'Secure', sub: 'Encrypted' },
                      { icon: '⚡', title: 'Fast Ship', sub: 'After payment' },
                      { icon: '💬', title: 'Support', sub: 'Help ready' },
                    ].map(({ icon, title, sub }) => (
                      <div key={title} className='flex flex-col items-center text-center rounded-lg px-2 py-2' style={{ background: 'rgba(15,23,42,0.36)', border: '1px solid rgba(148,163,184,0.18)' }}>
                        <span className='text-base leading-none mb-1'>{icon}</span>
                        <p className='text-[10px] font-semibold text-slate-200 leading-tight'>{title}</p>
                        <p className='text-[9px] text-slate-500 leading-tight mt-0.5'>{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Confidence — compact single row on mobile */}
                <div
                  className='relative rounded-xl p-3 sm:p-5 overflow-hidden'
                  style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.18)' }}
                >
                  <div className='absolute -top-10 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30' style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.65), transparent 70%)' }} />
                  <div className='relative'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300 mb-1'>Order Confidence</p>
                        <p className='text-[11px] sm:text-sm text-slate-400 leading-snug'>
                          Double-check your address for faster delivery.
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-wrap gap-1.5 mt-2'>
                      {['Address Verified', 'Live Tracking', 'Support Ready'].map(label => (
                        <span key={label} className='text-[10px] px-2 py-0.5 rounded-full' style={{ background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(148,163,184,0.24)', color: '#cbd5e1' }}>{label}</span>
                      ))}
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
                  disabled={orderLoading}
                  className='w-full text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0'
                  style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
                >
                  {orderLoading ? (
                    <>
                      <svg className='animate-spin w-5 h-5 text-white' fill='none' viewBox='0 0 24 24'>
                        <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' className='opacity-25' />
                        <path fill='currentColor' className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                      </svg>
                      Placing Order...
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