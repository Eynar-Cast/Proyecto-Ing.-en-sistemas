import { apiService } from './apiService';

export const salesService = {
  /**
   * Obtiene todas las ventas
   */
  async getAll() {
    try {
      return await apiService.get('/sales');
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      return [];
    }
  },

  /**
   * Registra una nueva venta
   */
  async create(saleData) {
    try {
      return await apiService.post('/sales', saleData);
    } catch (error) {
      throw new Error(error.message || 'Error al crear venta');
    }
  },

  /**
   * Obtiene ventas por cliente
   */
  async getByClient(clientId) {
    try {
      return await apiService.get(`/sales/client/${clientId}`);
    } catch (error) {
      console.error('Error al obtener ventas del cliente:', error);
      return [];
    }
  },

  /**
   * Obtiene ventas por fecha
   */
  async getByDateRange(startDate, endDate) {
    try {
      return await apiService.get(`/sales/range?start=${startDate}&end=${endDate}`);
    } catch (error) {
      console.error('Error al obtener ventas por rango:', error);
      return [];
    }
  },

  /**
   * Calcula estadísticas de ventas
   */
  async getStats() {
    try {
      return await apiService.get('/sales/stats');
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalSales: 0,
        totalRevenue: 0,
        averageSale: 0,
        todaySales: 0,
        todayRevenue: 0,
        monthSales: 0,
        monthRevenue: 0
      };
    }
  },

  /**
   * Obtiene productos más vendidos
   */
  async getTopProducts(limit = 5) {
    try {
      return await apiService.get(`/sales/top-products?limit=${limit}`);
    } catch (error) {
      console.error('Error al obtener productos más vendidos:', error);
      return [];
    }
  }
};