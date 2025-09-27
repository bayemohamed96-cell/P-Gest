import React, { createContext, useContext, useState, useEffect } from 'react';
// Déclaration minimale pour que TypeScript reconnaisse import.meta.env personnalisé sans ajouter @types/node
interface ViteEnvMeta { VITE_BYPASS_AUTH?: string; }
declare global {
  interface ImportMeta { env: ViteEnvMeta; }
}
// Auth supprimée : plus d'appels réseau d'authentification

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  bypassAuth?: boolean; // flag interne pour distinguer le mode bypass
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
    // Auth toujours désactivée : on injecte un user mock immédiat
    const mockUser: User = {
      id: 1,
      email: 'dev@local',
      name: 'Dev Admin',
      role: 'ADMIN',
      bypassAuth: true,
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const login = async () => { /* noop */ };

  const logout = () => { /* noop */ };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};