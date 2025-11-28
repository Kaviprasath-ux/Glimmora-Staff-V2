import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notifications as seedNotifications } from '../data/notifications';

const StaffNotificationsContext = createContext(null);
const STORAGE_KEY = 'glimmora_staff_notifications';

function generateId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load notifications from localStorage', err);
  }
  return null;
}

function saveNotifications(notifications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications to localStorage', err);
  }
}

export function StaffNotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const loaded = loadNotifications();
    return loaded || seedNotifications.map(n => ({
      ...n,
      message: n.message || n.title,
      timestamp: n.timestamp || new Date().toISOString(),
      read: n.read ?? false,
    }));
  });

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const addNotification = useCallback((notificationData) => {
    const newNotification = {
      id: generateId(),
      type: notificationData.type || 'general',
      title: notificationData.title,
      message: notificationData.message || notificationData.title,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, read: true };
      }
      return n;
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const value = {
    notifications,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
  };

  return (
    <StaffNotificationsContext.Provider value={value}>
      {children}
    </StaffNotificationsContext.Provider>
  );
}

export function useStaffNotifications() {
  const context = useContext(StaffNotificationsContext);
  if (!context) {
    throw new Error('useStaffNotifications must be used within a StaffNotificationsProvider');
  }
  return context;
}
