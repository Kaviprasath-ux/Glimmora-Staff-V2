import Card from '../common/Card';
import EmptyState from '../common/EmptyState';

const samplePickups = [
  { id: 'p-1', title: 'Pickup documents from Front Desk', time: '10:00 AM' },
  { id: 'p-2', title: 'Collect laundry from Room 903', time: '11:45 AM' },
];

export default function PickupRequestsPreview() {
  return (
    <Card title="Pickup Requests">
      {samplePickups.length ? (
        <ul className="space-y-2">
          {samplePickups.map((task) => (
            <li key={task.id} className="flex items-center justify-between text-sm text-[#4E5840]">
              <span>{task.title}</span>
              <span className="text-xs text-[#6B6F63]">{task.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No pickup requests" />
      )}
    </Card>
  );
}

