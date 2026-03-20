import React, { useContext, useEffect, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ReturnOrders = () => {
  const { orders, handleReturnConfirmationResponse, deductCreditPoints } = useContext(ShopContext);
  const [filterOrderId, setFilterOrderId] = useState('');

  const filteredOrders = orders.filter(order => order._id.includes(filterOrderId));

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Return Orders</h1>
            <p className="text-gray-600 mb-4">Manage and process customer return requests</p>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <Link to='/return-orders-complete'>
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed Returns
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Return Orders Found</h3>
            <p className="text-gray-600">There are currently no return orders matching your search criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            order.returnOrderStatus !== "Order Placed" && order.returnOrderStatus !== "Return Confirmed" && order.returnOrderStatus !== "Order Cancelled" && order.returnOrderStatus !== "Cancel Confirmed" && (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <img className="w-6 h-6" src={assets.parcel_icon} alt="Order" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{currency} {order.amount}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.returnOrderStatus === "Return Requested" ? "bg-orange-100 text-orange-800" :
                        order.returnOrderStatus === "Return Processing" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {order.returnOrderStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Products ({order.items.length})
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Qty: {item.quantity}</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Size: {item.size}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Payment Info */}
                    <div className="space-y-6">
                      {/* Customer Information */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Customer Details
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-semibold text-gray-800 mb-2">{order.address.firstName} {order.address.lastName}</p>
                          <p className="text-sm text-gray-600 mb-1">{order.address.street}</p>
                          <p className="text-sm text-gray-600 mb-1">{order.address.city}, {order.address.state}</p>
                          <p className="text-sm text-gray-600 mb-2">{order.address.country} - {order.address.zipcode}</p>
                          <p className="text-sm text-gray-600">{order.address.phone}</p>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Payment Details
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Method:</span>
                            <span className="text-sm font-medium text-gray-800">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`text-sm font-medium px-2 py-1 rounded ${order.payment ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          {order.status === "Delivered" && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Delivered:</span>
                              <span className="text-sm font-medium text-gray-800">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return Reason */}
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Return Reason
                    </h4>
                    <p className="text-red-700 font-medium">{order.returnReason}</p>
                  </div>

                  {/* Action Button */}
                  {order.returnOrderStatus !== "Return Confirmed" && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          handleReturnConfirmationResponse(order._id, order.userId);
                          deductCreditPoints(order.userId, 5);
                        }}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Complete Return
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  )
}

export default ReturnOrders;