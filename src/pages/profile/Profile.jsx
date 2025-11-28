import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Edit2,
  Key,
  LogOut,
  BadgeCheck
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FormModal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useStaffPortal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { profile, clockIn, clockOut, updateProfile } = useProfile();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getRoleLabel = (role) => {
    const labels = {
      housekeeping: 'Housekeeping Staff',
      maintenance: 'Maintenance Technician',
      runner: 'Runner / Bell Staff'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      housekeeping: 'bg-green/10 text-green',
      maintenance: 'bg-primary/10 text-primary',
      runner: 'bg-teal/10 text-teal'
    };
    return colors[role] || 'bg-neutral-dark text-text';
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatClockInTime = () => {
    if (!profile?.clockInTime) return null;
    const time = new Date(profile.clockInTime);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateHoursWorked = () => {
    if (!profile?.clockInTime) return '0h 0m';
    const clockInTime = new Date(profile.clockInTime);
    const now = new Date();
    const diffMs = now - clockInTime;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditSubmit = () => {
    // Update both auth context and staff portal context
    updateUser(editForm);
    updateProfile(editForm);
    setShowEditModal(false);
  };

  const handlePasswordSubmit = () => {
    // In a real app, this would validate and update the password
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  // Merge auth user data with profile data for display
  const displayData = {
    ...profile,
    ...user
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings"
        actions={
          <Button variant="outline" icon={Edit2} onClick={() => {
            setEditForm({
              name: displayData.name,
              email: displayData.email,
              phone: displayData.phone || ''
            });
            setShowEditModal(true);
          }}>
            Edit Profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto">
                {getInitials(displayData.name)}
              </div>
              {profile?.clockedIn && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-text">{displayData.name}</h2>
            <p className="text-sm text-text-light mb-3">{displayData.employeeId}</p>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getRoleColor(displayData.role)}`}>
              <BadgeCheck className="w-4 h-4" />
              <span className="text-sm font-medium">{getRoleLabel(displayData.role)}</span>
            </div>

            {/* Clock In/Out */}
            <div className="mt-6 pt-6 border-t border-border">
              {profile?.clockedIn ? (
                <div>
                  <div className="flex items-center justify-center gap-2 text-success mb-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="font-medium">Clocked In</span>
                  </div>
                  <p className="text-sm text-text-light mb-1">Since {formatClockInTime()}</p>
                  <p className="text-lg font-bold text-text mb-4">{calculateHoursWorked()} worked</p>
                  <Button
                    variant="danger"
                    className="w-full"
                    icon={Clock}
                    onClick={clockOut}
                  >
                    Clock Out
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-text-light mb-4">You are not clocked in</p>
                  <Button
                    variant="success"
                    className="w-full"
                    icon={Clock}
                    onClick={clockIn}
                  >
                    Clock In
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Full Name</p>
                  <p className="font-medium text-text">{displayData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-teal/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium text-text">{displayData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-green/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="font-medium text-text">{displayData.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-gold/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Department</p>
                  <p className="font-medium text-text">{displayData.department}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Work Information */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Work Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Employee ID</p>
                  <p className="font-medium text-text">{displayData.employeeId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-teal/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Hire Date</p>
                  <p className="font-medium text-text">
                    {displayData.hireDate ? new Date(displayData.hireDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-green/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Shift Hours</p>
                  <p className="font-medium text-text">
                    {formatTime(displayData.shiftStart)} - {formatTime(displayData.shiftEnd)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-gold/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Supervisor</p>
                  <p className="font-medium text-text">{displayData.supervisor || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-text mb-4">Account Settings</h3>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={Key}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-danger hover:bg-danger-light"
                icon={LogOut}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        title="Edit Profile"
        submitText="Save Changes"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            required
          />

          <Input
            label="Phone"
            type="tel"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
        </div>
      </FormModal>

      {/* Change Password Modal */}
      <FormModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        title="Change Password"
        submitText="Update Password"
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
            error={
              passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
                ? 'Passwords do not match'
                : null
            }
          />
        </div>
      </FormModal>
    </div>
  );
};

export default Profile;
