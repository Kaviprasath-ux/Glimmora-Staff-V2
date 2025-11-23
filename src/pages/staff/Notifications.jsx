import { useState } from 'react';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';
import NotificationItem from '../../components/notifications/NotificationItem';
import { BellIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
  } = useStaffNotifications();

  const [filter, setFilter] = useState('all');

  const unreadCount = getUnreadCount();

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return notif.type === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'read', label: 'Read', count: notifications.length - unreadCount },
    { value: 'task', label: 'Tasks', count: notifications.filter(n => n.type === 'task').length },
    { value: 'room', label: 'Rooms', count: notifications.filter(n => n.type === 'room').length },
    { value: 'schedule', label: 'Schedule', count: notifications.filter(n => n.type === 'schedule').length },
  ];

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      clearAllNotifications();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Notifications</h1>
          <p className="text-neutral-600">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
            >
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <div className="text-2xl font-bold text-neutral-900">{notifications.length}</div>
            <div className="text-sm text-neutral-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{unreadCount}</div>
            <div className="text-sm text-neutral-600">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
            <div className="text-sm text-neutral-600">Read</div>
          </div>
        </div>

        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellIcon className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No notifications</h3>
          <p className="text-neutral-600">
            {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
