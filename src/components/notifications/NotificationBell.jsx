import { Bell } from 'lucide-react';
import { useNotifications, useUI } from '../../hooks/useStaffPortal';

const NotificationBell = ({ className = '' }) => {
  const { unreadCount, urgentNotifications } = useNotifications();
  const { toggleNotificationDrawer } = useUI();

  const hasUrgent = urgentNotifications.length > 0;

  return (
    <button
      onClick={toggleNotificationDrawer}
      className={`
        relative p-2 rounded-[10px] transition-all duration-200
        hover:bg-neutral-dark text-text-light hover:text-text
        ${className}
      `}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className={`w-5 h-5 ${hasUrgent ? 'animate-pulse text-danger' : ''}`} />

      {unreadCount > 0 && (
        <span
          className={`
            absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
            flex items-center justify-center
            text-xs font-bold text-white rounded-full px-1
            ${hasUrgent ? 'bg-danger' : 'bg-primary'}
          `}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
