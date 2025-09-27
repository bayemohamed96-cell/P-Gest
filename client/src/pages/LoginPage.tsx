import React from 'react';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  // Auth supprimée : page login devient une simple passerelle vers le dashboard
  return <Navigate to="/dashboard" replace />;

  // (Code original supprimé – voir historique git si besoin de le restaurer)
};

export default LoginPage;