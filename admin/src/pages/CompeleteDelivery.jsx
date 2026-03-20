import React, { useContext, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { FaCheckCircle, FaBox, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard, FaRupeeSign, FaUndo } from 'react-icons/fa';

const CompeleteDelivery = () => {
  const { orders } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'returned' && order.returnOrderStatus === "Return Confirmed") ||
      (filterStatus === 'delivered' && order.returnOrderStatus !== "Return Confirmed");

    return order.status === "Delivered" && matchesSearch && matchesStatus;
  });

  const deliveredOrders = filteredOrders.filter(order => order.returnOrderStatus !== "Return Confirmed");
  const returnedOrders = filteredOrders.filter(order => order.returnOrderStatus === "Return Confirmed");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Completed Deliveries</h1>
              <p className="text-gray-600">Manage and view all successfully delivered orders</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{filteredOrders.length}</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <FaUser className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered Only</option>
              <option value="returned">Returned Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successfully Delivered</p>
              <p className="text-2xl font-bold text-green-600">{deliveredOrders.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Returned Orders</p>
              <p className="text-2xl font-bold text-orange-600">{returnedOrders.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUndo className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FaBox className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">No completed deliveries match your current filters.</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <FaBox className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order._id?.slice(-8) || `ORD${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <FaCalendarAlt className="inline mr-1" />
                        Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {order.returnOrderStatus === "Return Confirmed" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        <FaUndo className="mr-1" />
                        Returned
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" />
                        Delivered
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Products Section */}
                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FaBox className="mr-2 text-gray-500" />
                      Products ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {currency} {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        Customer Details
                      </h4>
                      <p className="font-medium text-gray-900">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{order.address.phone}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>{order.address.country} - {order.address.zipcode}</p>
                      </div>
                    </div>

                    {/* Payment & Order Info */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <FaCreditCard className="mr-2 text-green-500" />
                        Payment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items:</span>
                          <span className="font-medium">{order.items.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Total Amount</p>
                          <p className="text-2xl font-bold">
                            {currency} {order.amount}
                          </p>
                        </div>
                        <FaRupeeSign className="text-3xl opacity-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompeleteDelivery;