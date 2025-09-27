import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
      const rawUser = localStorage.getItem('auth_user');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        axios.post(`${API_URL}/auth/logout`, { userId: user.id }).catch(() => {});
      }
    } catch (e) {}
    try { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user'); localStorage.removeItem('auth_refresh'); } catch (e) {}
  },
  async refresh() {
    try {
      const rawUser = localStorage.getItem('auth_user');
      const refresh = localStorage.getItem('auth_refresh');
      if (!rawUser || !refresh) throw new Error('No refresh token');
      const user = JSON.parse(rawUser);
      const response = await axios.post(`${API_URL}/auth/refresh`, { userId: user.id, refreshToken: refresh });
      const data = response.data;
      if (data.access_token) localStorage.setItem('auth_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('auth_refresh', data.refresh_token);
      return data;
    } catch (e) {
      // propagate
      throw e;
    }
  },
};