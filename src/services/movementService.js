import { apiService } from './apiService';

export const movementService = {
  /**
   * Obtiene todos los movimientos
   */
  async getAll() {
    try {
      return await apiService.get('/movements');
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      return [];
    }
  },

  /**
   * Registra un nuevo movimiento
   */
  async create(movementData) {
    try {
      return await apiService.post('/movements', movementData);
    } catch (error) {
      throw new Error(error.message || 'Error al crear movimiento');
    }
  },

  /**
   * Obtiene movimientos por producto
   */
  async getByProduct(productId) {
    try {
      return await apiService.get(`/movements/product/${productId}`);
    } catch (error) {
      console.error('Error al obtener movimientos del producto:', error);
      return [];
    }
  },

  /**
   * Obtiene movimientos por tipo
   */
  async getByType(type) {
    try {
      return await apiService.get(`/movements/type/${type}`);
    } catch (error) {
      console.error('Error al obtener movimientos por tipo:', error);
      return [];
    }
  },

  /**
   * Obtiene movimientos por rango de fechas
   */
  async getByDateRange(startDate, endDate) {
    try {
      return await apiService.get(`/movements/range?start=${startDate}&end=${endDate}`);
    } catch (error) {
      console.error('Error al obtener movimientos por rango:', error);
      return [];
    }
  },

  /**
   * Registra un movimiento de venta
   */
  async registerSale(saleData) {
    try {
      return await apiService.post('/movements/sale', saleData);
    } catch (error) {
      throw new Error(error.message || 'Error al registrar movimiento de venta');
    }
  }
};