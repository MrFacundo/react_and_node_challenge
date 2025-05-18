import {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  loginUser, registerUser, getProfile, updateProfile as apiUpdateProfile,
} from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Handles auth token lifecycle and user profile fetch on mount/token change
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setLoading(true);
      getProfile(token)
        .then(setUser)
        .catch((err) => {
          setUser(null);
          console.error('getProfile failed:', err);
        })
        .finally(() => setLoading(false));
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const { token: t } = await loginUser(username, password);
    setToken(t);
  };

  const register = async (email, password, username) => {
    const { token: t } = await registerUser(email, password, username);
    setToken(t);
  };

  const logout = () => {
    setToken(null);
  };

  const updateProfile = async (updates) => {
    const updated = await apiUpdateProfile(token, updates);
    setUser(updated);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user, token, login, register, logout, updateProfile,
  }), [user, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
