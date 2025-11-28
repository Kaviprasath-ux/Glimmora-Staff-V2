import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  BedDouble,
  Bell,
  User,
  Wrench,
  AlertTriangle,
  Package,
  Truck,
  Menu,
  X
} from 'lucide-react';
import MenuItem, { MenuSection, MenuDivider } from './MenuItem';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../../context/AuthContext';
import { useNotifications, useUI } from '../../hooks/useStaffPortal';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { sidebarOpen, toggleSidebar } = useUI();

  const navigationItems = useMemo(() => {
    if (!user) return { main: [], secondary: [] };

    const role = user.role;

    const roleNavigation = {
      housekeeping: {
        main: [
          { to: '/housekeeping/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/housekeeping/tasks', icon: ClipboardList, label: 'My Tasks' },
          { to: '/housekeeping/rooms', icon: BedDouble, label: 'My Rooms' }
        ],
        secondary: [
          { to: '/housekeeping/notifications', icon: Bell, label: 'Notifications', badge: unreadCount || null },
          { to: '/housekeeping/profile', icon: User, label: 'My Profile' }
        ]
      },
      maintenance: {
        main: [
          { to: '/maintenance/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/maintenance/work-orders', icon: Wrench, label: 'Work Orders' },
          { to: '/maintenance/tasks', icon: ClipboardList, label: 'Maintenance Tasks' },
          { to: '/maintenance/equipment', icon: AlertTriangle, label: 'Equipment Issues' }
        ],
        secondary: [
          { to: '/maintenance/notifications', icon: Bell, label: 'Notifications', badge: unreadCount || null },
          { to: '/maintenance/profile', icon: User, label: 'My Profile' }
        ]
      },
      runner: {
        main: [
          { to: '/runner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/runner/pickups', icon: Package, label: 'Pickup Requests' },
          { to: '/runner/deliveries', icon: Truck, label: 'Deliveries' }
        ],
        secondary: [
          { to: '/runner/notifications', icon: Bell, label: 'Notifications', badge: unreadCount || null },
          { to: '/runner/profile', icon: User, label: 'My Profile' }
        ]
      }
    };

    return roleNavigation[role] || { main: [], secondary: [] };
  }, [user, unreadCount]);

  const getRoleTitle = (role) => {
    const titles = {
      housekeeping: 'Housekeeping Portal',
      maintenance: 'Maintenance Portal',
      runner: 'Runner Portal'
    };
    return titles[role] || 'Staff Portal';
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-border z-50
          transition-transform duration-300 ease-in-out
          w-[260px] flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h1 className="font-bold text-sm text-text">Glimmora</h1>
              <p className="text-xs text-text-muted">{getRoleTitle(user.role)}</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-neutral-dark"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <MenuSection title="Main Menu">
            {navigationItems.main.map((item) => (
              <MenuItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
              />
            ))}
          </MenuSection>

          <MenuDivider />

          <MenuSection title="Account">
            {navigationItems.secondary.map((item) => (
              <MenuItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
              />
            ))}
          </MenuSection>
        </div>

        {/* Profile Section */}
        <div className="p-3 border-t border-border">
          <ProfileMenu />
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-white shadow-md border border-border lg:hidden"
      >
        <Menu className="w-5 h-5 text-text" />
      </button>
    </>
  );
};

export default Sidebar;
