import { createContext, useContext, useState, useEffect } from 'react';

const StaffNotificationsContext = createContext();

export const useStaffNotifications = () => {
  const context = useContext(StaffNotificationsContext);
  if (!context) {
    throw new Error('useStaffNotifications must be used within StaffNotificationsProvider');
  }
  return context;
};

const initialNotifications = [
  {
    id: 'NOTIF001',
    type: 'task',
    title: 'New Task Assigned',
    message: 'Deep Clean Suite 305 has been assigned to you',
    timestamp: '2025-11-20T08:00:00',
    read: false,
    priority: 'high',
  },
  {
    id: 'NOTIF002',
    type: 'room',
    title: 'Room Ready for Inspection',
    message: 'Room 412 is ready for quality inspection',
    timestamp: '2025-11-20T11:45:00',
    read: false,
    priority: 'medium',
  },
  {
    id: 'NOTIF003',
    type: 'schedule',
    title: 'Shift Reminder',
    message: 'Your shift starts in 30 minutes',
    timestamp: '2025-11-20T06:30:00',
    read: true,
    priority: 'low',
  },
  {
    id: 'NOTIF004',
    type: 'task',
    title: 'Task Due Soon',
    message: 'Turndown Service - Suite 501 is due at 6:00 PM',
    timestamp: '2025-11-20T17:30:00',
    read: false,
    priority: 'high',
  },
  {
    id: 'NOTIF005',
    type: 'room',
    title: 'VIP Guest Arrival',
    message: 'VIP guest checking into Suite 305 at 2:00 PM',
    timestamp: '2025-11-20T13:00:00',
    read: true,
    priority: 'high',
  },
];

export const StaffNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('glimmora_staff_notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('glimmora_staff_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: `NOTIF${String(notifications.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(notif => notif.type === type);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getNotificationsByType,
    clearAllNotifications,
  };

  return (
    <StaffNotificationsContext.Provider value={value}>
      {children}
    </StaffNotificationsContext.Provider>
  );
};
