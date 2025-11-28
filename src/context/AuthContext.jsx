import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticateUser } from '../data/sampleUsers';

const AUTH_STORAGE_KEY = 'glimmora_auth';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const user = JSON.parse(storedAuth);
          setState({
            user,
            isAuthenticated: true,
            loading: false
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
      }
    };

    loadStoredUser();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setState(prev => ({ ...prev, loading: true }));

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    // For Phase 1: Use local authentication
    // Later, this will be replaced with:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });

    const result = authenticateUser(email, password);

    if (result.success) {
      const user = result.user;

      // Store user in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        loading: false
      });

      return { success: true, user };
    } else {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false, error: result.error };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(AUTH_STORAGE_KEY);

    // Also clear the staff portal data to start fresh
    localStorage.removeItem('glimmora_staff_portal');

    // Reset state
    setState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  }, []);

  // Update user profile
  const updateUser = useCallback((updates) => {
    setState(prev => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));

      return {
        ...prev,
        user: updatedUser
      };
    });
  }, []);

  // Get the dashboard path based on user role
  const getDashboardPath = useCallback((role) => {
    const paths = {
      housekeeping: '/housekeeping/dashboard',
      maintenance: '/maintenance/dashboard',
      runner: '/runner/dashboard'
    };
    return paths[role] || '/housekeeping/dashboard';
  }, []);

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    getDashboardPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
export default AuthProvider;
