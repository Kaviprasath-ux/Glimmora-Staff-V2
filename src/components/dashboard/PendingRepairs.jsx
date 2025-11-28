import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { useStaffMaintenance } from '../../context/StaffMaintenanceContext';

export default function PendingRepairs() {
  const { workOrders } = useStaffMaintenance();
  const pending = workOrders.filter((wo) => wo.status !== 'completed').slice(0, 4);

  return (
    <Card title="Pending Repairs">
      {pending.length ? (
        <ul className="space-y-2">
          {pending.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm text-[#4E5840]">
              <span>{item.title}</span>
              <span className="text-xs text-[#6B6F63] capitalize">{item.priority} priority</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No pending repairs" />
      )}
    </Card>
  );
}

