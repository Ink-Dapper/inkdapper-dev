import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axios';
import { ShopContext } from './ShopContext';

const NotificationContext = createContext();

const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token } = useContext(ShopContext);
  // Track last fetch time to avoid stampeding polls
  const lastFetchRef = useRef(0);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await axiosInstance.get('/notifications');
      if (response.data.success) {
        const all = response.data.notifications || [];
        setNotifications(all);
        setUnreadCount(all.filter(n => !n.isRead).length);
      }
    } catch (error) {
      // Silently ignore network errors during background polling
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();

    // Poll every 30 seconds (was 5s — 5s is too aggressive and floods the console)
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [token]);

  const markAsRead = async (notificationId) => {
    if (!token) return;
    try {
      const response = await axiosInstance.patch(`/notifications/${notificationId}/read`, {});
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    if (!unreadIds.length) return;

    // Update UI first so badge clears immediately
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await Promise.allSettled(
        unreadIds.map(id => axiosInstance.patch(`/notifications/${id}/read`, {}))
      );
    } catch (error) {
      // Refresh to get real state if something failed
      fetchNotifications();
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export { useNotifications };
