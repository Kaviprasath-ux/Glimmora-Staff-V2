import Card from '../common/Card';

export default function EditProfileModal({ profile }) {
  if (!profile) return null;

  return (
    <div className="rounded-xl border border-[#E7E1D9] bg-white p-4 shadow-sm">
      <Card title="Edit Profile">
        <p className="text-sm text-[#4E5840]">Profile editing will be added in a later phase.</p>
      </Card>
    </div>
  );
}

