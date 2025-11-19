import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';

export const supplierService = {
  /**
   * Obtiene todos los proveedores
   */
  async getAll() {
    return await storageService.get(STORAGE_KEYS.SUPPLIERS) || [];
  },

  /**
   * Guarda todos los proveedores
   */
  async saveAll(suppliers) {
    return await storageService.set(STORAGE_KEYS.SUPPLIERS, suppliers);
  },

  /**
   * Agrega un nuevo proveedor
   */
  async add(supplierData) {
    const suppliers = await this.getAll();
    
    const newSupplier = {
      id: Date.now(),
      ...supplierData,
      createdAt: new Date().toISOString()
    };

    suppliers.push(newSupplier);
    await this.saveAll(suppliers);
    return newSupplier;
  },

  /**
   * Actualiza un proveedor
   */
  async update(supplierId, updatedData) {
    const suppliers = await this.getAll();
    const index = suppliers.findIndex(s => s.id === supplierId);
    
    if (index === -1) {
      throw new Error('Proveedor no encontrado');
    }

    suppliers[index] = {
      ...suppliers[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    await this.saveAll(suppliers);
    return suppliers[index];
  },

  /**
   * Elimina un proveedor
   */
  async delete(supplierId) {
    const suppliers = await this.getAll();
    const filtered = suppliers.filter(s => s.id !== supplierId);
    await this.saveAll(filtered);
    return true;
  },

  /**
   * Busca un proveedor por ID
   */
  async findById(supplierId) {
    const suppliers = await this.getAll();
    return suppliers.find(s => s.id === supplierId);
  }
};
