import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { assets } from '../assets/assets';
import OrderProgress from '../components/OrderProgress';
import OrderStatus from '../components/OrderStatus';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatusLoading, setOrderStatusLoading] = useState({});
  const [orderStatusLoadingTwo, setOrderStatusLoadingTwo] = useState({});
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(backendUrl + '/api/order/user-orders', {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['deliveryDate'] = order.deliveryDate;
            item['returnDate'] = order.returnDate;
            item['returnOrderStatus'] = order.returnOrderStatus;
            item['returnReason'] = order.returnReason;
            item['expectedDeliveryDate'] = order.expectedDeliveryDate;
            item['orderId'] = order._id;
            allOrdersItem.push(item);
            setOrderStatus(order.status);
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
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

  const handleReturnConfirmationResponse = async (response, orderId) => {
    if (response === 'yes') {
      try {
        if (!token) {
          return null;
        }
        const response = await axios.post(backendUrl + '/api/order/user-orders', {
          returnOrderStatus: 'Order Returned',
          orderId: orderId,
          returnReason: returnReason
        }, { headers: { token } });
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
        const response = await axios.post(backendUrl + '/api/order/user-orders', {
          returnOrderStatus: 'Order Cancelled',
          orderId: orderId,
          cancelReason: cancelReason
        }, { headers: { token } });
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
      }
    } else {
      setShowCancelConfirmation(false);
      toast.error('Cancel order process cancelled');
      console.log('Cancel Order Cancelled');
    }
  };

  useEffect(() => {
    loadOrderData();
    console.log(orderData);
  }, [token]);

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
    <div className='min-h-screen'>
      {/* Header Section */}
      <div className=''>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center relative'>
            <h1 className="sr-only">Your Orders</h1>

            {/* Decorative Background Elements */}
            <div className='absolute inset-0 flex items-center justify-center opacity-5'>
              <div className='w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl'></div>
            </div>

            {/* Main Content */}
            <div className='relative z-10'>
              <div className='mb-6'>
                <Title text1={'MY'} text2={'ORDERS'} />
              </div>

              {/* Live Tracking Badge */}
              <div className='inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg'>
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <div className='w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse'></div>
                    <div className='absolute inset-0 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-75'></div>
                  </div>
                  <span className='text-sm font-semibold text-gray-700'>Live Order Tracking</span>
                </div>
                <div className='w-px h-4 bg-gray-300'></div>
                <div className='flex items-center gap-1'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce'></div>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>

              {/* Order Stats */}
              <div className='mt-8 flex justify-center'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 w-full'>
                  <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm'>
                    <div className='text-2xl font-bold text-gray-900'>{orderData.length}</div>
                    <div className='text-sm text-gray-600 font-medium'>Total Orders</div>
                  </div>
                  <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm'>
                    <div className='text-2xl font-bold text-green-600'>
                      {orderData.filter(item => item.status === 'Delivered').length}
                    </div>
                    <div className='text-sm text-gray-600 font-medium'>Delivered</div>
                  </div>
                  <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {orderData.filter(item => item.status !== 'Delivered').length}
                    </div>
                    <div className='text-sm text-gray-600 font-medium'>In Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-8xl mx-auto px-1 lg:px-8 py-8'>
        <div className='space-y-8'>
          {orderData.length === 0 ? (
            <div className='text-center py-16'>
              <div className='w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-lg'>
                <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>No Orders Yet</h3>
              <p className='text-gray-600 text-lg'>Start your shopping journey to see your orders here</p>
              <div className='mt-6'>
                <div className='inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors cursor-pointer'>
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
                <div key={index} className='rounded-xl border border-gray-300 overflow-hidden hover:border-gray-300 transition-all duration-300 group shadow-md hover:shadow-md'>
                  {/* Order Header */}
                  <div className='bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200'>
                    <div className='flex flex-col md:flex-row gap-4 md:gap-0 md:items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                        <span className='text-sm font-medium text-gray-700'>Order #{item.orderId.slice(-8)}</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='text-right'>
                          <p className='text-sm text-gray-500 font-medium'>Order Status :</p>
                          {/* <p className='text-sm font-semibold text-gray-900'>{item.status}</p> */}
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='p-6'>
                    <div className='grid grid-cols-1 xl:grid-cols-12 gap-8'>
                      {/* Product Section - Takes 8 columns on xl screens */}
                      <div className='xl:col-span-8'>
                        <div className='flex flex-col lg:flex-row gap-6'>
                          {/* Product Image */}
                          <div className='relative flex-shrink-0 self-start'>
                            <div className='w-32 h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200'>
                              <img
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                src={item.image[0]}
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
                                <h3 className='text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2'>{item.name}</h3>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-sm'>
                                  <div className='flex items-center gap-2'>
                                    <span className='text-gray-600 font-medium'>Price:</span>
                                    <span className='text-2xl font-bold text-green-600'>{currency} {item.price}</span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <span className='text-gray-600 font-medium'>Size:</span>
                                    <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium border border-gray-200'>{item.size}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Info Row */}
                              <div className='bg-gray-50 rounded-lg p-0 md:p-4 border border-gray-200'>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                  {/* Order Date */}
                                  <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                                      <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                      </svg>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <span className='text-xs font-medium text-gray-600 block mb-1'>Order Date</span>
                                      <p className='text-sm font-semibold text-gray-900'>{new Date(item.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}</p>
                                    </div>
                                  </div>

                                  {/* Expected Delivery */}
                                  {item.status !== 'Delivered' && (
                                    <div className='flex items-center gap-3'>
                                      <div className='w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                                        <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <span className='text-xs font-medium text-gray-600 block mb-1'>Expected Delivery</span>
                                        <p className='text-sm font-semibold text-gray-900'>{new Date(item.expectedDeliveryDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Payment */}
                                  <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                                      <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                                      </svg>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <span className='text-xs font-medium text-gray-600 block mb-1'>Payment</span>
                                      <p className='text-sm font-semibold text-gray-900'>{item.paymentMethod}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Return Date - Separate row if exists */}
                                {item.returnDate && (
                                  <div className='mt-4 pt-4 border-t border-gray-200'>
                                    <div className='flex items-center gap-3'>
                                      <div className='w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                                        <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                                        </svg>
                                      </div>
                                      <div className='flex-1 min-w-0'>
                                        <span className='text-xs font-medium text-gray-600 block mb-1'>Return By</span>
                                        <p className='text-sm font-semibold text-gray-900'>{new Date(item.returnDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Order Progress Bar */}
                                <div className='mt-6 pt-4 border-t border-gray-200'>
                                  <div className='flex items-center justify-between mb-3'>
                                    <h4 className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
                                      <svg className='w-4 h-4 text-green-600 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                                      </svg>
                                      Order Progress
                                    </h4>
                                    <div className='flex items-center gap-2'>
                                      <div className={`w-2 h-2 rounded-full ${getStatusClass(item.status)}`}></div>
                                      <p className="text-sm font-medium text-gray-700">{item.status}</p>
                                    </div>
                                  </div>

                                  {item.returnOrderStatus === 'Order Returned' || item.returnOrderStatus === "Return Confirmed" || item.returnOrderStatus === "Order Cancelled" || item.returnOrderStatus === "Cancel Confirmed" ? (
                                    <div className={`${selectedOrderId === item.orderId ? orderStatusLoading[item.orderId] : 'block'}`}>
                                      <div className='space-y-4'>
                                        <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                                          <div className='h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500'></div>
                                        </div>
                                        <div className='flex justify-between items-center mt-3'>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.shopping_icon} alt="" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.order_placed} alt="Order placed icon" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.packing_icon} alt="Packing icon" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.shipped_icon} alt="Shipped icon" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.delivered_icon} alt="Delivered icon" className='w-3 h-3' />
                                          </div>
                                        </div>
                                      </div>
                                      <OrderProgress item={item} />
                                    </div>
                                  ) : (
                                    <div className={`${selectedOrderId === item.orderId ? orderStatusLoading[item.orderId] : 'block'}`}>
                                      <div className='space-y-4'>
                                        <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                                          <div
                                            className='h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500'
                                            style={{ width: `${item.status === 'Packing' ? '25%' : item.status === 'Shipped' ? '50%' : item.status === 'Out for delivery' ? '75%' : item.status === 'Delivered' ? '100%' : '0%'}` }}
                                          ></div>
                                        </div>
                                        <div className='flex justify-between items-center mt-3'>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.shopping_icon} alt="" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.order_placed} alt="Order placed icon" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.packing_icon} alt="Packing icon" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.shipped_icon} alt="Shipped icon" className='w-3 h-3' />
                                          </div>
                                          <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                                            <img src={assets.delivered_icon} alt="Delivered icon" className='w-3 h-3' />
                                          </div>
                                        </div>
                                      </div>
                                      <OrderProgress item={item} />
                                    </div>
                                  )}
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
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed transition-all duration-200">
                              Return Initiated
                            </button>
                          ) : item.returnOrderStatus === "Return Confirmed" ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed transition-all duration-200">
                              Return Confirmed
                            </button>
                          ) : item.returnOrderStatus === "Order Cancelled" ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed transition-all duration-200">
                              Cancel Initiated
                            </button>
                          ) : item.returnOrderStatus === "Cancel Confirmed" ? (
                            <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed transition-all duration-200">
                              Cancel Completed
                            </button>
                          ) : (
                            isReturnExpired ? (
                              <button className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed transition-all duration-200">
                                Return Expired
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleClick(item)}
                                  className='w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg block md:hidden'
                                >
                                  Track Order
                                </button>
                                <button
                                  onClick={() => handleClickTwo()}
                                  className='w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg hidden md:block'
                                >
                                  Track Order
                                </button>
                                {item.status === 'Delivered' ? (
                                  <button
                                    onClick={() => handleReturnConfirmation(item, 'return')}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    Return Valid
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReturnConfirmation(item, 'cancel')}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-md hover:shadow-lg"
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
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-gray-200'>
            <div className='bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4'>
              <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
                Return Order Confirmation
              </h2>
            </div>
            <div className='p-6'>
              <p className='text-gray-700 mb-6'>Are you sure you want to return this product?</p>
              <textarea
                className='w-full p-4 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-gray-50 text-gray-900 placeholder-gray-500'
                placeholder='Enter return reason'
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
              />
              <div className='flex gap-3 justify-end'>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200'
                  onClick={() => handleReturnConfirmationResponse('no')}
                >
                  Cancel
                </button>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg'
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
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-gray-200'>
            <div className='bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4'>
              <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
                Cancel Order Confirmation
              </h2>
            </div>
            <div className='p-6'>
              <p className='text-gray-700 mb-6'>Are you sure you want to cancel this order?</p>
              <textarea
                className='w-full p-4 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-gray-50 text-gray-900 placeholder-gray-500'
                placeholder='Enter cancel reason'
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
              <div className='flex gap-3 justify-end'>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200'
                  onClick={() => handleCancelConfirmationResponse('no')}
                >
                  Cancel
                </button>
                <button
                  className='px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg'
                  onClick={() => handleCancelConfirmationResponse('yes', selectedOrder.orderId)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;