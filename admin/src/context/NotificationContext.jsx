import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { ShopContext } from './ShopContext';

const NotificationContext = createContext();

const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { token } = useContext(ShopContext);

  const fetchNotifications = async () => {
    if (!token) {
      return; // Don't fetch if not authenticated
    }
    try {
      const response = await axiosInstance.get('/notifications');
      if (response.data.success) {
        // Only keep unread notifications in state so seen ones stay cleared
        const unread = response.data.notifications.filter(n => !n.isRead);
        setNotifications(unread);
        setUnreadCount(unread.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Initial load and polling for new notifications while admin is logged in
  useEffect(() => {
    if (!token) return;

    // Initial fetch
    fetchNotifications();

    // Poll every 5 seconds for new notifications
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token]);

  const markAsRead = async (notificationId) => {
    if (!token) {
      return; // Don't mark as read if not authenticated
    }
    try {
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`, {});
      if (response.data.success) {
        // Remove the notification from the list after it has been read
        setNotifications(prev =>
          prev.filter(notification => notification._id !== notificationId)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export { useNotifications }; 