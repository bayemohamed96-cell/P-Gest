import axios from 'axios';

// Même logique: chemins relatifs + override possible via VITE_API_BASE
const API_URL = (import.meta as any).env?.VITE_API_BASE || '/api';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    // expected { access_token, refresh_token, user }
    const data = response.data;
    try {
      if (data.access_token) localStorage.setItem('auth_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('auth_refresh', data.refresh_token);
      if (data.user) localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (e) {}
    return data;
  },

  async register(email: string, password: string, name: string, role?: string) {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password, name, role });
    const data = response.data;
    try {
      if (data.access_token) localStorage.setItem('auth_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('auth_refresh', data.refresh_token);
      if (data.user) localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (e) {}
    return data;
  },

  logout() {
    try {
      const refresh = localStorage.getItem('auth_refresh');
      if (refresh) {
        axios.post(`${API_URL}/auth/logout`, { refreshToken: refresh }).catch(() => {});
      }
    } catch (e) {}
    try { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); localStorage.removeItem('auth_refresh'); } catch (e) {}
  },
  async refresh() {
    try {
      const refresh = localStorage.getItem('auth_refresh');
      if (!refresh) throw new Error('No refresh token');
      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh });
      const data = response.data;
      if (data.access_token) localStorage.setItem('auth_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('auth_refresh', data.refresh_token);
      // user renvoyé optionnellement – si présent on le remet à jour
      if (data.user) localStorage.setItem('auth_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      throw e;
    }
  },
};