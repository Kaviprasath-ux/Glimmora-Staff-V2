import { Bell } from 'lucide-react';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';

export default function NotificationBell() {
  const { notifications } = useStaffNotifications();
  const count = notifications.length;

  return (
    <button
      type="button"
      className="relative rounded-full border border-[#E7E1D9] bg-[#FAF7F4] p-2 text-[#4E5840] hover:bg-white"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" strokeWidth={1.75} />
      {count ? (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#A57865] px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

