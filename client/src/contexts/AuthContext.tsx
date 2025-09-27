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
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'admin@example.com',
    name: 'Administrateur',
    role: 'ADMIN'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un utilisateur connecté avec un délai
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulation de connexion réussie
    const mockUser = {
      id: 1,
      email: email,
      name: 'Administrateur',
      role: 'ADMIN'
    };
    setUser(mockUser);
  };

  const logout = () => {
    // Ne fait rien pour le moment
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};