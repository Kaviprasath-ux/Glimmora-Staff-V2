import NotificationItem from './NotificationItem';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';
import EmptyState from '../common/EmptyState';

export default function NotificationDrawer() {
  const { notifications } = useStaffNotifications();

  return (
    <div className="rounded-xl border border-[#E7E1D9] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#4E5840] mb-3">Notifications</h3>
      <div className="space-y-3">
        {notifications.length ? (
          notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)
        ) : (
          <EmptyState title="No notifications" description="You are all caught up." />
        )}
      </div>
    </div>
  );
}

