import React, { useState, useEffect } from 'react';

const DashboardPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState('⏳ Test en cours...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log('🔄 Dashboard: Test de l\'API...');
    
    const testAPI = async () => {
      try {
        console.log('📡 Tentative de connexion à l\'API...');
        const response = await fetch('http://localhost:3000/api/lots');
        console.log('📊 Statut de la réponse:', response.status);
        
        if (response.ok) {
          const lots = await response.json();
          console.log('✅ Données reçues:', lots);
          setApiStatus('✅ API connectée');
          setData(lots);
        } else {
          console.log('❌ Erreur API:', response.status);
          setApiStatus(`❌ Erreur API: ${response.status}`);
        }
      } catch (error) {
        console.error('💥 Erreur de connexion:', error);
        setApiStatus('💥 Pas de connexion API');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre activité logistique
        </p>
      </div>

      {/* Test API */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">État de l'API</h2>
        <p className="text-lg mb-4">{apiStatus}</p>
        
        {data && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Données reçues:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Statistiques simples */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lots</p>
              <p className="text-2xl font-bold text-gray-900">
                {data ? data.length : '...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50">
              <span className="text-2xl">🏭</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fournisseurs</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-50">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CA du mois</p>
              <p className="text-2xl font-bold text-gray-900">0 FCFA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;