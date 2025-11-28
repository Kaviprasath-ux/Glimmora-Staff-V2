import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authenticateStaff, getStoredStaff } from '../utils/auth';

const AuthContext = createContext(null);
const STORAGE_KEY = 'glimmora_staff_auth';

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(() => getStoredStaff());

  useEffect(() => {
    try {
      if (staff) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to persist auth', err);
    }
  }, [staff]);

  const login = (identifier, password) => {
    const authenticated = authenticateStaff(identifier, password);
    if (!authenticated) {
      throw new Error('Invalid credentials');
    }
    setStaff(authenticated);
    return authenticated;
  };

  const logout = () => {
    setStaff(null);
  };

  const value = useMemo(
    () => ({
      staff,
      login,
      logout,
      isAuthenticated: Boolean(staff),
    }),
    [staff]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

