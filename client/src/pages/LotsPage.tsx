import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, formatCFA, formatDate } from '../services/apiService';
import { Package, Plus, Eye, CreditCard as Edit, Lock, Clock as Unlock } from 'lucide-react';

const LotsPage: React.FC = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        console.log('🔄 Chargement des lots...');
        const data = await apiService.getLots();
        console.log('📦 Lots reçus:', data);
        setLots(data);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des lots:', error);
        console.error('Détails de l\'erreur:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

  const handleCloseLot = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir fermer ce lot ?')) {
      try {
        await apiService.closeLot(id);
        // Recharger les lots
        const data = await apiService.getLots();
        setLots(data);
      } catch (error) {
        console.error('Erreur lors de la fermeture du lot:', error);
        alert('Erreur lors de la fermeture du lot');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des lots</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos lots de transport et suivez leur rentabilité
          </p>
        </div>
        <Link to="/lots/new/edit" className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau lot
        </Link>
      </div>

      {/* Tableau des lots */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Code lot</th>
                <th className="table-header">Produit</th>
                <th className="table-header">Voyages</th>
                <th className="table-header">Démarré le</th>
                <th className="table-header">Statut</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lots.length > 0 ? (
                lots.map((lot: any) => (
                  <tr key={lot.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">{lot.lotCode}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {lot.product}
                      </span>
                    </td>
                    <td className="table-cell">
                      {lot.trips?.length || 0} voyages
                    </td>
                    <td className="table-cell">
                      {formatDate(lot.startedAt)}
                    </td>
                    <td className="table-cell">
                      {lot.closedAt ? (
                        <span className="flex items-center text-green-600">
                          <Lock className="h-4 w-4 mr-1" />
                          Fermé
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-600">
                          <Unlock className="h-4 w-4 mr-1" />
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/lots/${lot.id}/edit`}
                          className="text-primary-600 hover:text-primary-700"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {!lot.closedAt && (
                          <button
                            onClick={() => handleCloseLot(lot.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Fermer le lot"
                          >
                            <Lock className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun lot trouvé</p>
                    <Link to="/lots/new/edit" className="btn-primary mt-4 inline-flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le premier lot
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LotsPage;