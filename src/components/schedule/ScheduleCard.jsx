import Card from '../common/Card';

export default function ScheduleCard({ entry }) {
  if (!entry) return null;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#4E5840]">{entry.day}</p>
          <p className="text-xs text-[#6B6F63] mt-1">{entry.shift}</p>
        </div>
        <p className="text-xs text-[#6B6F63]">{entry.location}</p>
      </div>
    </Card>
  );
}

