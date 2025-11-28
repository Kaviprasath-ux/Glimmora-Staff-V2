import { createContext, useContext, useMemo, useState } from 'react';
import { ROLE_CONFIG } from './roleConfig';
import { staffProfile } from '../data/staffProfile';

const StaffAuthContext = createContext(null);

const DEFAULT_ROLE = 'housekeeping';

export function StaffAuthProvider({ children }) {
  const [role, setRole] = useState(DEFAULT_ROLE);

  const user = useMemo(() => {
    const rolePermissions = ROLE_CONFIG[role] || ROLE_CONFIG[DEFAULT_ROLE];
    return {
      id: staffProfile.id,
      name: staffProfile.name,
      role,
      permissions: rolePermissions,
    };
  }, [role]);

  const value = useMemo(
    () => ({
      user,
      setRole,
    }),
    [user]
  );

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}

