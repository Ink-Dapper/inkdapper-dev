import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from '../utils/axios';
import Title from '../components/Title';

const OrderDetails = () => {
  const { productId } = useParams();
  const { backendUrl, token, currency, delivery_fee } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [productData, setProductData] = useState([]);
  const [isReturnExpired, setIsReturnExpired] = useState(false);

  const fetchOrderDetailsAndProducts = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(backendUrl + '/api/order/user-details', {}, { headers: { token } });
      if (response.data.success) {
        console.log(response.data.orders)
        setOrderData(response.data.orders);
        const order = response.data.orders.find(order => order._id === productId);
        if (order) {
          setProductData([order]);
          const currentDate = new Date();
          const returnDate = new Date(order.returnDate);
          if (currentDate > returnDate) {
            setIsReturnExpired(true);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrderDetailsAndProducts();
    console.log(productData)
  }, [token, productId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReturnStatusColor = (isExpired) => {
    return isExpired
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <Title text1={'ORDER'} text2={'DETAILS'} />
          </div>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
        </div>

        {/* Order Details */}
        {productData.map((order, index) => (
          <div key={index} className="space-y-6 animate-fade-in-up animation-delay-2000">
            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                {order.returnOrderStatus === "Order Returned" && (
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600">Return Requested</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(order.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {order.status === "Delivered" && (
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600">Delivered On</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {order.status !== "Delivered" && (
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600">Expected Delivery</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {order.deliveryDate && (
                  <div className={`text-center p-4 rounded-xl border ${getReturnStatusColor(isReturnExpired)}`}>
                    <p className="text-sm font-medium">Return Period</p>
                    <p className="text-lg font-semibold mt-1">
                      {isReturnExpired ? "Expired" : "Valid"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Order Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Product Image */}
                  <div className="lg:col-span-1">
                    <div className="relative group">
                      <img
                        className="w-full h-80 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300"
                        src={order.items[0].image[0]}
                        alt={order.items[0].name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Shipping Address
                      </h3>
                      <div className="space-y-1 text-gray-700">
                        <p className="font-medium">{order.address.firstName}</p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city} - {order.address.zipcode}</p>
                        <p>{order.address.state}, {order.address.country}</p>
                        <p className="text-orange-600 font-medium">📞 {order.address.phone}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Method
                      </h3>
                      <p className="text-lg font-semibold text-gray-800">{order.paymentMethod}</p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Order Summary
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold text-gray-900">{order.items[0].quantity} items</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Items Subtotal:</span>
                          <span className="font-semibold text-gray-900">{currency} {order.items[0].price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-semibold text-gray-900">
                            {currency} {typeof delivery_fee === 'number' ? `${delivery_fee}.00` : delivery_fee}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-900">{currency} {order.amount}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                            <span className="text-xl font-bold text-orange-600">{currency} {order.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status</h3>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${order.status === 'Delivered' ? 'bg-emerald-500' :
                      order.status === 'Shipped' ? 'bg-blue-500' :
                        order.status === 'Processing' ? 'bg-orange-500' :
                          'bg-gray-500'
                      }`}></div>
                    {order.status}
                  </span>
                </div>

                <Link to={`/product/${order.items[0].slug}`}>
                  <button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Buy It Again
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderDetails