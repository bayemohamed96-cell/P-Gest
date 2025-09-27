import React, { useState } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'in' | 'out'>('in');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal des paiements</h1>
          <p className="text-gray-600 mt-1">
            Enregistrez et suivez tous vos encaissements et décaissements
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau paiement
        </button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('in')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'in'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Encaissements
            </div>
          </button>
          <button
            onClick={() => setActiveTab('out')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'out'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Décaissements
            </div>
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="card">
        {activeTab === 'in' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Paiements clients</h2>
              <button className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Enregistrer un encaissement
              </button>
            </div>
            
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun encaissement enregistré</p>
              <button className="btn-primary">
                Enregistrer le premier encaissement
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Paiements fournisseurs</h2>
              <button className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Enregistrer un décaissement
              </button>
            </div>
            
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun décaissement enregistré</p>
              <button className="btn-primary">
                Enregistrer le premier décaissement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;