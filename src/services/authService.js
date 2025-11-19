import { apiService } from './apiService';
import { ADMIN_CREDENTIALS } from '../constants';

export const authService = {
  /**
   * Valida credenciales de administrador
   */
  validateAdmin(username, password) {
    return username === ADMIN_CREDENTIALS.username && 
           password === ADMIN_CREDENTIALS.password;
  },

  /**
   * Valida credenciales de cliente
   */
  async validateClient(username, password) {
    try {
      const response = await apiService.post('/auth/login/client', {
        username,
        password
      });
      return response.client;
    } catch (error) {
      return null;
    }
  },

  /**
   * Registra un nuevo cliente
   */
  async registerClient(clientData) {
    try {
      const response = await apiService.post('/auth/register/client', clientData);
      return response.client;
    } catch (error) {
      throw new Error(error.message || 'Error al registrar cliente');
    }
  },

  /**
   * Obtiene todos los clientes
   */
  async getClients() {
    try {
      return await apiService.get('/clients');
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return [];
    }
  },

  /**
   * Actualiza un cliente
   */
  async updateClient(clientId, updatedData) {
    try {
      return await apiService.put(`/clients/${clientId}`, updatedData);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar cliente');
    }
  },

  /**
   * Elimina un cliente
   */
  async deleteClient(clientId) {
    try {
      await apiService.delete(`/clients/${clientId}`);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar cliente');
    }
  }
};