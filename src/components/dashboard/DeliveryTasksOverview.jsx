import Card from '../common/Card';
import EmptyState from '../common/EmptyState';

const sampleDeliveries = [
  { id: 'd-1', title: 'Deliver linens to 14th floor', time: '10:30 AM' },
  { id: 'd-2', title: 'Deliver luggage to Room 702', time: '11:15 AM' },
];

export default function DeliveryTasksOverview() {
  return (
    <Card title="Delivery Tasks">
      {sampleDeliveries.length ? (
        <ul className="space-y-2">
          {sampleDeliveries.map((task) => (
            <li key={task.id} className="flex items-center justify-between text-sm text-[#4E5840]">
              <span>{task.title}</span>
              <span className="text-xs text-[#6B6F63]">{task.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No delivery tasks" />
      )}
    </Card>
  );
}

