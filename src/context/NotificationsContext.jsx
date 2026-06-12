import React, { createContext, useState, useCallback, useEffect } from 'react';
import {
  getNotificationsForUser,
  addNotificationForUser,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotificationFromStore,
  clearNotificationsForUser
} from '../utils/notificationStore';

export const NotificationsContext = createContext();

export function NotificationsProvider({ children, currentUserId }) {
  const [notifications, setNotifications] = useState(() => getNotificationsForUser(currentUserId));

  useEffect(() => {
    setNotifications(getNotificationsForUser(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getNotificationsForUser(currentUserId));
    };
    window.addEventListener('notifications-updated', handleUpdate);
    return () => window.removeEventListener('notifications-updated', handleUpdate);
  }, [currentUserId]);

  const addNotification = useCallback((notification) => {
    const added = addNotificationForUser(currentUserId, notification);
    setNotifications(getNotificationsForUser(currentUserId));
    return added;
  }, [currentUserId]);

  const markAsRead = useCallback((id) => {
    markNotificationRead(currentUserId, id);
    setNotifications(getNotificationsForUser(currentUserId));
  }, [currentUserId]);

  const markAllAsRead = useCallback(() => {
    markAllNotificationsRead(currentUserId);
    setNotifications(getNotificationsForUser(currentUserId));
  }, [currentUserId]);

  const deleteNotification = useCallback((id) => {
    deleteNotificationFromStore(currentUserId, id);
    setNotifications(getNotificationsForUser(currentUserId));
  }, [currentUserId]);

  const clearAll = useCallback(() => {
    clearNotificationsForUser(currentUserId);
    setNotifications([]);
  }, [currentUserId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
}
