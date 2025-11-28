import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { useStaffRooms } from '../../context/StaffRoomsContext';

export default function RoomsPreview({ role }) {
  const { rooms } = useStaffRooms();
  const preview = rooms.slice(0, 3);

  return (
    <Card title={role === 'maintenance' ? 'Rooms Overview' : 'Assigned Rooms'}>
      {preview.length ? (
        <div className="space-y-3">
          {preview.map((room) => (
            <div key={room.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#4E5840]">Room {room.number}</p>
                <p className="text-xs text-[#6B6F63]">{room.note}</p>
              </div>
              <span className="text-xs font-semibold text-[#A57865] capitalize">{room.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No rooms assigned" />
      )}
    </Card>
  );
}
