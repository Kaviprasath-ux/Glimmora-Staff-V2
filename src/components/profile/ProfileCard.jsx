import { EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ProfileCard = ({ profile, onEdit }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header with gradient background */}
      <div className="h-32 bg-primary"></div>

      <div className="px-6 pb-6">
        {/* Profile Photo */}
        <div className="relative -mt-16 mb-4">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Name and Role */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-deepgreen mb-1">{profile.name}</h2>
          <p className="text-primary font-medium mb-1">{profile.role}</p>
          <p className="text-sm text-neutral-600">{profile.department}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-neutral-700">
            <EnvelopeIcon className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex items-center text-neutral-700">
            <PhoneIcon className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-sm">{profile.phone}</span>
          </div>
          <div className="flex items-center text-neutral-700">
            <MapPinIcon className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-sm">{profile.address}</span>
          </div>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 mb-1">Employee ID</div>
            <div className="font-semibold text-neutral-900">{profile.employeeId}</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-600 mb-1">Join Date</div>
            <div className="font-semibold text-neutral-900">
              {new Date(profile.joinDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Work Schedule */}
        <div className="p-4 bg-beige/20 rounded-lg border border-beige/30 mb-6">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Work Schedule</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Shift:</span>
              <span className="font-medium text-neutral-900">{profile.workSchedule.shift}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Hours:</span>
              <span className="font-medium text-neutral-900">{profile.workSchedule.hours}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-4 bg-neutral-50 rounded-lg mb-6">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Emergency Contact</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Name:</span>
              <span className="font-medium text-neutral-900">{profile.emergencyContact.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Relationship:</span>
              <span className="font-medium text-neutral-900">{profile.emergencyContact.relationship}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Phone:</span>
              <span className="font-medium text-neutral-900">{profile.emergencyContact.phone}</span>
            </div>
          </div>
        </div>

        {/* Last Login */}
        <div className="flex items-center text-sm text-neutral-500 mb-6">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Last login: {profile.lastLogin}
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-[#8E6554] transition-colors font-medium"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
