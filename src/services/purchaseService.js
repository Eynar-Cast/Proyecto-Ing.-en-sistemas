import { apiService } from './apiService';

export const purchaseService = {
  /**
   * Obtiene todas las compras
   */
  async getAll() {
    try {
      return await apiService.get('/purchases');
    } catch (error) {
      console.error('Error al obtener compras:', error);
      return [];
    }
  },

  /**
   * Crea una nueva compra
   */
  async create(purchaseData) {
    try {
      return await apiService.post('/purchases', purchaseData);
    } catch (error) {
      throw new Error(error.message || 'Error al crear compra');
    }
  },

  /**
   * Obtiene una compra por ID
   */
  async getById(purchaseId) {
    try {
      return await apiService.get(`/purchases/${purchaseId}`);
    } catch (error) {
      throw new Error(error.message || 'Compra no encontrada');
    }
  },

  /**
   * Obtiene compras por proveedor
   */
  async getBySupplier(supplierId) {
    try {
      return await apiService.get(`/purchases/supplier/${supplierId}`);
    } catch (error) {
      console.error('Error al obtener compras del proveedor:', error);
      return [];
    }
  }
};