import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Clock,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useStaffPortal';

const ProfileMenu = ({ collapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, clockIn, clockOut } = useProfile();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role) => {
    const labels = {
      housekeeping: 'Housekeeping',
      maintenance: 'Maintenance',
      runner: 'Runner'
    };
    return labels[role] || role;
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

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Use auth user data with fallback to profile data
  const displayData = user || profile;

  if (!displayData) return null;

  if (collapsed) {
    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          {getInitials(displayData.name)}
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-[14px] shadow-[var(--shadow-lg)] border border-border overflow-hidden animate-scale-in z-50">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  {getInitials(displayData.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text truncate">{displayData.name}</p>
                  <p className="text-xs text-text-light">{getRoleLabel(displayData.role)}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => { navigate('/profile'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-light hover:bg-neutral-dark rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              {profile?.clockedIn ? (
                <button
                  onClick={() => { clockOut(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Clock Out</span>
                  <span className="ml-auto text-xs text-text-muted">
                    Since {formatClockInTime()}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => { clockIn(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-success hover:bg-success-light rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Clock In</span>
                </button>
              )}

              <div className="h-px bg-border my-2" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-neutral-dark transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
          {getInitials(displayData.name)}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-sm text-text truncate">{displayData.name}</p>
          <div className="flex items-center gap-1 text-xs text-text-light">
            <Building2 className="w-3 h-3" />
            <span>{getRoleLabel(displayData.role)}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[14px] shadow-[var(--shadow-lg)] border border-border overflow-hidden animate-scale-in z-50">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-light">
                Shift: {displayData.shiftStart || profile?.shiftStart} - {displayData.shiftEnd || profile?.shiftEnd}
              </span>
            </div>
            {profile?.clockedIn && (
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-success font-medium">
                  Clocked in since {formatClockInTime()}
                </span>
              </div>
            )}
          </div>

          <div className="p-2">
            <button
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-light hover:bg-neutral-dark rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <div className="h-px bg-border my-2" />

            {profile?.clockedIn ? (
              <button
                onClick={() => { clockOut(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Clock Out</span>
              </button>
            ) : (
              <button
                onClick={() => { clockIn(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-success hover:bg-success-light rounded-lg transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Clock In</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
