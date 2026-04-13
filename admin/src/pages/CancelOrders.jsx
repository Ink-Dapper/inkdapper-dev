import React, { useContext, useEffect, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const CancelOrders = () => {
  const { orders, handleReturnConfirmationResponse, deductCreditPoints, handleCancelConfirmationResponse } = useContext(ShopContext);
  const [filterOrderId, setFilterOrderId] = useState('');

  const filteredOrders = orders.filter(order => order._id.includes(filterOrderId));

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">Cancel Orders</h1>
                <p className="text-gray-600 text-sm lg:text-base">Manage and process order cancellation requests</p>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-sm lg:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Completed Orders Button */}
            <div>
              <Link to="/cancel-order-completed">
                <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed Orders
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Cancellation Requests Found</h3>
              <p className="text-gray-500">
                {filterOrderId ? "Try adjusting your search criteria" : "There are no pending cancellation requests at the moment"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              order.returnOrderStatus !== "Order Placed" && order.returnOrderStatus !== "Return Confirmed" && order.returnOrderStatus !== "Cancel Confirmed" && order.returnOrderStatus !== "Order Returned" && (
                <div key={index} className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  {/* Enhanced Order Header */}
                  <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-red-600 px-8 py-6">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30 shadow-lg">
                          <img className="w-8 h-8" src={assets.parcel_icon} alt="Order" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-2xl mb-1">Order #{order._id.slice(-8)}</h3>
                          <p className="text-red-100 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                          <p className="text-3xl font-bold text-white mb-2">{currency} {order.amount}</p>
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/30 ${order.returnOrderStatus === "Pending" ? "bg-yellow-500/30 text-yellow-100" :
                            order.returnOrderStatus === "Processing" ? "bg-blue-500/30 text-blue-100" :
                              "bg-gray-500/30 text-gray-100"
                            }`}>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {order.returnOrderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Order Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                      {/* Products Section */}
                      <div className="xl:col-span-2">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-6">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            Products ({order.items.length})
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-lg mb-1">
                                      {item.name}
                                      {item.code && (
                                        <span className="ml-2 text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded align-middle">
                                          {item.code}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2">
                                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                      </svg>
                                      Size: {item.size}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Enhanced Customer Information */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            Customer Details
                          </h4>
                          <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
                            <p className="font-bold text-gray-800 mb-4 text-xl">
                              {order.address.firstName} {order.address.lastName}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                  <div className="bg-blue-100 p-2 rounded-lg">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">{order.address.street}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                  <div className="bg-purple-100 p-2 rounded-lg">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">{order.address.city}, {order.address.state}</span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                  <div className="bg-orange-100 p-2 rounded-lg">
                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">{order.address.country} - {order.address.zipcode}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                  <div className="bg-green-100 p-2 rounded-lg">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">{order.address.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Order Summary & Actions */}
                      <div className="xl:col-span-2 space-y-6">
                        {/* Enhanced Order Summary */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            Order Summary
                          </h4>
                          <div className="bg-white rounded-xl p-6 space-y-4 border border-purple-200 shadow-sm">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-gray-600 font-medium">Payment Method:</span>
                              <span className="font-bold text-gray-800">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-gray-600 font-medium">Payment Status:</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.payment
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                                }`}>
                                {order.payment ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-gray-600 font-medium">Order Date:</span>
                              <span className="font-bold text-gray-800">{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            {order.status === "Delivered" && (
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 font-medium">Delivered:</span>
                                <span className="font-bold text-gray-800">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Action Button */}
                        {order.returnOrderStatus !== "Return Confirmed" ? (
                          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                            <h4 className="font-bold text-red-800 mb-4 flex items-center gap-3 text-lg">
                              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              Cancel Order
                            </h4>
                            <button
                              onClick={() => {
                                handleCancelConfirmationResponse(order._id, order.userId);
                                deductCreditPoints(order.userId, 5);
                              }}
                              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Confirm Cancellation
                            </button>
                            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-100 rounded-xl border border-yellow-200">
                              <p className="text-sm text-yellow-800 text-center font-bold">
                                ⚠️ This will deduct 5 credit points from the customer
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-3 text-lg">
                              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              Already Confirmed
                            </h4>
                            <p className="text-sm text-green-700 text-center font-medium">
                              This order has already been confirmed for cancellation
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Cancel Reason */}
                    <div className="mt-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
                      <h4 className="font-bold text-red-800 mb-4 flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Cancellation Reason
                      </h4>
                      <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
                        <p className="text-xl text-gray-800 font-semibold leading-relaxed">{order.cancelReason}</p>
                      </div>
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

export default CancelOrders