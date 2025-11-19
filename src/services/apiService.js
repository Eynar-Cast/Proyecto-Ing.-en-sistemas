import axios from 'axios';
import { API_URL } from '../config/database';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // GET request
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener datos');
    }
  },

  // POST request
  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear datos');
    }
  },

  // PUT request
  put: async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar datos');
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar datos');
    }
  },
};