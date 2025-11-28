import Card from '../common/Card';

export default function RoomDetailModal({ room }) {
  if (!room) return null;

  return (
    <div className="rounded-xl border border-[#E7E1D9] bg-white p-4 shadow-sm">
      <Card title={`Room ${room.number}`}>
        <p className="text-sm text-[#4E5840]">Room detail modal placeholder.</p>
      </Card>
    </div>
  );
}

