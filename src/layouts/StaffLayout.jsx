import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  HomeModernIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useStaffNotifications } from '../context/StaffNotificationsContext';

const StaffLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { getUnreadCount } = useStaffNotifications();
  const unreadCount = getUnreadCount();

  const navigation = [
    { name: 'My Tasks', href: '/staff/tasks', icon: ClipboardDocumentListIcon },
    { name: 'My Schedule', href: '/staff/schedule', icon: ClockIcon },
    { name: 'My Rooms', href: '/staff/rooms', icon: HomeModernIcon },
    { name: 'Notifications', href: '/staff/notifications', icon: BellIcon, badge: unreadCount },
    { name: 'My Profile', href: '/staff/profile', icon: UserCircleIcon },
  ];

  const getPageTitle = () => {
    const currentPage = navigation.find(item => item.href === location.pathname);
    return currentPage ? currentPage.name : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex h-full flex-col">
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <h2 className="text-xl font-serif font-semibold text-deepgreen">
                Glimmora Staff
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 hover:bg-neutral-100"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-600" />
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {item.badge > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 border-r border-neutral-200 bg-white">
          {/* Logo */}
          <div className="flex items-center border-b border-neutral-200 px-6 py-6">
            <h1 className="text-2xl font-serif font-bold text-deepgreen">
              Glimmora
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {item.badge > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-200 p-4">
            <p className="text-xs text-neutral-500 text-center">
              Glimmora PMS Staff Portal
            </p>
            <p className="text-xs text-neutral-400 text-center mt-1">
              v2.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-xl font-serif font-semibold text-deepgreen">
                {getPageTitle()}
              </h2>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link
                to="/staff/notifications"
                className="relative -m-2.5 p-2.5 text-neutral-700 hover:text-primary"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
