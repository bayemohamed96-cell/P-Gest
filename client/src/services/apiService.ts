import axios from 'axios';

// Préférence: appels relatifs /api -> gérés par proxy Vite (vite.config) en dev,
// et par reverse proxy / same-origin en prod. Variable VITE_API_BASE reste possible.
const API_URL = (import.meta as any).env?.VITE_API_BASE || '/api';

// Auth supprimée : plus d'intercepteurs Authorization / refresh

export const apiService = {
  // Status / Dashboard
  async getStatusSummary() {
    const response = await axios.get(`${API_URL}/status/summary`);
    return response.data;
  },
  // Lots
  async getLots() {
    const response = await axios.get(`${API_URL}/lots`);
    return response.data;
  },

  async getLot(id: number) {
    const response = await axios.get(`${API_URL}/lots/${id}`);
    return response.data;
  },

  async createLot(data: any) {
    const response = await axios.post(`${API_URL}/lots`, data);
    return response.data;
  },

  async updateLot(id: number, data: any) {
    const response = await axios.patch(`${API_URL}/lots/${id}`, data);
    return response.data;
  },

  async replaceLotTrips(id: number, trips: any[]) {
    const response = await axios.patch(`${API_URL}/lots/${id}/trips`, { trips });
    return response.data;
  },

  async closeLot(id: number) {
    const response = await axios.post(`${API_URL}/lots/${id}/close`);
    return response.data;
  },

  async getLotPnL(id: number) {
    const response = await axios.get(`${API_URL}/lots/${id}/pnl`);
    return response.data;
  },

  // Clients
  async getCustomers() {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  },

  async getCustomer(id: number) {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  },

  async getCustomerStatement(id: number) {
    const response = await axios.get(`${API_URL}/customers/${id}/statement`);
    return response.data;
  },

  // Fournisseurs
  async getSuppliers() {
    const response = await axios.get(`${API_URL}/suppliers`);
    return response.data;
  },

  async getSupplier(id: number) {
    const response = await axios.get(`${API_URL}/suppliers/${id}`);
    return response.data;
  },

  async getSupplierStatement(id: number) {
    const response = await axios.get(`${API_URL}/suppliers/${id}/statement`);
    return response.data;
  },

  // Ressources
  async getTruckCisterns() {
    const response = await axios.get(`${API_URL}/truck-cisterns`);
    return response.data;
  },

  async getTruckTractors() {
    const response = await axios.get(`${API_URL}/truck-tractors`);
    return response.data;
  },

  async getDrivers() {
    const response = await axios.get(`${API_URL}/drivers`);
    return response.data;
  },

  async getDestinations() {
    const response = await axios.get(`${API_URL}/destinations`);
    return response.data;
  },
};

// Utilitaire pour formater les montants en CFA
export const formatCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Utilitaire pour formater les dates
export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};