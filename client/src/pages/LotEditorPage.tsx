import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, formatCFA } from '../services/apiService';
import { Save, Plus, Trash2, Calculator, ArrowLeft } from 'lucide-react';

const LotEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [lot, setLot] = useState({
    lotCode: '',
    product: 'GASOIL',
    startedAt: new Date().toISOString().split('T')[0],
    notes: '',
    trips: [],
  });

  const [resources, setResources] = useState({
    cisterns: [],
    tractors: [],
    drivers: [],
    destinations: [],
  });

  const [pnl, setPnl] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les ressources
        const [cisterns, tractors, drivers, destinations] = await Promise.all([
          apiService.getTruckCisterns(),
          apiService.getTruckTractors(),
          apiService.getDrivers(),
          apiService.getDestinations(),
        ]);

        setResources({ cisterns, tractors, drivers, destinations });

        // Charger le lot si ce n'est pas nouveau
        if (!isNew) {
          const lotData = await apiService.getLot(parseInt(id!));
          setLot(lotData);
          
          // Charger le P&L
          try {
            const pnlData = await apiService.getLotPnL(parseInt(id!));
            setPnl(pnlData);
          } catch (error) {
            console.error('Erreur lors du chargement du P&L:', error);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const newLot = await apiService.createLot(lot);
        navigate(`/lots/${newLot.id}/edit`);
      } else {
        await apiService.updateLot(parseInt(id!), lot);
        // Recharger le P&L
        const pnlData = await apiService.getLotPnL(parseInt(id!));
        setPnl(pnlData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const addTrip = () => {
    const newTrip = {
      id: Date.now(), // ID temporaire
      cisternId: '',
      tractorId: '',
      driverId: '',
      destinationId: '',
      capacityL: 0,
      priceBuyPerL: 0,
      freightPerL: 0,
      toleranceL: 100,
      shortageL: 0,
      priceSellPerL: 0,
      transitCfa: 0,
      customsCfa: 0,
      miscCfa: 0,
    };

    setLot(prev => ({
      ...prev,
      trips: [...prev.trips, newTrip],
    }));
  };

  const updateTrip = (index: number, field: string, value: any) => {
    setLot(prev => ({
      ...prev,
      trips: prev.trips.map((trip, i) => 
        i === index ? { ...trip, [field]: value } : trip
      ),
    }));
  };

  const removeTrip = (index: number) => {
    setLot(prev => ({
      ...prev,
      trips: prev.trips.filter((_, i) => i !== index),
    }));
  };

  const calculateTripPnL = (trip: any) => {
    const costBuy = trip.capacityL * trip.priceBuyPerL;
    const costFreight = trip.capacityL * trip.freightPerL;
    const shortageNet = Math.max(0, trip.shortageL - trip.toleranceL);
    const qtySellable = trip.capacityL - shortageNet;
    const revenue = qtySellable * trip.priceSellPerL;
    const taxes = trip.transitCfa + trip.customsCfa + (trip.miscCfa || 0);
    const totalCost = costBuy + costFreight + taxes;
    const margin = revenue - totalCost;

    return {
      costBuy,
      costFreight,
      shortageNet,
      qtySellable,
      revenue,
      taxes,
      totalCost,
      margin,
    };
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/lots')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Nouveau lot' : `Lot ${lot.lotCode}`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isNew ? 'Créer un nouveau lot de transport' : 'Modifier le lot et ses voyages'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!isNew && pnl && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Marge totale</p>
              <p className={`text-lg font-bold ${pnl.totals.totalMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCFA(pnl.totals.totalMargin)}
              </p>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Informations du lot */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du lot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code du lot
            </label>
            <input
              type="text"
              className="input-field w-full"
              value={lot.lotCode}
              onChange={(e) => setLot(prev => ({ ...prev, lotCode: e.target.value }))}
              placeholder="LOT001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produit
            </label>
            <select
              className="input-field w-full"
              value={lot.product}
              onChange={(e) => setLot(prev => ({ ...prev, product: e.target.value }))}
            >
              <option value="GASOIL">Gasoil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de démarrage
            </label>
            <input
              type="date"
              className="input-field w-full"
              value={lot.startedAt}
              onChange={(e) => setLot(prev => ({ ...prev, startedAt: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            className="input-field w-full"
            rows={3}
            value={lot.notes || ''}
            onChange={(e) => setLot(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Notes sur le lot..."
          />
        </div>
      </div>

      {/* Voyages */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Voyages</h2>
          <button onClick={addTrip} className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un voyage
          </button>
        </div>

        {lot.trips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Citerne</th>
                  <th className="table-header">Tracteur</th>
                  <th className="table-header">Chauffeur</th>
                  <th className="table-header">Destination</th>
                  <th className="table-header">Capacité (L)</th>
                  <th className="table-header">Prix achat/L</th>
                  <th className="table-header">Fret/L</th>
                  <th className="table-header">Tolérance (L)</th>
                  <th className="table-header">Manque (L)</th>
                  <th className="table-header">Prix vente/L</th>
                  <th className="table-header">Transit</th>
                  <th className="table-header">Douane</th>
                  <th className="table-header">Divers</th>
                  <th className="table-header">Vendable (L)</th>
                  <th className="table-header">Recette</th>
                  <th className="table-header">Coût total</th>
                  <th className="table-header">Marge</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lot.trips.map((trip: any, index: number) => {
                  const calc = calculateTripPnL(trip);
                  return (
                    <tr key={trip.id || index} className="hover:bg-gray-50">
                      <td className="table-cell">
                        <select
                          className="input-field w-full min-w-[120px]"
                          value={trip.cisternId}
                          onChange={(e) => updateTrip(index, 'cisternId', parseInt(e.target.value))}
                        >
                          <option value="">Sélectionner</option>
                          {resources.cisterns.map((cistern: any) => (
                            <option key={cistern.id} value={cistern.id}>
                              {cistern.plate}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="table-cell">
                        <select
                          className="input-field w-full min-w-[120px]"
                          value={trip.tractorId}
                          onChange={(e) => updateTrip(index, 'tractorId', parseInt(e.target.value))}
                        >
                          <option value="">Sélectionner</option>
                          {resources.tractors.map((tractor: any) => (
                            <option key={tractor.id} value={tractor.id}>
                              {tractor.plate}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="table-cell">
                        <select
                          className="input-field w-full min-w-[120px]"
                          value={trip.driverId}
                          onChange={(e) => updateTrip(index, 'driverId', parseInt(e.target.value))}
                        >
                          <option value="">Sélectionner</option>
                          {resources.drivers.map((driver: any) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="table-cell">
                        <select
                          className="input-field w-full min-w-[120px]"
                          value={trip.destinationId}
                          onChange={(e) => updateTrip(index, 'destinationId', parseInt(e.target.value))}
                        >
                          <option value="">Sélectionner</option>
                          {resources.destinations.map((destination: any) => (
                            <option key={destination.id} value={destination.id}>
                              {destination.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.capacityL}
                          onChange={(e) => updateTrip(index, 'capacityL', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.priceBuyPerL}
                          onChange={(e) => updateTrip(index, 'priceBuyPerL', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.freightPerL}
                          onChange={(e) => updateTrip(index, 'freightPerL', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.toleranceL}
                          onChange={(e) => updateTrip(index, 'toleranceL', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.shortageL}
                          onChange={(e) => updateTrip(index, 'shortageL', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.priceSellPerL}
                          onChange={(e) => updateTrip(index, 'priceSellPerL', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.transitCfa}
                          onChange={(e) => updateTrip(index, 'transitCfa', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.customsCfa}
                          onChange={(e) => updateTrip(index, 'customsCfa', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          type="number"
                          className="input-field w-full min-w-[100px]"
                          value={trip.miscCfa || 0}
                          onChange={(e) => updateTrip(index, 'miscCfa', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="table-cell">
                        <span className="font-medium">{calc.qtySellable.toLocaleString()}</span>
                      </td>
                      <td className="table-cell">
                        <span className="font-medium text-green-600">
                          {formatCFA(calc.revenue)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="font-medium text-red-600">
                          {formatCFA(calc.totalCost)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`font-bold ${calc.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCFA(calc.margin)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => removeTrip(index)}
                          className="text-red-600 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun voyage ajouté</p>
            <button onClick={addTrip} className="btn-primary">
              Ajouter le premier voyage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotEditorPage;