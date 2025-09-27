import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // tenter de réhydrater depuis localStorage
    try {
      const rawUser = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      if (rawUser && token) {
        setUser(JSON.parse(rawUser));
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    if (data && data.access_token) {
      try {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      } catch (e) {}
      setUser(data.user);
    } else {
      throw new Error('Invalid login response');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};