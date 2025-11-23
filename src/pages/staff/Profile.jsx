import { useState, useEffect } from 'react';
import { staffProfile as initialProfile } from '../../data/staffProfile';
import ProfileCard from '../../components/profile/ProfileCard';
import EditProfileModal from '../../components/profile/EditProfileModal';

const Profile = () => {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('glimmora_staff_profile');
    return savedProfile ? JSON.parse(savedProfile) : initialProfile;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('glimmora_staff_profile', JSON.stringify(profile));
  }, [profile]);

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Profile</h1>
        <p className="text-neutral-600">Manage your personal information</p>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard profile={profile} onEdit={() => setIsEditModalOpen(true)} />
        </div>

        {/* Info Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Employee ID</div>
                <div className="font-medium text-neutral-900">{profile.employeeId}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Department</div>
                <div className="font-medium text-neutral-900">{profile.department}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Role</div>
                <div className="font-medium text-neutral-900">{profile.role}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Join Date</div>
                <div className="font-medium text-neutral-900">
                  {new Date(profile.joinDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Work Schedule */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Work Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Current Shift</div>
                <div className="font-medium text-neutral-900">{profile.workSchedule.shift}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Working Hours</div>
                <div className="font-medium text-neutral-900">{profile.workSchedule.hours}</div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Name</div>
                <div className="font-medium text-neutral-900">{profile.emergencyContact.name}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Relationship</div>
                <div className="font-medium text-neutral-900">{profile.emergencyContact.relationship}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-neutral-600 mb-1">Phone</div>
                <div className="font-medium text-neutral-900">{profile.emergencyContact.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
