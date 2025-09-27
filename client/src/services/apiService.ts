import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:3000/api';

// Token management helper (reads from localStorage)
function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch (e) {
    return null;
  }
}

// Request interceptor: add Authorization header when token exists
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 centrally (could redirect to login)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // try refresh
      return authService.refresh()
        .then(() => {
          // retry original request with new access token
          originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
          return axios(originalRequest);
        })
        .catch(() => {
          try { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_refresh'); localStorage.removeItem('auth_user'); } catch (e) {}
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);

export const apiService = {
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