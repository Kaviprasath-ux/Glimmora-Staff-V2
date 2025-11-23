import { EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ProfileCard = ({ profile, onEdit }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      {/* Profile Photo */}
      <div className="flex justify-center mb-6">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-24 h-24 rounded-full border-4 border-neutral-100"
        />
      </div>

      {/* Name and Role */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-1">{profile.name}</h2>
        <p className="text-sm font-medium text-neutral-600 mb-1">{profile.role}</p>
        <p className="text-xs text-neutral-500">{profile.department}</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3 text-sm">
          <EnvelopeIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <span className="text-neutral-700">{profile.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <PhoneIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <span className="text-neutral-700">{profile.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MapPinIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <span className="text-neutral-700">{profile.address}</span>
        </div>
      </div>

      {/* Last Login */}
      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mb-6">
        <CalendarIcon className="h-3.5 w-3.5" />
        <span>Last login: {profile.lastLogin}</span>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
