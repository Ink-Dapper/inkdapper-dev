import React from 'react';

const OrderStatus = ({ item, orderStatusLoading, selectedOrderId }) => {
  const statusColors = {
    'Order placed': 'bg-[#FFB26F]',
    'Packing': 'bg-[#FAB12F]',
    'Shipped': 'bg-[#FC8F54]',
    'Out for delivery': 'bg-[#FA812F]',
    'Delivered': 'bg-[#FA4032]',
  };

  const statusClass = statusColors[item.status] || 'bg-[#FFB26F]'; // Default color

  return (

    <div className={`flex items-center gap-2 lg:flex ${selectedOrderId === item.orderId ? orderStatusLoading[item.orderId] : 'hidden'}`}>
      {item.returnOrderStatus === 'Order Returned' || item.returnOrderStatus === "Return Confirmed" ?
        <>
          <p className={`min-w-2 h-2 rounded-full bg-gray-500`}></p>
          <p className="text-sm md:text-base">Returned</p>
        </> :
        item.returnOrderStatus === 'Order Cancelled' ?
        <>
          <p className={`min-w-2 h-2 rounded-full bg-gray-500`}></p>
          <p className="text-sm md:text-base">Cancel Initiated</p>
        </> :
        item.returnOrderStatus === 'Cancel Confirmed' ?
        <>
          <p className={`min-w-2 h-2 rounded-full bg-gray-500`}></p>
          <p className="text-sm md:text-base">Cancel</p>
        </> :
        <>
        </>
      }
    </div>
  );
};

export default OrderStatus;