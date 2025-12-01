import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Trash2,
  Check,
  Filter,
  X,
  BellRing,
  BellOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import { SearchInput } from '../../components/ui/Input';
import { ConfirmModal } from '../../components/ui/Modal';
import { useNotifications } from '../../hooks/useStaffPortal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Stats
  const stats = useMemo(() => {
    const urgent = notifications.filter(n => n.priority === 'urgent').length;
    const tasks = notifications.filter(n => n.type === 'task').length;
    const alerts = notifications.filter(n => n.type === 'alert').length;
    return { urgent, tasks, alerts, total: notifications.length };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const matchesSearch =
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesReadFilter =
        filter === 'all' ||
        (filter === 'unread' && !notif.read) ||
        (filter === 'read' && notif.read);

      const matchesTypeFilter =
        typeFilter === 'all' || notif.type === typeFilter;

      return matchesSearch && matchesReadFilter && matchesTypeFilter;
    });
  }, [notifications, filter, typeFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, typeFilter]);

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

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type, priority) => {
    if (priority === 'urgent') {
      return <AlertTriangle className="w-4 h-4 text-danger" />;
    }

    switch (type) {
      case 'task':
        return <CheckCircle className="w-4 h-4 text-teal" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-gold" />;
      case 'info':
        return <Info className="w-4 h-4 text-teal" />;
      case 'system':
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      task: 'Task',
      alert: 'Alert',
      reminder: 'Reminder',
      info: 'Info',
      system: 'System'
    };
    return labels[type] || type;
  };

  const handleNotificationClick = (notification) => {
    markNotificationRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(notifications.map(n => n.type))];
    return types;
  }, [notifications]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Unread</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              unreadCount > 0 ? 'bg-primary/10' : 'bg-neutral'
            }`}>
              <BellRing className={`w-4 h-4 ${unreadCount > 0 ? 'text-primary' : 'text-text-muted'}`} />
            </div>
          </div>
          <span className={`text-2xl font-bold ${unreadCount > 0 ? 'text-primary' : 'text-text'}`}>{unreadCount}</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Urgent</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stats.urgent > 0 ? 'bg-danger/10' : 'bg-neutral'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${stats.urgent > 0 ? 'text-danger' : 'text-text-muted'}`} />
            </div>
          </div>
          <span className={`text-2xl font-bold ${stats.urgent > 0 ? 'text-danger' : 'text-text'}`}>{stats.urgent}</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Tasks</span>
            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-teal" />
            </div>
          </div>
          <span className="text-2xl font-bold text-text">{stats.tasks}</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Total</span>
            <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center">
              <Bell className="w-4 h-4 text-text-muted" />
            </div>
          </div>
          <span className="text-2xl font-bold text-text">{stats.total}</span>
        </motion.div>
      </div>

      {/* Main Card */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">All Notifications</h2>
              <p className="text-sm text-text-muted">
                {filteredNotifications.length} of {notifications.length} notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-danger hover:border-danger/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1">
            <SearchInput
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-2 text-sm font-medium rounded-[8px] transition-colors ${
                filter === 'read'
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${
              typeFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-neutral text-text-muted hover:bg-primary-100'
            }`}
          >
            All Types
          </button>
          {uniqueTypes.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${
                typeFilter === type
                  ? 'bg-primary text-white'
                  : 'bg-neutral text-text-muted hover:bg-primary-100'
              }`}
            >
              {getTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">No notifications</h3>
            <p className="text-sm text-text-muted">
              {filter === 'unread' ? 'You have no unread notifications' :
               filter === 'read' ? 'You have no read notifications' :
               'You have no notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  flex items-start gap-3 py-4 cursor-pointer
                  transition-colors hover:bg-primary-50/50
                  ${!notification.read ? 'bg-primary-50/30' : ''}
                `}
              >
                {/* Unread indicator */}
                <div className="w-2 pt-2 shrink-0">
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>

                {/* Icon */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${notification.priority === 'urgent' ? 'bg-danger/10' :
                    notification.type === 'task' ? 'bg-teal/10' :
                    notification.type === 'alert' ? 'bg-warning/10' :
                    notification.type === 'reminder' ? 'bg-gold/10' :
                    'bg-primary/10'}
                `}>
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-text truncate`}>
                      {notification.title}
                    </h4>
                    {notification.priority === 'urgent' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-danger text-white shrink-0">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                    {notification.message}
                  </p>
                  <span className="text-[11px] text-text-muted mt-1 block">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {notification.actionUrl && (
                    <span className="text-xs text-primary font-medium">View →</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-1.5 rounded-[6px] text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm font-medium rounded-[8px] border transition-colors ${
                  currentPage === 1
                    ? 'border-border text-text-muted cursor-not-allowed opacity-50'
                    : 'border-border text-text hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm font-medium rounded-[8px] transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:bg-primary-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm font-medium rounded-[8px] border transition-colors ${
                  currentPage === totalPages
                    ? 'border-border text-text-muted cursor-not-allowed opacity-50'
                    : 'border-border text-text hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Clear All Confirmation */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          clearNotifications();
          setShowClearModal(false);
        }}
        title="Clear All Notifications"
        message="Are you sure you want to clear all notifications? This action cannot be undone."
        confirmText="Clear All"
        variant="danger"
      />
    </motion.div>
  );
};

export default Notifications;
