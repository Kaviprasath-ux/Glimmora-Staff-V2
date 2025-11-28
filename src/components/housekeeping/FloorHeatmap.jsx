const statusColors = {
  dirty: 'bg-red-400 hover:bg-red-500',
  inprogress: 'bg-[#CDB261] hover:bg-[#B8A057]',
  clean: 'bg-green-400 hover:bg-green-500',
  inspected: 'bg-[#5C9BA4] hover:bg-[#4A8A94]',
  out_of_service: 'bg-gray-300 hover:bg-gray-400',
};

const statusLabels = {
  dirty: 'Dirty',
  inprogress: 'In Progress',
  clean: 'Clean',
  inspected: 'Inspected',
  out_of_service: 'Out of Service',
};

export default function FloorHeatmap({ rooms, floors, onRoomClick }) {
  const roomsByFloor = floors.map(floor => ({
    floor,
    rooms: rooms.filter(r => r.floor === floor),
  }));

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#4E5840]">Floor Map</h3>
        <div className="flex items-center gap-3 text-xs">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${color.split(' ')[0]}`} />
              <span className="text-[#6B6F63]">{statusLabels[status]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {roomsByFloor.map(({ floor, rooms: floorRooms }) => (
          <div key={floor} className="flex items-center gap-3">
            <div className="w-16 text-xs font-medium text-[#6B6F63]">
              Floor {floor}
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {floorRooms
                .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                .map((room) => (
                  <button
                    key={room.id}
                    onClick={() => onRoomClick && onRoomClick(room)}
                    className={`relative w-12 h-10 rounded-lg text-white text-xs font-medium transition-all ${statusColors[room.status]} ${
                      room.vip ? 'ring-2 ring-[#CDB261] ring-offset-1' : ''
                    }`}
                    title={`Room ${room.roomNumber} - ${statusLabels[room.status]}${room.vip ? ' (VIP)' : ''}`}
                  >
                    {room.roomNumber.slice(-2)}
                    {room.vip && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#CDB261] rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
