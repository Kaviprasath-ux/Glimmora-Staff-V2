export default function NotificationItem({ notification }) {
  if (!notification) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#E7E1D9] bg-white px-4 py-3">
      <div className="h-2 w-2 mt-2 rounded-full bg-[#A57865]" />
      <div className="flex-1">
        <p className="text-sm font-medium text-[#4E5840]">{notification.title}</p>
        <p className="text-xs text-[#6B6F63] mt-1">{notification.time}</p>
      </div>
    </div>
  );
}

