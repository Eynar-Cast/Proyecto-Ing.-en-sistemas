import { apiService } from './apiService';

export const productService = {
  /**
   * Obtiene todos los productos
   */
  async getAll() {
    try {
      return await apiService.get('/products');
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },

  /**
   * Agrega un nuevo producto
   */
  async add(product) {
    try {
      return await apiService.post('/products', product);
    } catch (error) {
      throw new Error(error.message || 'Error al agregar producto');
    }
  },

  /**
   * Actualiza un producto existente
   */
  async update(productId, updatedData) {
    try {
      return await apiService.put(`/products/${productId}`, updatedData);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar producto');
    }
  },

  /**
   * Elimina un producto
   */
  async delete(productId) {
    try {
      await apiService.delete(`/products/${productId}`);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar producto');
    }
  },

  /**
   * Busca un producto por ID
   */
  async findById(productId) {
    try {
      return await apiService.get(`/products/${productId}`);
    } catch (error) {
      throw new Error(error.message || 'Producto no encontrado');
    }
  },

  /**
   * Actualiza el stock de un producto
   */
  async updateStock(productId, quantity, operation = 'set') {
    try {
      return await apiService.put(`/products/${productId}/stock`, {
        quantity,
        operation
      });
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar stock');
    }
  }
};