import React from 'react';

const OrderProgress = ({ item }) => {
  // Perfect progress calculation based on order status
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Order placed':
        return 20;
      case 'Packing':
        return 40;
      case 'Shipped':
        return 60;
      case 'Out for delivery':
        return 80;
      case 'Delivered':
        return 100;
      default:
        return 20;
    }
  };

  // Get icon states based on progress
  const getIconStates = (status) => {
    const progress = getProgressPercentage(status);
    return {
      orderPlaced: progress >= 20,
      packing: progress >= 40,
      shipped: progress >= 60,
      outForDelivery: progress >= 80,
      delivered: progress >= 100
    };
  };

  const progressPercentage = getProgressPercentage(item.status);
  const iconStates = getIconStates(item.status);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-full">
      {/* Background track - always visible */}
      <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
      
      {/* Progress fill - shows completed portion */}
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-sm relative z-10"
        style={{
          width: `${progressPercentage}%`,
        }}
      >
        {/* Add a subtle shimmer effect */}
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default OrderProgress;