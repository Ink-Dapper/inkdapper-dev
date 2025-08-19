import React, { useContext, useEffect, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const CancelOrderCompleted = () => {
  const { orders, handleReturnConfirmationResponse, deductCreditPoints } = useContext(ShopContext);
  const [filterOrderId, setFilterOrderId] = useState('');

  const filteredOrders = orders.filter(order => order._id.includes(filterOrderId));

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Cancel Order Management</h1>
                <p className="text-gray-600">View and manage completed order cancellations</p>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Cancelled Orders Found</h3>
              <p className="text-gray-500">Orders with "Cancel Confirmed" status will appear here</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              order.returnOrderStatus === "Cancel Confirmed" && (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500 p-2 rounded-lg">
                          <img className="w-6 h-6" src={assets.parcel_icon} alt="Order" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Order #{order._id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {order.returnOrderStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Products Section */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Products ({order.items.length})
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                              </div>
                              <div className="text-right">
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Customer Details
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="font-semibold text-gray-800 mb-2">
                            {order.address.firstName} {order.address.lastName}
                          </p>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state}</p>
                            <p>{order.address.country} - {order.address.zipcode}</p>
                            <p className="font-medium text-gray-700 mt-2">{order.address.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Order Summary
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium text-gray-800">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          {order.status === "Delivered" && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Delivered:</span>
                              <span className="font-medium text-gray-800">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                              <span className="text-2xl font-bold text-red-600">{currency} {order.amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cancel Reason */}
                    <div className="mt-6 bg-red-50 rounded-xl p-6 border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Cancellation Reason
                      </h4>
                      <p className="text-lg text-red-700 font-medium leading-relaxed">{order.cancelReason}</p>
                    </div>
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CancelOrderCompleted