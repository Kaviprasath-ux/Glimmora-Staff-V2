import Card from '../common/Card';
import WorkOrderStatusBadge from './WorkOrderStatusBadge';

export default function WorkOrderCard({ workOrder }) {
  if (!workOrder) return null;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#4E5840]">{workOrder.title}</p>
          <p className="text-xs text-[#6B6F63] mt-1">{workOrder.location}</p>
        </div>
        <WorkOrderStatusBadge status={workOrder.status} />
      </div>
      <p className="text-xs text-[#6B6F63] mt-3">Priority: {workOrder.priority}</p>
    </Card>
  );
}

