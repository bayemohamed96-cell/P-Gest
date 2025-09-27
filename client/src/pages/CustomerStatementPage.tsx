import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, formatCFA, formatDate } from '../services/apiService';
import { ArrowLeft, FileText, CreditCard, Download } from 'lucide-react';

const CustomerStatementPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const data = await apiService.getCustomerStatement(parseInt(id!));
        setStatement(data);
      } catch (error) {
        console.error('Erreur lors du chargement du relevé:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Relevé non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/customers')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Relevé de compte - {statement.customer.name}
            </h1>
            <p className="text-gray-600 mt-1">
              NIF: {statement.customer.nif} • Tél: {statement.customer.phone}
            </p>
          </div>
        </div>
        <button className="btn-secondary flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Exporter PDF
        </button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total facturé</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCFA(statement.summary.totalInvoiced)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total payé</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCFA(statement.summary.totalPaid)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full mr-3 flex items-center justify-center ${
              statement.summary.balance >= 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <span className={`text-sm font-bold ${
                statement.summary.balance >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {statement.summary.balance >= 0 ? 'D' : 'C'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Solde</p>
              <p className={`text-2xl font-bold ${
                statement.summary.balance >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCFA(Math.abs(statement.summary.balance))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Factures */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Factures</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">N° Facture</th>
                <th className="table-header">Date</th>
                <th className="table-header">Montant</th>
                <th className="table-header">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statement.invoices.map((invoice: any) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{invoice.invoiceNo}</td>
                  <td className="table-cell">{formatDate(invoice.issuedAt)}</td>
                  <td className="table-cell font-medium">
                    {formatCFA(invoice.totalCfa)}
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status === 'PAID' ? 'Payée' :
                       invoice.status === 'PARTIAL' ? 'Partielle' :
                       invoice.status === 'OVERDUE' ? 'Échue' :
                       invoice.status === 'SENT' ? 'Envoyée' : 'Brouillon'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paiements */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Paiements reçus</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Référence</th>
                <th className="table-header">Montant</th>
                <th className="table-header">Note</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statement.payments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="table-cell">{formatDate(payment.date)}</td>
                  <td className="table-cell font-medium">{payment.reference}</td>
                  <td className="table-cell font-medium text-green-600">
                    {formatCFA(payment.amountCfa)}
                  </td>
                  <td className="table-cell text-gray-500">
                    {payment.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatementPage;