import Card from '../common/Card';

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <Card title="Profile">
      <div className="space-y-2">
        <p className="text-sm text-[#4E5840] font-semibold">{profile.name}</p>
        <p className="text-sm text-[#6B6F63]">Role: {profile.role}</p>
        <p className="text-sm text-[#6B6F63]">Department: {profile.department}</p>
        <p className="text-sm text-[#6B6F63]">Shift: {profile.shift}</p>
        <p className="text-sm text-[#6B6F63]">Email: {profile.email}</p>
        <p className="text-sm text-[#6B6F63]">Phone: {profile.phone}</p>
      </div>
    </Card>
  );
}

