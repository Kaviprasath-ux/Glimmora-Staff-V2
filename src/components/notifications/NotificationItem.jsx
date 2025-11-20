import {
  ClipboardDocumentListIcon,
  HomeModernIcon,
  ClockIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const typeConfig = {
    task: {
      icon: ClipboardDocumentListIcon,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    room: {
      icon: HomeModernIcon,
      color: 'text-teal',
      bgColor: 'bg-teal/10',
    },
    schedule: {
      icon: ClockIcon,
      color: 'text-deepgreen',
      bgColor: 'bg-deepgreen/10',
    },
  };

  const priorityColors = {
    high: 'border-l-4 border-l-gold',
    medium: 'border-l-4 border-l-teal',
    low: 'border-l-4 border-l-neutral-300',
  };

  const config = typeConfig[notification.type] || typeConfig.task;
  const Icon = config.icon;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`bg-white border border-neutral-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all ${
        !notification.read ? `${priorityColors[notification.priority]} bg-neutral-50/50` : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`${config.bgColor} p-3 rounded-lg flex-shrink-0`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className={`text-sm font-semibold ${!notification.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="ml-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-neutral-600 mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">{formatTimestamp(notification.timestamp)}</span>
            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                  title="Mark as read"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
