import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Clock, CheckCircle, Info, X, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../hooks/useStaffPortal';

const NotificationBell = ({ className = '' }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, urgentNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasUrgent = urgentNotifications.length > 0;
  const hasNotifications = unreadCount > 0;

  // Get first 5 notifications
  const displayedNotifications = notifications.slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Info className="w-4 h-4 text-teal" />;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/housekeeping/notifications');
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2.5 rounded-full transition-all duration-200 group
          bg-white border border-border hover:border-primary-200
          ${hasNotifications ? 'text-primary' : 'text-text-muted hover:text-text'}
          ${className}
        `}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className={`w-5 h-5 transition-transform group-hover:scale-105 ${hasUrgent ? 'animate-pulse' : ''}`} />

        {hasNotifications && (
          <span
            className={`
              absolute -top-1 -right-1 min-w-[20px] h-[20px]
              flex items-center justify-center
              text-[11px] font-semibold text-white rounded-full px-1.5
              shadow-sm
              ${hasUrgent ? 'bg-danger' : 'bg-primary'}
            `}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-[16px] border border-border shadow-lg overflow-hidden z-50 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="font-semibold text-text">Notifications</h3>
              <p className="text-xs text-text-muted">{unreadCount} unread</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-neutral transition-colors text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[320px] overflow-y-auto">
            {displayedNotifications.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-neutral flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">No notifications yet</p>
              </div>
            ) : (
              displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                    hover:bg-primary-50 border-b border-border last:border-b-0
                    ${!notification.read ? 'bg-primary-50/50' : ''}
                  `}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  )}

                  {/* Icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${notification.type === 'urgent' ? 'bg-danger/10' :
                      notification.type === 'warning' ? 'bg-warning/10' :
                      notification.type === 'success' ? 'bg-success/10' : 'bg-teal/10'}
                  `}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notification.read ? 'font-medium text-text' : 'text-text-muted'}`}>
                        {notification.title}
                      </p>
                      {notification.type === 'urgent' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-danger text-white shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[11px] text-text-muted/70 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border p-3">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary-50 rounded-[10px] transition-colors"
              >
                View All Notifications
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
