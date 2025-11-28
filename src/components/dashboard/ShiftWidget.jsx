import Card from '../common/Card';

export default function ShiftWidget({ role }) {
  return (
    <Card title="Shift">
      <div className="space-y-2">
        <p className="text-sm text-[#4E5840]">Current Role: {role || 'Staff'}</p>
        <p className="text-sm text-[#6B6F63]">Shift timing and controls will appear here.</p>
      </div>
    </Card>
  );
}

