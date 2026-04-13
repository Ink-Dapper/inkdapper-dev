import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import apiInstance from '../utils/axios';
import { storageUrl } from '../utils/storageUrl';
import { assets } from '../assets/assets';
import OrderStatus from '../components/OrderStatus';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatusLoading, setOrderStatusLoading] = useState({});
  const [orderStatusLoadingTwo, setOrderStatusLoadingTwo] = useState({});
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBillOrderId, setSelectedBillOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const loadOrderData = async () => {
    try {
      console.log('Loading order data...');
      const response = await apiInstance.post('/order/user-details', {});
      console.log('Order API response:', response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        if (response.data.orders && Array.isArray(response.data.orders)) {
          console.log('Found orders:', response.data.orders.length);
          response.data.orders.forEach((order) => {
            console.log('Processing order:', order._id, 'with items:', order.items?.length || 0);
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item) => {
                const processedItem = {
                  ...item,
                  status: order.status,
                  payment: order.payment,
                  paymentMethod: order.paymentMethod,
                  amount: order.amount,
                  address: order.address,
                  date: order.date,
                  deliveryDate: order.deliveryDate,
                  returnDate: order.returnDate,
                  returnOrderStatus: order.returnOrderStatus,
                  returnReason: order.returnReason,
                  expectedDeliveryDate: order.expectedDeliveryDate,
                  orderId: order._id
                };
                allOrdersItem.push(processedItem);
                setOrderStatus(order.status);
              });
            }
          });
        }
        console.log('Processed orders:', allOrdersItem.length);
        setOrderData(allOrdersItem.reverse());
        setIsLoading(false);
      } else {
        console.log('API returned success: false, message:', response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      setIsLoading(false);
      toast.error('Failed to load orders. Please try again.');
    }
  };

  const calculateReturnExpiration = (returnDate) => {
    const currentDate = new Date();
    const returnDateObject = new Date(returnDate);
    return returnDateObject < currentDate;
  };

  const handleClick = (item) => {
    setSelectedOrder(item);
    setSelectedOrderId(item.orderId);
    setOrderStatusLoading((prevState) => ({
      ...prevState,
      [item.orderId]: 'block',
    }),
      loadOrderData());
    setTimeout(() => {
      setOrderStatusLoading((prevState) => ({
        ...prevState,
        [item.orderId]: 'hidden',
      }));
    }, 6000);
  };

  const handleClickTwo = () => {
    loadOrderData();
    setOrderStatusLoadingTwo(isLoading ? 'block' : 'hidden');
  };

  const handleReturnConfirmation = (item, action) => {
    setSelectedOrder(item);
    if (action === 'return') {
      setShowReturnConfirmation(true);
    } else if (action === 'cancel') {
      setShowCancelConfirmation(true);
    }
  };

  const openBillDetails = (orderId) => {
    setSelectedBillOrderId(orderId);
    setShowBillModal(true);
  };

  const closeBillDetails = () => {
    setShowBillModal(false);
    setSelectedBillOrderId(null);
  };

  const getBillDataByOrderId = (orderId) => {
    const items = orderData.filter((item) => item.orderId === orderId);
    if (!items.length) return null;

    const subtotal = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    const total = Number(items[0]?.amount ?? subtotal);
    const shipping = Math.max(0, total - subtotal);

    return {
      orderId,
      items,
      subtotal,
      shipping,
      total,
      date: items[0]?.date,
      paymentMethod: items[0]?.paymentMethod || 'N/A',
      status: items[0]?.status || 'N/A',
      address: items[0]?.address || {}
    };
  };

  const billData = selectedBillOrderId ? getBillDataByOrderId(selectedBillOrderId) : null;

  const handleReturnConfirmationResponse = async (response, orderId) => {
    if (response === 'yes') {
      try {
        if (!token) {
          return null;
        }
        const response = await apiInstance.post('/order/user-orders', {
          returnOrderStatus: 'Order Returned',
          orderId: orderId,
          returnReason: returnReason
        });
        console.log(response.data);
        if (response.data.success) {
          setShowReturnConfirmation(false);
          toast.success('Return process initiated');
          console.log('Return Order Confirmed');
          // Re-fetch the order data to update the state
          loadOrderData();
        }
      } catch (error) {
        console.log(error);
        toast.error('Error processing return request');
      }
    } else {
      setShowReturnConfirmation(false);
      toast.error('Return order process cancelled');
      console.log('Return Order Cancelled');
    }
  };

  const handleCancelConfirmationResponse = async (response, orderId) => {
    if (response === 'yes') {
      try {
        if (!token) {
          return null;
        }
        const response = await apiInstance.post('/order/user-orders', {
          returnOrderStatus: 'Order Cancelled',
          orderId: orderId,
          cancelReason: cancelReason
        });
        console.log(response.data);
        if (response.data.success) {
          setShowCancelConfirmation(false);
          toast.success('Cancel process initiated');
          console.log('Cancel Order Confirmed');
          // Re-fetch the order data to update the state
          loadOrderData();
        }
      } catch (error) {
        console.log(error);
        toast.error('Error processing cancel request');
      }
    } else {
      setShowCancelConfirmation(false);
      toast.error('Cancel order process cancelled');
      console.log('Cancel Order Cancelled');
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Please login to view your orders');
      navigate('/login');
      return;
    }
    loadOrderData();
    console.log(orderData);
  }, [token, navigate]);

  // Calculate opacities based on order status
  const getOpacities = (status) => {
    const opacities = [20, 20, 20, 20];
    if (status === 'Packing') {
      opacities[0] = 100;
    } else if (status === 'Shipped') {
      opacities[0] = 100;
      opacities[1] = 100;
    } else if (status === 'Out for delivery') {
      opacities[0] = 100;
      opacities[1] = 100;
      opacities[2] = 100;
    } else if (status === 'Delivered') {
      opacities[0] = 100;
      opacities[1] = 100;
      opacities[2] = 100;
      opacities[3] = 100;
    }
    return opacities;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Packing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out for delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'Shipped':
        return 'bg-blue-500';
      case 'Packing':
        return 'bg-yellow-500';
      case 'Out for delivery':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='ragged-section min-h-screen' style={{ background: '#0d0d0e' }}>
      <div className='ragged-noise' />
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:py-14'>
        <div className='text-center mb-0 md:mb-10'>
          <h1 className="sr-only">Your Orders</h1>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4' style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Live Tracking</span>
          </div>
          <h2 className='ragged-title mb-2' style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>My Orders</h2>
          <p className='text-slate-400 text-sm sm:text-base'>Track all your purchases and delivery progress.</p>

          <div className='mt-7 grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 w-full text-left'>
            <div className='rounded-xl p-3 sm:p-4 min-h-[78px] sm:min-h-0 flex flex-col justify-center' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.16)' }}>
              <div className='text-xl sm:text-2xl font-bold text-slate-100 leading-none'>{orderData.length}</div>
              <div className='text-[11px] sm:text-sm text-slate-400 font-medium mt-2 leading-tight'>Total Orders</div>
            </div>
            <div className='rounded-xl p-3 sm:p-4 min-h-[78px] sm:min-h-0 flex flex-col justify-center' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <div className='text-xl sm:text-2xl font-bold text-emerald-400 leading-none'>
                {orderData.filter(item => item.status === 'Delivered').length}
              </div>
              <div className='text-[11px] sm:text-sm text-slate-400 font-medium mt-2 leading-tight'>Delivered</div>
            </div>
            <div className='rounded-xl p-3 sm:p-4 min-h-[78px] sm:min-h-0 flex flex-col justify-center' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <div className='text-xl sm:text-2xl font-bold text-blue-400 leading-none'>
                {orderData.filter(item => item.status !== 'Delivered').length}
              </div>
              <div className='text-[11px] sm:text-sm text-slate-400 font-medium mt-2 leading-tight'>In Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-8xl mx-auto px-1 lg:px-8 py-8 !px-[7vw] relative z-10'>
        <div className='space-y-8'>
          {isLoading ? (
            <div className='text-center py-16'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center border shadow-lg'
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(249,115,22,0.2)' }}>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400'></div>
              </div>
              <h3 className='text-2xl font-bold text-slate-100 mb-3'>Loading Orders...</h3>
              <p className='text-slate-700 text-lg'>Please wait while we fetch your order details</p>
            </div>
          ) : orderData.length === 0 ? (
            <div className='text-center py-16'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center border shadow-lg'
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(249,115,22,0.2)' }}>
                <svg className='w-16 h-16 text-slate-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-slate-100 mb-3'>No Orders Yet</h3>
              <p className='text-slate-700 text-lg'>Start your shopping journey to see your orders here</p>
              <div className='mt-6'>
                <div className='inline-flex items-center gap-2 text-orange-300 hover:text-orange-200 transition-colors cursor-pointer'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                  <span className='font-medium'>Explore Products</span>
                </div>
              </div>
            </div>
          ) : (
            orderData.map((item, index) => {
              const [iconOpacityOne, iconOpacityTwo, iconOpacityThree, iconOpacityFour] = getOpacities(item.status);
              const isReturnExpired = calculateReturnExpiration(item.returnDate);
              return (
                <div key={index} className='rounded-xl overflow-hidden transition-all duration-300 group shadow-md hover:shadow-md'
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249, 116, 22, 0.56)' }}>
                  {/* Order Header */}
                  <div className='px-6 py-4 border-b' style={{ background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(148,163,184,0.2)' }}>
                    <div className='flex flex-col md:flex-row gap-4 md:gap-0 md:items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-3 h-3 bg-orange-400 rounded-full animate-pulse'></div>
                        <span className='text-sm font-medium text-slate-300'>Order #{item.orderId.slice(-8)}</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='text-right'>
                          <p className='text-sm text-slate-500 font-medium'>Order Status :</p>
                          {/* <p className='text-sm font-semibold text-gray-900'>{item.status}</p> */}
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 md:p-6'>
                    <div className='grid grid-cols-1 xl:grid-cols-12 gap-8'>
                      {/* Product Section - Takes 8 columns on xl screens */}
                      <div className='xl:col-span-8'>
                        <div className='flex flex-col lg:flex-row gap-6'>
                          {/* Product Image */}
                          <div className='relative flex-shrink-0 self-start'>
                            <div className='w-32 h-40 rounded-xl overflow-hidden border' style={{ background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(148,163,184,0.22)' }}>
                              <img
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                src={storageUrl(item.isCustom ? (Array.isArray(item.reviewImageCustom) ? item.reviewImageCustom[0] : (item.reviewImageCustom || '')) : (Array.isArray(item.image) ? item.image[0] : (item.image || '')))}
                                alt={item.name}
                              />
                            </div>
                            <div className='absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg'>
                              {item.quantity}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className='flex-1 min-w-0'>
                            <div className='space-y-6'>
                              <div>
                                <h3 className='text-xl font-bold text-slate-100 mb-4 group-hover:text-orange-300 transition-colors line-clamp-2'>{item.name}</h3>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-sm'>
                                  <div className='flex items-center gap-2'>
                                    <span className='text-slate-300 font-medium'>Price:</span>
                                    <span className='text-2xl font-bold text-orange-300'>{currency} {item.price}</span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <span className='text-slate-300 font-medium'>Size:</span>
                                    <span className='px-3 py-1 rounded-lg font-medium border text-slate-200' style={{ background: 'rgba(15,23,42,0.5)', borderColor: 'rgba(148,163,184,0.22)' }}>{item.size}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Info Row */}
                              <div className='rounded-lg p-3 md:p-4 border'
                                style={{ background: 'rgba(15,23,42,0.25)', borderColor: 'transparent' }}>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                  {/* Order Date */}
                                  <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'rgba(148,163,184,0.18)' }}>
                                      <svg className='w-4 h-4 text-slate-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                      </svg>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <span className='text-xs font-medium text-slate-500 block mb-1'>Order Date</span>
                                      <p className='text-sm font-semibold text-slate-100'>{new Date(item.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}</p>
                                    </div>
                                  </div>

                                  {/* Expected Delivery */}
                                  {item.status !== 'Delivered' && (
                                    <div className='flex items-center gap-3'>
                                      <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'rgba(148,163,184,0.18)' }}>
                                        <svg className='w-4 h-4 text-slate-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <span className='text-xs font-medium text-slate-500 block mb-1'>Expected Delivery</span>
                                        <p className='text-sm font-semibold text-slate-100'>{new Date(item.expectedDeliveryDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Payment */}
                                  <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'rgba(148,163,184,0.18)' }}>
                                      <svg className='w-4 h-4 text-slate-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                                      </svg>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <span className='text-xs font-medium text-slate-500 block mb-1'>Payment</span>
                                      <p className='text-sm font-semibold text-slate-100'>{item.paymentMethod}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Return Date - Separate row if exists */}
                                {item.returnDate && (
                                  <div className='mt-4 pt-4 border-t' style={{ borderColor: 'rgba(148,163,184,0.2)' }}>
                                    <div className='flex items-center gap-3'>
                                      <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'rgba(148,163,184,0.18)' }}>
                                        <svg className='w-4 h-4 text-slate-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                                        </svg>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <span className='text-xs font-medium text-slate-500 block mb-1'>Return By</span>
                                        <p className='text-sm font-semibold text-slate-100'>{new Date(item.returnDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Order Progress Bar */}
                                <div className='mt-6 pt-4 border-t' style={{ borderColor: 'rgba(148,163,184,0.2)' }}>
                                  <div className='flex items-center justify-between mb-3'>
                                    <h4 className='text-sm font-semibold text-slate-100 flex items-center gap-2'>
                                      <svg className='w-4 h-4 text-orange-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                                      </svg>
                                      Order Progress
                                    </h4>
                                    <div className='flex items-center gap-2'>
                                      <div className={`w-2 h-2 rounded-full ${getStatusClass(item.status)}`}></div>
                                      <p className="text-sm font-medium text-slate-300">{item.status}</p>
                                    </div>
                                  </div>

                                  {(() => {
                                    const isCancelledOrReturned = item.returnOrderStatus === 'Order Returned' || item.returnOrderStatus === 'Return Confirmed' || item.returnOrderStatus === 'Order Cancelled' || item.returnOrderStatus === 'Cancel Confirmed';
                                    const statusSteps = ['order placed', 'packing', 'shipped', 'out for delivery', 'delivered'];
                                    const stepIdx = statusSteps.indexOf((item.status || '').toLowerCase());
                                    // step is active if not cancelled and the order has reached that step
                                    const isActive = (threshold) => !isCancelledOrReturned && stepIdx >= threshold;
                                    const activeStyle = { background: 'linear-gradient(135deg, rgba(249,115,22,0.95), rgba(245,158,11,0.9))', boxShadow: '0 0 8px rgba(249,115,22,0.55)' };
                                    const inactiveStyle = { background: 'rgba(148,163,184,0.2)', border: '1px solid rgba(148,163,184,0.15)' };
                                    // stepIdx maps: 0=Order placed, 1=Packing, 2=Shipped, 3=Out for delivery, 4=Delivered
                                    // barWidth: each step = 25% of the inner track (padded px-3.5 to align with icon centers)
                                    const barWidth = isCancelledOrReturned ? '100%' : (stepIdx <= 0 ? '0%' : stepIdx === 1 ? '26.5%' : stepIdx === 2 ? '49%' : stepIdx === 3 ? '74%' : stepIdx >= 4 ? '100%' : '0%');
                                    const barClass = isCancelledOrReturned ? 'h-full bg-gradient-to-r from-slate-500 to-slate-600 rounded-full transition-all duration-700' : 'h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700';
                                    return (
                                      <div className={`${selectedOrderId === item.orderId ? orderStatusLoading[item.orderId] : 'block'}`}>
                                        <div className='space-y-3'>
                                          {/* px-3.5 = half of w-7 icon width, so bar aligns with icon centers */}
                                          <div className='px-3.5'>
                                            <div className='h-2 rounded-full overflow-hidden' style={{ background: 'rgba(148,163,184,0.2)' }}>
                                              <div className={barClass} style={{ width: barWidth }}></div>
                                            </div>
                                          </div>
                                          <div className='flex justify-between items-center'>
                                            {[
                                              { src: assets.shopping_icon, alt: 'Order placed', step: 0 },
                                              { src: assets.order_placed, alt: 'Packing', step: 1 },
                                              { src: assets.packing_icon, alt: 'Shipped', step: 2 },
                                              { src: assets.shipped_icon, alt: 'Out for delivery', step: 3 },
                                              { src: assets.delivered_icon, alt: 'Delivered', step: 4 },
                                            ].map(({ src, alt, step }) => (
                                              <div key={step} className='flex flex-col items-center gap-1'>
                                                <div className='w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300'
                                                  style={isActive(step) ? activeStyle : inactiveStyle}>
                                                  <img src={src} alt={alt} className='w-3.5 h-3.5' style={{ opacity: isActive(step) ? 1 : 0.4 }} />
                                                </div>
                                                <span className='text-[9px] font-medium hidden sm:block' style={{ color: isActive(step) ? '#fb923c' : '#475569' }}>{alt}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Section - Takes 4 columns on xl screens */}
                      <div className='xl:col-span-4'>
                        {/* Action Buttons */}
                        <div className='space-y-2 md:space-y-3 h-full flex flex-col justify-end items-center gap-2 md:gap-3'>
                          <OrderStatus item={item} orderStatusLoading={orderStatusLoading} selectedOrderId={selectedOrderId} />

                          {item.returnOrderStatus === 'Order Returned' ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl text-slate-500 cursor-not-allowed transition-all duration-200"
                              style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}>
                              Return Initiated
                            </button>
                          ) : item.returnOrderStatus === "Return Confirmed" ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl text-slate-500 cursor-not-allowed transition-all duration-200"
                              style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}>
                              Return Confirmed
                            </button>
                          ) : item.returnOrderStatus === "Order Cancelled" ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl text-slate-500 cursor-not-allowed transition-all duration-200"
                              style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}>
                              Cancel Initiated
                            </button>
                          ) : item.returnOrderStatus === "Cancel Confirmed" ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl text-slate-500 cursor-not-allowed transition-all duration-200"
                              style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}>
                              Cancel Completed
                            </button>
                          ) : (
                            isReturnExpired ? (
                              <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl text-slate-500 cursor-not-allowed transition-all duration-200"
                                style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}>
                                Return Expired
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleClick(item)}
                                  className='w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg block md:hidden'
                                >
                                  Track Order
                                </button>
                                <button
                                  onClick={() => handleClickTwo()}
                                  className='w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg hidden md:block'
                                >
                                  Track Order
                                </button>
                                <button
                                  onClick={() => openBillDetails(item.orderId)}
                                  className='w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl text-slate-200 transition-all duration-200 shadow-md hover:shadow-lg'
                                  style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)' }}
                                >
                                  Bill Details
                                </button>
                                {item.status === 'Delivered' ? (
                                  <button
                                    onClick={() => handleReturnConfirmation(item, 'return')}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    Return Valid
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReturnConfirmation(item, 'cancel')}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Return Confirmation Modal */}
      {showReturnConfirmation && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm'>
          <div className='rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border'
            style={{ background: 'rgba(13,13,14,0.96)', borderColor: 'rgba(249,115,22,0.25)' }}>
            <div className='bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4'>
              <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
                Return Order Confirmation
              </h2>
            </div>
            <div className='p-6'>
              <p className='text-slate-300 mb-6'>Are you sure you want to return this product?</p>
              <textarea
                className='w-full p-4 border rounded-xl mb-6 focus:ring-2 focus:ring-orange-500/40 focus:border-transparent resize-none text-slate-100 placeholder-slate-500'
                style={{ background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(148,163,184,0.28)' }}
                placeholder='Enter return reason'
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
              />
              <div className='flex gap-3 justify-end'>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl text-slate-300 transition-all duration-200'
                  style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}
                  onClick={() => handleReturnConfirmationResponse('no')}
                >
                  Cancel
                </button>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg'
                  onClick={() => handleReturnConfirmationResponse('yes', selectedOrder.orderId)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmation && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm'>
          <div className='rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border'
            style={{ background: 'rgba(13,13,14,0.96)', borderColor: 'rgba(249,115,22,0.25)' }}>
            <div className='bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4'>
              <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
                Cancel Order Confirmation
              </h2>
            </div>
            <div className='p-6'>
              <p className='text-slate-300 mb-6'>Are you sure you want to cancel this order?</p>
              <textarea
                className='w-full p-4 border rounded-xl mb-6 focus:ring-2 focus:ring-orange-500/40 focus:border-transparent resize-none text-slate-100 placeholder-slate-500'
                style={{ background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(148,163,184,0.28)' }}
                placeholder='Enter cancel reason'
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
              <div className='flex gap-3 justify-end'>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl text-slate-300 transition-all duration-200'
                  style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}
                  onClick={() => handleCancelConfirmationResponse('no')}
                >
                  Cancel
                </button>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg'
                  onClick={() => handleCancelConfirmationResponse('yes', selectedOrder.orderId)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBillModal && billData && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm'>
          <div
            className='rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border max-h-[90vh] flex flex-col'
            style={{ background: 'rgba(13,13,14,0.97)', borderColor: 'rgba(59,130,246,0.35)' }}
          >
            <div className='px-6 py-4 border-b flex items-center justify-between'
              style={{ background: 'rgba(15,23,42,0.5)', borderColor: 'rgba(148,163,184,0.2)' }}>
              <h2 className='text-xl font-bold text-slate-100'>Bill Details</h2>
              <button
                onClick={closeBillDetails}
                className='px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300'
                style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.2)' }}
              >
                Close
              </button>
            </div>

            <div className='p-6 overflow-y-auto'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm'>
                <div className='rounded-lg p-3' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <p className='text-slate-700 text-xs'>Order ID</p>
                  <p className='text-slate-100 font-semibold'>#{billData.orderId.slice(-8)}</p>
                </div>
                <div className='rounded-lg p-3' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <p className='text-slate-700 text-xs'>Order Date</p>
                  <p className='text-slate-100 font-semibold'>{new Date(billData.date).toLocaleString()}</p>
                </div>
                <div className='rounded-lg p-3' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <p className='text-slate-700 text-xs'>Payment Method</p>
                  <p className='text-slate-100 font-semibold'>{billData.paymentMethod}</p>
                </div>
                <div className='rounded-lg p-3' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <p className='text-slate-700 text-xs'>Status</p>
                  <p className='text-slate-100 font-semibold'>{billData.status}</p>
                </div>
              </div>

              <div className='rounded-xl border overflow-hidden mb-5' style={{ borderColor: 'rgba(148,163,184,0.2)' }}>
                <div className='px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-300'
                  style={{ background: 'rgba(148,163,184,0.12)' }}>
                  Items
                </div>
                <div className='divide-y' style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                  {billData.items.map((item, idx) => (
                    <div key={`${item._id}-${item.size}-${idx}`} className='px-4 py-3 flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-slate-100 font-medium'>{item.name}</p>
                        <p className='text-slate-700 text-xs'>Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className='text-orange-300 font-semibold'>{currency} {(Number(item.price) || 0) * (Number(item.quantity) || 0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='ml-auto max-w-sm space-y-2 text-sm'>
                <div className='flex items-center justify-between text-slate-300'>
                  <span>Subtotal</span>
                  <span>{currency} {billData.subtotal.toFixed(2)}</span>
                </div>
                <div className='flex items-center justify-between text-slate-300'>
                  <span>Shipping</span>
                  <span>{currency} {billData.shipping.toFixed(2)}</span>
                </div>
                <div className='pt-2 border-t flex items-center justify-between text-base font-bold text-slate-100'
                  style={{ borderColor: 'rgba(148,163,184,0.2)' }}>
                  <span>Total</span>
                  <span className='text-orange-300'>{currency} {billData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
