import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import WorkOrderStatusBadge from '../maintenance/WorkOrderStatusBadge';
import { useStaffMaintenance } from '../../context/StaffMaintenanceContext';

export default function WorkOrdersPreview() {
  const { workOrders } = useStaffMaintenance();
  const preview = workOrders.slice(0, 3);

  return (
    <Card title="Work Orders">
      {preview.length ? (
        <div className="space-y-3">
          {preview.map((workOrder) => (
            <div key={workOrder.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#4E5840]">{workOrder.title}</p>
                <p className="text-xs text-[#6B6F63]">{workOrder.location}</p>
              </div>
              <WorkOrderStatusBadge status={workOrder.status} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No work orders" />
      )}
    </Card>
  );
}

