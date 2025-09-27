import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading } = useAuth();
  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }
  return (
    <>
      <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1">⚠️ Auth désactivée (mode développement)</div>
      {children}
    </>
  );
};

export default ProtectedRoute;