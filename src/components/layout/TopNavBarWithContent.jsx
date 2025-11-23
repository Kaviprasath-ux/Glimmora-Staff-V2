import { Link, useLocation } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';

const TopNavBarWithContent = ({ tabs = [], title = '', description = '' }) => {
  const location = useLocation();
  const { getUnreadCount } = useStaffNotifications();
  const unreadCount = getUnreadCount();

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-[1440px]">
        {/* Top row with logo, notification, and language */}
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">Overview</h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Link
              to="/staff/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <BellIcon className="h-5 w-5 text-neutral-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </Link>

            {/* Language Selector */}
            <button className="flex h-9 items-center justify-center rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              ES
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {tabs.length > 0 && (
          <nav className="flex gap-8 px-4 sm:px-6 lg:px-8 -mb-px">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={`relative pb-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Page Title and Description */}
        {title && (
          <div className="px-4 sm:px-6 lg:px-8 py-8 bg-neutral-50 border-t border-neutral-100">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-1">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-neutral-600">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavBarWithContent;
