import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  BadgeCheck,
  Shield,
  Timer,
  CheckCircle
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FormModal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useStaffPortal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

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
    updateUser(editForm);
    updateProfile(editForm);
    setShowEditModal(false);
  };

  const handlePasswordSubmit = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const displayData = {
    ...profile,
    ...user
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Status</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              profile?.clockedIn ? 'bg-success/10' : 'bg-neutral'
            }`}>
              <Clock className={`w-4 h-4 ${profile?.clockedIn ? 'text-success' : 'text-text-muted'}`} />
            </div>
          </div>
          <span className={`text-lg font-bold ${profile?.clockedIn ? 'text-success' : 'text-text-muted'}`}>
            {profile?.clockedIn ? 'Clocked In' : 'Off Duty'}
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Hours Today</span>
            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
              <Timer className="w-4 h-4 text-teal" />
            </div>
          </div>
          <span className="text-lg font-bold text-text">{calculateHoursWorked()}</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Role</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="text-sm font-bold text-text">{getRoleLabel(displayData.role)}</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[16px] border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Department</span>
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gold" />
            </div>
          </div>
          <span className="text-sm font-bold text-text">{displayData.department || 'N/A'}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">Profile</h2>
                <p className="text-sm text-text-muted">Your account overview</p>
              </div>
            </div>

            {/* Avatar & Name */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                  {getInitials(displayData.name)}
                </div>
                {profile?.clockedIn && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-text">{displayData.name}</h3>
              <p className="text-sm text-text-muted">{displayData.employeeId}</p>
            </div>

            {/* Clock In/Out */}
            <div className="pt-4 border-t border-border">
              {profile?.clockedIn ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-success mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Active since {formatClockInTime()}</span>
                  </div>
                  <p className="text-2xl font-bold text-text mb-4">{calculateHoursWorked()}</p>
                  <button
                    onClick={clockOut}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-danger text-white hover:bg-danger/90 transition-all"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Clock Out
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-4">You are not clocked in</p>
                  <button
                    onClick={clockIn}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] bg-success text-white hover:bg-success/90 transition-all"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Clock In
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text">Personal Information</h2>
                    <p className="text-sm text-text-muted">Your contact details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditForm({
                      name: displayData.name,
                      email: displayData.email,
                      phone: displayData.phone || ''
                    });
                    setShowEditModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>

              {/* Info List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-muted">Full Name</span>
                  <span className="text-sm font-medium text-text">{displayData.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Email</span>
                  <span className="text-sm font-medium text-text">{displayData.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Phone</span>
                  <span className="text-sm font-medium text-text">{displayData.phone || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Department</span>
                  <span className="text-sm font-medium text-text">{displayData.department || '—'}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Work Information */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Work Information</h2>
                  <p className="text-sm text-text-muted">Your employment details</p>
                </div>
              </div>

              {/* Info List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-muted">Employee ID</span>
                  <span className="text-sm font-medium text-text">{displayData.employeeId}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Role</span>
                  <span className="text-sm font-medium text-text">{getRoleLabel(displayData.role)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Hire Date</span>
                  <span className="text-sm font-medium text-text">
                    {displayData.hireDate ? new Date(displayData.hireDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Shift Hours</span>
                  <span className="text-sm font-medium text-text">
                    {formatTime(displayData.shiftStart)} - {formatTime(displayData.shiftEnd)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-sm text-text-muted">Supervisor</span>
                  <span className="text-sm font-medium text-text">{displayData.supervisor || '—'}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Account Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text">Account Settings</h2>
                  <p className="text-sm text-text-muted">Security and authentication</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-text hover:border-primary-200 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-[8px] border border-border text-text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </Card>
          </motion.div>
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
    </motion.div>
  );
};

export default Profile;
