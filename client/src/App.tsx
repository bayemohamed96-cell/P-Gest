import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';

function App() {
  console.log('🚀 App with routing loaded');
  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<div className="text-center py-8">Page non trouvée</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;