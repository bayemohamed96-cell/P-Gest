import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  async register(email: string, password: string, name: string, role?: string) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name,
      role,
    });
    return response.data;
  },
};