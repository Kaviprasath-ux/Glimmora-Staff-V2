import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { useStaffNotifications } from '../../context/StaffNotificationsContext';

export default function AlertsPreview({ role }) {
  const { notifications } = useStaffNotifications();
  const preview = notifications.slice(0, 3);

  return (
    <Card title="Recent Alerts">
      {preview.length ? (
        <div className="space-y-3">
          {preview.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#4E5840]">{alert.title}</p>
                <p className="text-xs text-[#6B6F63]">{alert.time}</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[#6B6F63]">{alert.type}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No alerts" description="You are all caught up." />
      )}
    </Card>
  );
}
