import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService, formatCFA } from '../services/apiService';
import * as XLSX from 'xlsx';

type TripRow = {
  id?: number;
  cisternId?: number | '';
  tractorId?: number | '';
  destinationId?: number | '';
  capacityL: number;
  priceBuyPerL: number;
  freightPerL: number;
  toleranceL: number;
  shortageL: number;
  priceSellPerL: number;
  transitCfa: number;
  customsCfa: number;
  miscCfa?: number;
  qtySellable?: number;
  revenue?: number;
  totalCost?: number;
  margin?: number;
};

function computeRow(row: TripRow): TripRow {
  const shortageNet = Math.max(0, (row.shortageL || 0) - (row.toleranceL || 0));
  const qtySellable = (row.capacityL || 0) - shortageNet;
  const revenue = qtySellable * (row.priceSellPerL || 0);
  const costBuy = (row.capacityL || 0) * (row.priceBuyPerL || 0);
  const costFreight = (row.capacityL || 0) * (row.freightPerL || 0);
  const taxes = (row.transitCfa || 0) + (row.customsCfa || 0) + (row.miscCfa || 0);
  const totalCost = costBuy + costFreight + taxes;
  const margin = revenue - totalCost;
  return { ...row, qtySellable, revenue, totalCost, margin };
}

const LotEditorPage: React.FC = () => {
  const { id } = useParams();
  const [rows, setRows] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiService.getLot(Number(id)).then((lot: any) => {
      const initial = (lot.trips || []).map((t: any) => computeRow({
        id: t.id,
        cisternId: t.cisternId ?? '',
        tractorId: t.tractorId ?? '',
        destinationId: t.destinationId ?? '',
        capacityL: t.capacityL ?? 0,
        priceBuyPerL: t.priceBuyPerL ?? 0,
        freightPerL: t.freightPerL ?? 0,
        toleranceL: t.toleranceL ?? 0,
        shortageL: t.shortageL ?? 0,
        priceSellPerL: t.priceSellPerL ?? 0,
        transitCfa: t.transitCfa ?? 0,
        customsCfa: t.customsCfa ?? 0,
        miscCfa: t.miscCfa ?? 0,
      }));
      setRows(initial);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const updateCell = (index: number, key: keyof TripRow, value: any) => {
    const next = [...rows];
    (next[index] as any)[key] = value;
    next[index] = computeRow(next[index]);
    setRows(next);
  };

  const recalcViaApi = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiService.getLotPnL(Number(id));
      const map = (data.trips || []).reduce((acc: any, t: any) => { acc[t.tripId] = t; return acc; }, {});
      const next = rows.map((r) => {
        const server = r.id ? map[r.id] : null;
        if (!server) return r;
        return { ...r, qtySellable: server.qtySellable, revenue: server.revenue, totalCost: server.totalCost, margin: server.margin };
      });
      setRows(next);
    } catch (e) {
      console.error('Erreur recalc via API', e);
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setRows((s) => [...s, computeRow({ capacityL: 0, priceBuyPerL: 0, freightPerL: 0, toleranceL: 0, shortageL: 0, priceSellPerL: 0, transitCfa: 0, customsCfa: 0, miscCfa: 0 })]);
  };

  // XLSX import state
  const [preview, setPreview] = useState<TripRow[] | null>(null);
  const [importErrors, setImportErrors] = useState<string[] | null>(null);

  const handleFile = async (file: File | null) => {
    setPreview(null);
    setImportErrors(null);
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as any[];

      // Map expected columns (case-insensitive)
  const mapRow = (r: any) => {
        const get = (k: string) => {
          const key = Object.keys(r).find((kk) => kk.toLowerCase() === k.toLowerCase());
          return key ? r[key] : '';
        };

        const parsed: TripRow = computeRow({
          capacityL: Number(get('Capacity_L')) || 0,
          priceBuyPerL: Number(get('PriceBuy_L')) || 0,
          freightPerL: Number(get('Freight_L')) || 0,
          toleranceL: Number(get('Tolerance')) || 0,
          shortageL: Number(get('Shortage')) || 0,
          priceSellPerL: Number(get('PriceSell_L')) || 0,
          transitCfa: Number(get('Transit_CFA')) || 0,
          customsCfa: Number(get('Customs_CFA')) || 0,
          miscCfa: Number(get('Misc_CFA')) || 0,
        });
        return parsed;
      };

  const parsedRows: TripRow[] = raw.map((r: any) => mapRow(r));
      setPreview(parsedRows);
    } catch (e: any) {
      setImportErrors([String(e?.message || e)]);
    }
  };

  const applyPreview = () => {
    if (!preview) return;
    // Append preview rows to existing rows
    setRows((s) => [...s, ...preview]);
    setPreview(null);
  };

  return (
    <div>
      {/* Import XLSX */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium">Importer .xlsx</label>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
          className="ml-2"
        />
        {preview && (
          <button onClick={applyPreview} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded">Appliquer la prévisualisation</button>
        )}
      </div>

      {/* Preview area */}
      {importErrors && (
        <div className="mb-4 text-red-600">
          Erreurs d'import :
          <ul>
            {importErrors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {preview && (
        <div className="mb-4 border rounded p-2">
          <div className="mb-2 font-medium">Aperçu ({preview.length} lignes)</div>
          <div className="overflow-auto max-h-44">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-1">Capacity_L</th>
                  <th className="p-1">PriceBuy_L</th>
                  <th className="p-1">Freight_L</th>
                  <th className="p-1">Tolerance</th>
                  <th className="p-1">Shortage</th>
                  <th className="p-1">PriceSell_L</th>
                  <th className="p-1">Transit_CFA</th>
                  <th className="p-1">Customs_CFA</th>
                  <th className="p-1">Misc_CFA</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-1">{r.capacityL}</td>
                    <td className="p-1">{r.priceBuyPerL}</td>
                    <td className="p-1">{r.freightPerL}</td>
                    <td className="p-1">{r.toleranceL}</td>
                    <td className="p-1">{r.shortageL}</td>
                    <td className="p-1">{r.priceSellPerL}</td>
                    <td className="p-1">{r.transitCfa}</td>
                    <td className="p-1">{r.customsCfa}</td>
                    <td className="p-1">{r.miscCfa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Éditeur de lot {id}</h1>
        <div className="flex items-center gap-2">
          <button onClick={addRow} className="px-3 py-1 bg-green-600 text-white rounded">Ajouter voyage</button>
          <button onClick={recalcViaApi} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Recalcul...' : 'Recalculer via API'}</button>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Citerne</th>
              <th className="p-2">Tracteur</th>
              <th className="p-2">Destination</th>
              <th className="p-2">capacity_l</th>
              <th className="p-2">price_buy_per_l</th>
              <th className="p-2">freight_per_l</th>
              <th className="p-2">tolerance_l</th>
              <th className="p-2">shortage_l</th>
              <th className="p-2">price_sell_per_l</th>
              <th className="p-2">transit_cfa</th>
              <th className="p-2">customs_cfa</th>
              <th className="p-2">misc_cfa</th>
              <th className="p-2">qty_sellable</th>
              <th className="p-2">revenue</th>
              <th className="p-2">total_cost</th>
              <th className="p-2">margin</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2"><input className="w-28" value={r.cisternId ?? ''} onChange={(e) => updateCell(i, 'cisternId', e.target.value === '' ? '' : Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.tractorId ?? ''} onChange={(e) => updateCell(i, 'tractorId', e.target.value === '' ? '' : Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.destinationId ?? ''} onChange={(e) => updateCell(i, 'destinationId', e.target.value === '' ? '' : Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.capacityL} onChange={(e) => updateCell(i, 'capacityL', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.priceBuyPerL} onChange={(e) => updateCell(i, 'priceBuyPerL', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.freightPerL} onChange={(e) => updateCell(i, 'freightPerL', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.toleranceL} onChange={(e) => updateCell(i, 'toleranceL', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.shortageL} onChange={(e) => updateCell(i, 'shortageL', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.priceSellPerL} onChange={(e) => updateCell(i, 'priceSellPerL', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.transitCfa} onChange={(e) => updateCell(i, 'transitCfa', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.customsCfa} onChange={(e) => updateCell(i, 'customsCfa', Number(e.target.value))} /></td>
                <td className="p-2"><input className="w-28" value={r.miscCfa} onChange={(e) => updateCell(i, 'miscCfa', Number(e.target.value))} /></td>
                <td className="p-2">{r.qtySellable}</td>
                <td className="p-2">{r.revenue ? formatCFA(r.revenue) : '-'}</td>
                <td className="p-2">{r.totalCost ? formatCFA(r.totalCost) : '-'}</td>
                <td className="p-2">{r.margin ? formatCFA(r.margin) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LotEditorPage;
