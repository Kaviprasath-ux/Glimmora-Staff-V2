export default function RoomEfficiencyCard({ room, efficiency }) {
  if (!room) return null;

  const getEfficiencyColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-[#CDB261] bg-[#CDB261]/10 border-[#CDB261]/30';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTimeStatus = () => {
    if (!room.actualTimeMinutes) return null;
    const diff = room.actualTimeMinutes - room.estimatedTimeMinutes;
    if (diff <= 0) return { text: `${Math.abs(diff)}m under`, color: 'text-green-600' };
    return { text: `${diff}m over`, color: 'text-red-500' };
  };

  const timeStatus = getTimeStatus();
  const checklistComplete = room.checklist.filter(i => i.completed).length;
  const amenitiesComplete = Object.values(room.amenities).filter(Boolean).length;

  return (
    <div className={`border rounded-xl p-4 ${efficiency ? getEfficiencyColor(efficiency) : 'bg-white border-neutral-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-[#4E5840]">Room {room.roomNumber}</h4>
          <span className="text-xs text-[#6B6F63]">{room.type}</span>
        </div>
        {efficiency !== null && (
          <div className="text-right">
            <div className="text-2xl font-bold">{efficiency}</div>
            <div className="text-xs">Efficiency</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Time */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B6F63]">Time</span>
          <div className="flex items-center gap-2">
            <span className="text-[#4E5840]">
              {room.actualTimeMinutes || '-'}m / {room.estimatedTimeMinutes}m
            </span>
            {timeStatus && (
              <span className={timeStatus.color}>{timeStatus.text}</span>
            )}
          </div>
        </div>

        {/* Checklist */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B6F63]">Checklist</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-neutral-200 rounded-full h-1.5">
              <div
                className="bg-[#5C9BA4] h-1.5 rounded-full"
                style={{ width: `${(checklistComplete / room.checklist.length) * 100}%` }}
              />
            </div>
            <span className="text-[#4E5840]">
              {checklistComplete}/{room.checklist.length}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B6F63]">Amenities</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-neutral-200 rounded-full h-1.5">
              <div
                className="bg-[#A57865] h-1.5 rounded-full"
                style={{ width: `${(amenitiesComplete / Object.keys(room.amenities).length) * 100}%` }}
              />
            </div>
            <span className="text-[#4E5840]">
              {amenitiesComplete}/{Object.keys(room.amenities).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
