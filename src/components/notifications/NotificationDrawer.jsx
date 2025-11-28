import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';
import { useNotifications, useUI } from '../../hooks/useStaffPortal';
import Button from '../ui/Button';

const NotificationDrawer = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useNotifications();
  const { notificationDrawerOpen, toggleNotificationDrawer } = useUI();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type, priority) => {
    if (priority === 'urgent') {
      return <AlertTriangle className="w-5 h-5 text-danger" />;
    }

    switch (type) {
      case 'task':
        return <CheckCircle className="w-5 h-5 text-teal" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-gold" />;
      case 'info':
        return <Info className="w-5 h-5 text-info" />;
      case 'system':
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      toggleNotificationDrawer();
    }
  };

  if (!notificationDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={toggleNotificationDrawer}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[var(--shadow-lg)] z-50 animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-text-light">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsRead}
                icon={Check}
              >
                Mark all read
              </Button>
            )}
            <button
              onClick={toggleNotificationDrawer}
              className="p-2 rounded-lg hover:bg-neutral-dark transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-neutral-dark flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-medium text-text mb-1">No notifications</h3>
              <p className="text-sm text-text-light">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    relative p-4 cursor-pointer transition-colors
                    hover:bg-neutral-dark/50
                    ${!notification.read ? 'bg-primary/5' : ''}
                  `}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  )}

                  <div className="flex gap-3 pl-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm ${notification.read ? 'text-text' : 'font-semibold text-text'}`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 rounded hover:bg-neutral-dark text-text-muted hover:text-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-text-light mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-muted">
                          {formatTimestamp(notification.timestamp)}
                        </span>

                        {notification.actionUrl && (
                          <span className="text-xs text-primary flex items-center gap-0.5">
                            View <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {notification.priority === 'urgent' && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-medium text-danger bg-danger-light px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigate('/notifications');
                toggleNotificationDrawer();
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDrawer;
