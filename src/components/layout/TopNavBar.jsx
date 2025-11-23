import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BellIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';

const TopNavBar = ({ tabs = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getUnreadCount } = useStaffNotifications();
  const unreadCount = getUnreadCount();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Top row with logo, notification, and language */}
        <div className="flex h-16 items-center justify-between">
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
            <h1 className="text-xl font-semibold text-neutral-900">Glimmora Staff</h1>
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

            {/* Profile Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
              >
                <UserCircleIcon className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* Profile Info */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">Staff Member</p>
                      <p className="text-xs text-neutral-500">staff@glimmora.com</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/staff/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <UserCircleIcon className="h-5 w-5 text-neutral-400" />
                      <span>My Profile</span>
                    </Link>

                    <div className="border-t border-neutral-100 mt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          // Add logout logic here
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-neutral-600" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        {tabs.length > 0 && (
          <nav className="hidden md:flex gap-8 -mb-px mt-6">
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="px-4 py-2 space-y-1">
            {/* Main Navigation Tabs */}
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-neutral-200 my-2"></div>

            {/* Profile Link */}
            <Link
              to="/staff/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/staff/profile'
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>My Profile</span>
            </Link>

            {/* Sign Out */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                // Add logout logic here
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopNavBar;
