import Card from '../common/Card';

export default function WorkOrderModal({ workOrder }) {
  if (!workOrder) return null;

  return (
    <div className="rounded-xl border border-[#E7E1D9] bg-white p-4 shadow-sm">
      <Card title={workOrder.title}>
        <p className="text-sm text-[#4E5840]">Work order modal placeholder.</p>
      </Card>
    </div>
  );
}

