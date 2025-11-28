import Card from '../common/Card';

const statusColors = {
  occupied: 'text-[#CDB261]',
  vacant: 'text-[#4E5840]',
  service: 'text-[#5C9BA4]',
};

export default function RoomStatusCard({ room }) {
  if (!room) return null;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#4E5840]">Room {room.number}</p>
          <p className="text-xs text-[#6B6F63] mt-1">{room.note}</p>
        </div>
        <span className={`text-xs font-semibold ${statusColors[room.status] || 'text-[#4E5840]'}`}>
          {room.status}
        </span>
      </div>
    </Card>
  );
}

