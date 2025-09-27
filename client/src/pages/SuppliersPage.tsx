import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Building2, Plus, FileText, CreditCard as Edit } from 'lucide-react';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiService.getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des fournisseurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des fournisseurs</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos fournisseurs et suivez vos commandes
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau fournisseur
        </button>
      </div>

      {/* Tableau des fournisseurs */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Nom</th>
                <th className="table-header">NIF</th>
                <th className="table-header">Téléphone</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.length > 0 ? (
                suppliers.map((supplier: any) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">{supplier.nif}</td>
                    <td className="table-cell">{supplier.phone}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/suppliers/${supplier.id}/statement`}
                          className="text-primary-600 hover:text-primary-700"
                          title="Suivi des commandes"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-gray-600 hover:text-gray-700"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="table-cell text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun fournisseur trouvé</p>
                    <button className="btn-primary mt-4 inline-flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le premier fournisseur
                    </button>
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

export default SuppliersPage;