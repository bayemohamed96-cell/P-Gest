import React, { useState, useEffect } from 'react';

interface SummaryData {
  lots: number;
  customers: number;
  suppliers: number;
  monthRevenue: number;
}

const DashboardPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState('⏳ Chargement...');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [lotsCount, setLotsCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // D'abord summary
        const summaryRes = await fetch('http://localhost:3000/api/status/summary');
        if (summaryRes.ok) {
          const json = await summaryRes.json();
          setSummary(json);
          setApiStatus('✅ API connectée');
        } else {
          throw new Error('Summary status ' + summaryRes.status);
        }
      } catch (e:any) {
        // Fallback lots pour prouver la connectivité minimale
        try {
          const lotsRes = await fetch('http://localhost:3000/api/lots');
          if (lotsRes.ok) {
            const arr = await lotsRes.json();
            setLotsCount(Array.isArray(arr) ? arr.length : 0);
            setApiStatus('⚠️ Summary indisponible, fallback lots OK');
          } else {
            setApiStatus('❌ API partiellement indisponible');
          }
        } catch (inner) {
          setApiStatus('💥 Pas de connexion API');
          setError((inner as Error).message);
        }
      }
    };
    load();
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

      {/* Status API */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">État de l'API</h2>
        <p className="text-lg mb-4">{apiStatus}</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {summary && (
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
            <div><span className="font-medium">Lots:</span> {summary.lots}</div>
            <div><span className="font-medium">Clients:</span> {summary.customers}</div>
            <div><span className="font-medium">Fournisseurs:</span> {summary.suppliers}</div>
            <div><span className="font-medium">CA mois:</span> {summary.monthRevenue}</div>
          </div>
        )}
        {lotsCount !== null && !summary && (
          <div className="mt-4 text-sm text-gray-600">Fallback lots récupérés: {lotsCount}</div>
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
                {summary ? summary.lots : lotsCount ?? '...'}
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
              <p className="text-2xl font-bold text-gray-900">{summary ? summary.customers : '...'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{summary ? summary.suppliers : '...'}</p>
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
        <p className="text-2xl font-bold text-gray-900">{summary ? summary.monthRevenue.toLocaleString('fr-FR') + ' FCFA' : '...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;