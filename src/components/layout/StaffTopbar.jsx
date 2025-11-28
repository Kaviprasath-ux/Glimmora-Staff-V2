import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../context/AuthContext';

export default function StaffTopbar({ title }) {
  const { staff } = useAuth();
  const initials = staff?.name
    ? staff.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <header className="w-full border-b border-[#E7E1D9] bg-white">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-[#6B6F63]">Staff Portal</p>
          <h1 className="text-xl font-semibold text-[#4E5840]">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="flex items-center gap-3 bg-[#FAF7F4] px-3 py-2 rounded-full border border-[#E7E1D9]">
            <div className="h-8 w-8 rounded-full bg-[#A57865] text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[#4E5840]">{staff?.name}</p>
              <p className="text-xs text-[#6B6F63] capitalize">{staff?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
