import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    // Close the dropdown and navigate to Orders page
    setIsOpen(false);
    navigate('/orders');
  };

  const formatOrderSummary = (notification) => {
    const order = notification.orderId;
    if (!order) return null;

    const shortId = order._id ? order._id.slice(-8) : '';
    const method = order.paymentMethod || 'Unknown method';
    const amount = typeof order.amount === 'number' ? order.amount.toFixed(2) : order.amount;

    return `Order #${shortId} • ${method} • ₹${amount}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No notifications</p>
              ) : (
                notifications.map((notification) => {
                  const orderSummary = formatOrderSummary(notification);
                  return (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          New Order
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      {orderSummary && (
                        <p className="text-xs text-gray-600 mt-1">
                          {orderSummary}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;