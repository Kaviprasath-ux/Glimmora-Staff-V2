import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarClock,
  BedDouble,
  Bell,
  UserRound,
  Wrench,
  Boxes,
  ClipboardCheck,
  Package,
  LogOut,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navConfig = {
  housekeeping: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'tasks', label: 'My Tasks', to: '/tasks', icon: CheckSquare },
    { key: 'schedule', label: 'My Schedule', to: '/schedule', icon: CalendarClock },
    { key: 'rooms', label: 'My Rooms', to: '/rooms', icon: BedDouble },
    { key: 'notifications', label: 'Notifications', to: '/notifications', icon: Bell },
    { key: 'profile', label: 'My Profile', to: '/profile', icon: UserRound },
  ],
  maintenance: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'work-orders', label: 'Work Orders', to: '/work-orders', icon: Wrench },
    { key: 'maintenance-tasks', label: 'Maintenance Tasks', to: '/maintenance-tasks', icon: ClipboardCheck },
    { key: 'equipment-issues', label: 'Equipment Issues', to: '/equipment-issues', icon: Boxes },
    { key: 'notifications', label: 'Notifications', to: '/notifications', icon: Bell },
    { key: 'profile', label: 'My Profile', to: '/profile', icon: UserRound },
  ],
  runner: [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { key: 'delivery-tasks', label: 'Delivery Tasks', to: '/delivery-tasks', icon: Package },
    { key: 'pickup-requests', label: 'Pickup Requests', to: '/pickup-requests', icon: Truck },
    { key: 'notifications', label: 'Notifications', to: '/notifications', icon: Bell },
    { key: 'profile', label: 'My Profile', to: '/profile', icon: UserRound },
  ],
};

export default function StaffSidebar() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();
  const role = staff?.role || 'housekeeping';
  const items = navConfig[role] || navConfig.housekeeping;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-[#FAF7F4] border-r border-[#E7E1D9] hidden md:flex flex-col">
      <div className="px-5 py-6 border-b border-[#E7E1D9]">
        <p className="text-xs uppercase tracking-[0.08em] text-[#6B6F63]">Glimmora PMS</p>
        <p className="text-lg font-semibold text-[#4E5840]">Staff Portal</p>
        <p className="text-sm text-[#6B6F63] mt-2 capitalize">{role}</p>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {items.map(({ key, label, to, icon: Icon }) => (
            <li key={key}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold border-l-4 transition-colors ${
                    isActive
                      ? 'border-[#A57865] bg-[#A57865]/10 text-[#A57865]'
                      : 'border-transparent text-[#4E5840] hover:bg-[#A57865]/5'
                  }`
                }
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-2 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold border-l-4 border-transparent text-[#4E5840] hover:bg-[#A57865]/5"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.75} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
