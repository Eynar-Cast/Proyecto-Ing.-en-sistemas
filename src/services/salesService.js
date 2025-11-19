import { storageService } from './storageService';
import { productService } from './productService';
import { STORAGE_KEYS } from '../constants';

export const salesService = {
  /**
   * Obtiene todas las ventas
   */
  async getAll() {
    return await storageService.get(STORAGE_KEYS.SALES) || [];
  },

  /**
   * Guarda todas las ventas
   */
  async saveAll(sales) {
    return await storageService.set(STORAGE_KEYS.SALES, sales);
  },

  /**
   * Registra una nueva venta
   */
  async create(saleData) {
    const sales = await this.getAll();
    
    const newSale = {
      id: Date.now(),
      ...saleData,
      date: new Date().toISOString(),
      status: 'completed'
    };

    // Actualizar stock de productos
    for (const item of saleData.items) {
      await productService.updateStock(item.id, item.quantity, 'subtract');
    }

    sales.push(newSale);
    await this.saveAll(sales);
    
    return newSale;
  },

  /**
   * Obtiene ventas por cliente
   */
  async getByClient(clientId) {
    const sales = await this.getAll();
    return sales.filter(s => s.clientId === clientId);
  },

  /**
   * Obtiene ventas por fecha
   */
  async getByDateRange(startDate, endDate) {
    const sales = await this.getAll();
    return sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  },

  /**
   * Calcula estadísticas de ventas
   */
  async getStats() {
    const sales = await this.getAll();
    
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Ventas por día
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter(s => new Date(s.date) >= today);
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

    // Ventas del mes
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthSales = sales.filter(s => new Date(s.date) >= firstDayOfMonth);
    const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);

    return {
      totalSales,
      totalRevenue,
      averageSale,
      todaySales: todaySales.length,
      todayRevenue,
      monthSales: monthSales.length,
      monthRevenue
    };
  },

  /**
   * Obtiene productos más vendidos
   */
  async getTopProducts(limit = 5) {
    const sales = await this.getAll();
    const productSales = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  }
};
