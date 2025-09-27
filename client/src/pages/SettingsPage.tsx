import React, { useState } from 'react';
import { Settings, Save, DollarSign, Truck, Database } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultToleranceL: 100,
    backupFrequency: 'daily',
    currency: 'XOF',
    companyName: 'Votre Entreprise',
    companyAddress: '',
    companyPhone: '',
  });

  const handleSave = () => {
    // TODO: Sauvegarder les paramètres
    alert('Paramètres sauvegardés');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">
            Configurez les paramètres de votre système ERP
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Paramètres généraux */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Paramètres généraux</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea
                className="input-field w-full"
                rows={3}
                value={settings.companyAddress}
                onChange={(e) => setSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
                placeholder="Adresse complète de l'entreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                className="input-field w-full"
                value={settings.companyPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
                placeholder="+226 XX XX XX XX"
              />
            </div>
          </div>
        </div>

        {/* Paramètres logistiques */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Truck className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Paramètres logistiques</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tolérance par défaut (litres)
              </label>
              <input
                type="number"
                className="input-field w-full"
                value={settings.defaultToleranceL}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultToleranceL: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Quantité de manque tolérée par défaut pour les voyages
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                className="input-field w-full"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="XOF">Franc CFA (XOF)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Règles de tarification */}
        <div className="card">
          <div className="flex items-center mb-6">
            <DollarSign className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Règles de tarification</h2>
          </div>

          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucune règle de tarification configurée</p>
            <button className="btn-primary">
              Ajouter une règle
            </button>
          </div>
        </div>

        {/* Paramètres de sauvegarde */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Database className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Sauvegarde</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence de sauvegarde
              </label>
              <select
                className="input-field w-full"
                value={settings.backupFrequency}
                onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
                <option value="manual">Manuelle uniquement</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="btn-secondary w-full">
                Lancer une sauvegarde maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;