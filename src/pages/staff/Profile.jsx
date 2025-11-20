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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-deepgreen">My Profile</h1>
        <p className="text-neutral-600 mt-1">Manage your personal information and settings</p>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard profile={profile} onEdit={() => setIsEditModalOpen(true)} />
        </div>

        {/* Additional Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-serif font-semibold text-deepgreen mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Employee ID</div>
                  <div className="font-semibold text-neutral-900">{profile.employeeId}</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Department</div>
                  <div className="font-semibold text-neutral-900">{profile.department}</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Role</div>
                  <div className="font-semibold text-neutral-900">{profile.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm text-neutral-600">Join Date</div>
                  <div className="font-semibold text-neutral-900">
                    {new Date(profile.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Schedule */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-serif font-semibold text-deepgreen mb-4">
              Work Schedule
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-beige/20 rounded-lg border border-beige/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-700">Current Shift</span>
                  <span className="text-lg font-semibold text-deepgreen">
                    {profile.workSchedule.shift}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Working Hours</span>
                  <span className="text-lg font-semibold text-deepgreen">
                    {profile.workSchedule.hours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-serif font-semibold text-deepgreen mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-deepgreen"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">Profile Updated</div>
                  <div className="text-xs text-neutral-600">{profile.lastLogin}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-teal"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">Last Login</div>
                  <div className="text-xs text-neutral-600">{profile.lastLogin}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-beige"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">Account Created</div>
                  <div className="text-xs text-neutral-600">
                    {new Date(profile.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-serif font-semibold text-deepgreen mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-4 text-left border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="text-sm font-medium text-neutral-900">Edit Profile</div>
                <div className="text-xs text-neutral-600 mt-1">
                  Update your personal information
                </div>
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-4 text-left border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="text-sm font-medium text-neutral-900">Change Password</div>
                <div className="text-xs text-neutral-600 mt-1">Update your account password</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
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
