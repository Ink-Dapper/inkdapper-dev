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

  return (
    <div className='border-t-2 pt-4'>
      <h1 className="sr-only">Your Orders</h1>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div className=''>
        {
          orderData.map((item, index) => {
            const [iconOpacityOne, iconOpacityTwo, iconOpacityThree, iconOpacityFour] = getOpacities(item.status);
            const isReturnExpired = calculateReturnExpiration(item.returnDate);
            return (
              <div key={index} className='py-4 border-t text-gray-700 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-28 h-32 sm:w-20 sm:h-24' src={item.image[0]} alt="" />
                  <div className=''>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p className='text-sm md:text-base'> <b>{currency} {item.price}</b></p>
                      <p className='text-xs md:text-sm'>Quantity: <span className='font-medium'>{item.quantity}</span></p>
                      <p className='text-xs md:text-sm'>Size: <span className='font-medium'>{item.size}</span></p>
                    </div>
                    <p className='mt-1 text-xs md:text-sm'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    {item.status !== 'Delivered' && (
                      <p className='mt-1 text-xs md:text-sm'>Expected Delivery: <span className='text-gray-400'>{new Date(item.expectedDeliveryDate).toDateString()}</span></p>
                    )}
                    {item.returnDate && (
                      <p className='mt-1 text-xs md:text-sm'>Return Date: <span className='text-gray-400'>{new Date(item.returnDate).toDateString()}</span></p>
                    )}
                    <p className='mt-1 text-xs md:text-sm'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                  </div>
                </div>
                {item.returnOrderStatus === 'Order Returned' || item.returnOrderStatus === "Return Confirmed" || item.returnOrderStatus === "Order Cancelled" || item.returnOrderStatus === "Cancel Confirmed" ? (
                  <div className={`h-1 rounded-full opacity-25 w-[300px] md:w-80 mt-6 ml-[6%] mb-4 bg-neutral-200 dark:bg-slate-300 top-4 relative lg:block`}>
                    <span className='absolute top-[-30px] -left-3'><img src={assets.shopping_icon} alt="" className='w-6' /></span>
                    <span className={`absolute top-[-30px] left-[42px] md:left-[52px] opacity-${item.status === 'Order placed' ? '100' : '100'}`}>
                      <img src={assets.order_placed} alt="Order placed icon" className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] left-[102px] md:left-[115px]`}>
                      <img src={assets.packing_icon} alt="Packing icon"
                        style={{ opacity: `${iconOpacityOne}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] left-[167px] md:left-[180px]`}>
                      <img src={assets.shipped_icon} alt="Shipped icon"
                        style={{ opacity: `${iconOpacityTwo}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] left-[229px] md:left-[242px]`}>
                      <img src={assets.out_for_delivery_icon} alt="Out for delivery icon"
                        style={{ opacity: `${iconOpacityThree}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] right-[-10px]`}>
                      <img src={assets.delivered_icon} alt="Delivered icon"
                        style={{ opacity: `${iconOpacityFour}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <OrderProgress item={item} />
                  </div>
                ) : (
                  <div className={`h-1 rounded-full w-[300px] md:w-80 mt-6 ml-[10%] md:ml-[6%] mb-4 bg-neutral-200 dark:bg-slate-300 top-4 relative lg:block ${selectedOrderId === item.orderId ? orderStatusLoading[item.orderId] : 'hidden'}`}>
                    <span className='absolute top-[-30px] -left-3'><img src={assets.shopping_icon} alt="" className='w-6' /></span>
                    <span className={`absolute top-[-30px] left-[42px] md:left-[52px] opacity-${item.status === 'Order placed' ? '100' : '100'}`}>
                      <img src={assets.order_placed} alt="Order placed icon" className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] left-[102px] md:left-[115px]`}>
                      <img src={assets.packing_icon} alt="Packing icon"
                        style={{ opacity: `${iconOpacityOne}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] left-[167px] md:left-[180px]`}>
                      <img src={assets.shipped_icon} alt="Shipped icon"
                        style={{ opacity: `${iconOpacityTwo}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] left-[229px] md:left-[242px]`}>
                      <img src={assets.out_for_delivery_icon} alt="Out for delivery icon"
                        style={{ opacity: `${iconOpacityThree}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <span className={`absolute top-[-30px] right-[-10px]`}>
                      <img src={assets.delivered_icon} alt="Delivered icon"
                        style={{ opacity: `${iconOpacityFour}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                    </span>
                    <OrderProgress item={item} />
                  </div>
                )}
                <div className='lg:w-1/4 flex justify-between'>
                  <OrderStatus item={item} orderStatusLoading={orderStatusLoading} selectedOrderId={selectedOrderId} />
                  <div className='flex md:flex-col gap-2'>
                    {item.returnOrderStatus === 'Order Returned' ? (
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-400 text-gray-600 cursor-not-allowed">
                        Return Initiated
                      </button>
                    ) : item.returnOrderStatus === "Return Confirmed" ? (
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-200 text-gray-400 cursor-not-allowed">
                        Return Confirmed
                      </button>
                    ) : item.returnOrderStatus === "Order Cancelled" ? (
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-200 text-gray-400 cursor-not-allowed">
                        Cancel Initiated
                      </button>
                    ) : item.returnOrderStatus === "Cancel Confirmed" ? (
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-200 text-gray-400 cursor-not-allowed">
                        Cancel Completed
                      </button>
                    ) : (
                      isReturnExpired ? (
                        <button className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-200 text-gray-500 cursor-not-allowed">
                          Return Expired
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleClick(item)} className='border px-4 py-2 text-sm font-medium rounded-sm block md:hidden'>Track Order</button>
                          <button onClick={() => handleClickTwo()} className='border px-4 py-2 text-sm font-medium rounded-sm hidden md:block'>Track Order</button>
                          {item.status === 'Delivered' ? (
                            <button onClick={() => handleReturnConfirmation(item, 'return')} className="border px-4 py-2 text-sm font-medium rounded-sm bg-black text-gray-200">
                              Return Valid
                            </button>
                          ) : (
                            <button onClick={() => handleReturnConfirmation(item, 'cancel')} className="border px-4 py-2 text-sm font-medium rounded-sm bg-black text-gray-200">
                              Cancel Order
                            </button>
                          )}
                        </>
                      )
                    )}

                    {showReturnConfirmation && (
                      <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-5 z-20 flex justify-center items-center'>
                        <div className='bg-white px-4 py-6 rounded-md w-12/12 md:w-1/4 shadow-slate-300 shadow-sm text-center'>
                          <h2 className='text-lg font-medium mb-2'>Return Order Confirmation</h2>
                          <p className='text-sm text-gray-500 mb-8'>Are you sure you want to return this product?</p>
                          <textarea
                            className='w-full p-2 border rounded-sm mb-4'
                            placeholder='Enter return reason'
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                          />
                          <div className='flex gap-2 mt-4 justify-center'>
                            <button className='bg-black text-gray-200 px-4 py-2 rounded-sm text-sm md:text-base'
                              onClick={() => handleReturnConfirmationResponse('yes', selectedOrder.orderId)}>
                              Submit
                            </button>
                            <button className='bg-gray-200 text-gray-500 px-4 py-2 rounded-sm text-sm md:text-base'
                              onClick={() => handleReturnConfirmationResponse('no')}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {showCancelConfirmation && (
                      <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-5 z-20 flex justify-center items-center'>
                        <div className='bg-white px-4 py-6 rounded-md w-12/12 md:w-1/4 shadow-slate-300 shadow-sm text-center'>
                          <h2 className='text-lg font-medium mb-2'>Cancel Order Confirmation</h2>
                          <p className='text-sm text-gray-500 mb-8'>Are you sure you want to cancel this order?</p>
                          <textarea
                            className='w-full p-2 border rounded-sm mb-4'
                            placeholder='Enter cancel reason'
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                          <div className='flex gap-2 mt-4 justify-center'>
                            <button className='bg-black text-gray-200 px-4 py-2 rounded-sm text-sm md:text-base'
                              onClick={() => handleCancelConfirmationResponse('yes', selectedOrder.orderId)}>
                              Submit
                            </button>
                            <button className='bg-gray-200 text-gray-500 px-4 py-2 rounded-sm text-sm md:text-base'
                              onClick={() => handleCancelConfirmationResponse('no')}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default Orders;