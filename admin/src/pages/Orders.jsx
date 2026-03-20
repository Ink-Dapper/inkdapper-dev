import React, { useContext, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import OrderSummaryPrint from './OrderSummaryPrint';

const handleDownloadAiDesign = async (url, itemName) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `ai-design-${itemName || 'inkdapper'}.png`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
};

const Orders = () => {
  const { orders, statusHandler } = useContext(ShopContext);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterOrderId, setFilterOrderId] = useState('');

  const onPrintClick = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    setSelectedOrder(order);
    setOpen(true);
  }

  function printSection(sectionId, onClose) {
    const section = document.getElementById(sectionId);
    const printWindow = window.open('', 'Order', 'height=500,width=800');
    printWindow.document.write('</head><body>');
    printWindow.document.write(section.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    if (typeof onClose === 'function') onClose();
  }
  const handleClose = () => {
    setOpen(false);
  };

  const filteredOrders = orders.filter(order => order._id.includes(filterOrderId));

  // Status badge component
  const StatusBadge = ({ status, returnStatus }) => {
    if (returnStatus === "Order Placed") {
      const statusColors = {
        "Order Placed": "bg-blue-100 text-blue-800 border-blue-200",
        "Packing": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
        "Out for delivery": "bg-orange-100 text-orange-800 border-orange-200",
        "Delivered": "bg-green-100 text-green-800 border-green-200"
      };

      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {status}
        </span>
      );
    } else {
      const returnColors = {
        "Order Returned": "bg-red-100 text-red-800 border-red-200",
        "Return Confirmed": "bg-red-200 text-red-900 border-red-300",
        "Order Cancelled": "bg-gray-100 text-gray-800 border-gray-200",
        "Cancel Confirmed": "bg-gray-200 text-gray-900 border-gray-300"
      };

      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${returnColors[returnStatus] || 'bg-red-100 text-red-800 border-red-200'}`}>
          {returnStatus === "Order Returned" ? "Return Initiated" :
            returnStatus === "Return Confirmed" ? "Return Completed" :
              returnStatus === "Order Cancelled" ? "Order Cancelled" :
                returnStatus === "Cancel Confirmed" ? "Cancel Completed" : "Return Initiated"}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">Manage and track all customer orders</p>

              {/* Search Filter */}
              <div className="mt-6 max-w-md">
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link to="/complete-delivery">
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete Deliveries
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            console.log(order),
            order.status !== "Delivered" && order.returnOrderStatus === "Order Placed" && (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <img className="w-6 h-6" src={assets.parcel_icon} alt="Order" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} returnStatus={order.returnOrderStatus} />
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Products Section */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Products ({order.items.length})
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="py-2 px-3 bg-gray-50 rounded-lg">
<<<<<<< HEAD
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
=======
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {item.image && item.image[0] && (
                                  <img
                                    src={item.image[0]}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white flex-shrink-0"
                                  />
                                )}
                                <span className="font-medium text-gray-900 truncate">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Qty: {item.quantity}
                                </span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {item.size}
                                </span>
                              </div>
                            </div>
                            {(item.isCustom || item.reviewImageCustom || item.aiDesignUrl) && (() => {
                              const imgSrc = (Array.isArray(item.reviewImageCustom) ? item.reviewImageCustom[0] : item.reviewImageCustom) || item.aiDesignUrl;
                              return imgSrc ? (
                                <div className="mt-2 pt-2 border-t border-purple-100 flex items-center gap-3">
                                  <img
                                    src={imgSrc}
                                    alt="Custom Design"
                                    className="w-16 h-16 object-contain rounded-lg border border-purple-200 bg-white"
                                  />
<<<<<<< HEAD
                                  <div>
                                    <p className="text-xs font-semibold text-purple-700 mb-1">Custom Design</p>
=======
                                  <div className='flex flex-col'>
                                    <div>
                                    <p className="text-xs font-semibold text-purple-700 mb-1">Custom Design</p>
                                    </div>
                                    <div className='flex gap-3'>
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                                    <button
                                      onClick={() => handleDownloadAiDesign(imgSrc, item.name)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                      </svg>
                                      Download Mockup
                                    </button>
                                    {item.rawDesignUrl && (
                                      <button
                                        onClick={() => handleDownloadAiDesign(item.rawDesignUrl, `original-${item.name}`)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Original
                                      </button>
                                    )}
<<<<<<< HEAD
=======
                                    </div>
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        ))}
                      </div>

                      {/* Customer Details */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Customer Details
                        </h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="font-semibold text-gray-900 mb-2">
                            {order.address.firstName} {order.address.lastName}
                          </p>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state}, {order.address.country} {order.address.zipcode}</p>
                            <p className="font-medium">{order.address.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                      {/* Payment & Shipping Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          {order.status === "Delivered" && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivered:</span>
                              <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Total Amount</h4>
                        <div className="text-3xl font-bold text-blue-600">
                          {currency} {order.amount}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        {order.returnOrderStatus === "Order Placed" ? (
                          <>
                            <FormControl fullWidth size="small">
                              <Select
                                onChange={(event) => statusHandler(event, order._id)}
                                value={order.status}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: 'white'
                                  }
                                }}
                              >
                                <MenuItem value="Order Placed">Order Placed</MenuItem>
                                <MenuItem value="Packing">Packing</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Out for delivery">Out for delivery</MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                              </Select>
                            </FormControl>

                            <button
                              onClick={() => onPrintClick(order._id)}
                              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print Order
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.filter(order => order.status !== "Delivered" && order.returnOrderStatus === "Order Placed").length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">There are no pending orders to display at the moment.</p>
            </div>
          </div>
        )}
      </div>

      {/* Print Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent className="p-6">
          <DialogContentText id="alert-dialog-description">
            {selectedOrder && (
              <div id="printable-section">
                <OrderSummaryPrint order={selectedOrder} currency={currency} />
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  printSection("printable-section", handleClose);
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Order Summary
              </button>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleClose}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Orders