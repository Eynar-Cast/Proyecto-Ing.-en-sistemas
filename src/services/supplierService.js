import { apiService } from './apiService';

export const supplierService = {
  /**
   * Obtiene todos los proveedores
   */
  async getAll() {
    try {
      return await apiService.get('/suppliers');
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return [];
    }
  },

  /**
   * Agrega un nuevo proveedor
   */
  async add(supplierData) {
    try {
      return await apiService.post('/suppliers', supplierData);
    } catch (error) {
      throw new Error(error.message || 'Error al agregar proveedor');
    }
  },

  /**
   * Actualiza un proveedor
   */
  async update(supplierId, updatedData) {
    try {
      return await apiService.put(`/suppliers/${supplierId}`, updatedData);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar proveedor');
    }
  },

  /**
   * Elimina un proveedor
   */
  async delete(supplierId) {
    try {
      await apiService.delete(`/suppliers/${supplierId}`);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar proveedor');
    }
  },

  /**
   * Busca un proveedor por ID
   */
  async findById(supplierId) {
    try {
      return await apiService.get(`/suppliers/${supplierId}`);
    } catch (error) {
      throw new Error(error.message || 'Proveedor no encontrado');
    }
  }
};