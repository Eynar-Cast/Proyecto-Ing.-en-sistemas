import { storageService } from './storageService';
import { productService } from './productService';
import { STORAGE_KEYS, MOVEMENT_TYPES } from '../constants';

export const movementService = {
  /**
   * Obtiene todos los movimientos
   */
  async getAll() {
    return await storageService.get(STORAGE_KEYS.MOVEMENTS) || [];
  },

  /**
   * Guarda todos los movimientos
   */
  async saveAll(movements) {
    return await storageService.set(STORAGE_KEYS.MOVEMENTS, movements);
  },

  /**
   * Registra un nuevo movimiento
   */
  async create(movementData) {
    const movements = await this.getAll();
    
    const newMovement = {
      id: Date.now(),
      ...movementData,
      date: new Date().toISOString()
    };

    // Actualizar stock del producto según el tipo de movimiento
    if (movementData.type === MOVEMENT_TYPES.ENTRADA) {
      await productService.updateStock(
        movementData.productId, 
        movementData.quantity, 
        'add'
      );
    } else if (movementData.type === MOVEMENT_TYPES.SALIDA || 
               movementData.type === MOVEMENT_TYPES.VENTA) {
      await productService.updateStock(
        movementData.productId, 
        movementData.quantity, 
        'subtract'
      );
    }

    movements.push(newMovement);
    await this.saveAll(movements);
    
    return newMovement;
  },

  /**
   * Obtiene movimientos por producto
   */
  async getByProduct(productId) {
    const movements = await this.getAll();
    return movements.filter(m => m.productId === productId);
  },

  /**
   * Obtiene movimientos por tipo
   */
  async getByType(type) {
    const movements = await this.getAll();
    return movements.filter(m => m.type === type);
  },

  /**
   * Obtiene movimientos por rango de fechas
   */
  async getByDateRange(startDate, endDate) {
    const movements = await this.getAll();
    return movements.filter(m => {
      const movDate = new Date(m.date);
      return movDate >= new Date(startDate) && movDate <= new Date(endDate);
    });
  },

  /**
   * Registra un movimiento de venta
   */
  async registerSale(saleData) {
    const movements = [];
    
    for (const item of saleData.items) {
      const movement = await this.create({
        productId: item.id,
        productName: item.name,
        type: MOVEMENT_TYPES.VENTA,
        quantity: item.quantity,
        reason: `Venta #${saleData.saleId}`,
        user: saleData.user || 'Sistema'
      });
      movements.push(movement);
    }

    return movements;
  }
};
