import { useState } from 'react';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';
import NotificationItem from '../../components/notifications/NotificationItem';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-deepgreen">Notifications</h1>
          <p className="text-neutral-600 mt-1">Stay updated with your tasks and assignments</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <CheckIcon className="h-5 w-5" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-neutral-600 text-sm">Total</div>
            <BellIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{notifications.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-neutral-600 text-sm">Unread</div>
            <BellIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{unreadCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-neutral-600 text-sm">Read</div>
            <CheckIcon className="h-5 w-5 text-deepgreen" />
          </div>
          <div className="text-3xl font-bold text-deepgreen">
            {notifications.length - unreadCount}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <FunnelIcon className="h-5 w-5 text-neutral-600" />
          <span className="font-medium text-neutral-900">Filter</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-12 text-center">
          <div className="text-neutral-400 mb-2">
            <BellIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">No notifications</h3>
          <p className="text-neutral-600">
            {filter === 'all'
              ? "You're all caught up!"
              : `No ${filter} notifications at the moment`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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
