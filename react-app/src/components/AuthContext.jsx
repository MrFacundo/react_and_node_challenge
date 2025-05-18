import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile, updateProfile as apiUpdateProfile } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

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

  const register = async (username, password) => {
    const { token: t } = await registerUser(username, password);
    setToken(t);
  };

  const logout = () => {
    setToken(null);
  };

  const updateProfile = async (updates) => {
    const updated = await apiUpdateProfile(token, updates);
    setUser(updated);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
