import React, { useContext, useEffect, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ReturnOrderCompleted = () => {
  const { orders } = useContext(ShopContext);
  const [filterOrderId, setFilterOrderId] = useState('');

  const filteredOrders = orders.filter(order =>
    order.returnOrderStatus === "Return Confirmed" &&
    order._id.toLowerCase().includes(filterOrderId.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Completed Returns</h1>
            <p className="text-gray-600 mb-4">View all successfully processed return orders</p>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <Link to='/return-orders'>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Returns
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Completed Returns Found</h3>
            <p className="text-gray-600">There are currently no completed return orders matching your search criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <img className="w-6 h-6" src={assets.parcel_icon} alt="Order" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Order #{order._id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{currency} {order.amount}</div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {item.size}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Customer Information */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Customer Details
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 mb-2">
                          {order.address.firstName + " " + order.address.lastName}
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state}, {order.address.country}</p>
                          <p>ZIP: {order.address.zipcode}</p>
                          <p className="font-medium">📞 {order.address.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order ID */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Order ID:</p>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded border">{order._id}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items:</span>
                          <span className="font-medium">{order.items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                            {order.payment ? '✅ Done' : '⏳ Pending'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        {order.status === "Delivered" && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivered Date:</span>
                            <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Total Amount:</p>
                      <p className="text-2xl font-bold text-green-700">{currency} {order.amount}</p>
                    </div>

                    {/* Return Status */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Return Status:</p>
                      <p className="text-lg font-semibold text-red-700">{order.returnOrderStatus}</p>
                    </div>
                  </div>
                </div>

                {/* Return Reason */}
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-semibold text-red-700">Return Reason</p>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">{order.returnReason}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReturnOrderCompleted