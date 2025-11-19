import { apiService } from './apiService';

export const categoryService = {
  /**
   * Obtiene todas las categorías
   */
  async getAll() {
    try {
      return await apiService.get('/categories');
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  },

  /**
   * Agrega una nueva categoría
   */
  async add(categoryName) {
    try {
      await apiService.post('/categories', { name: categoryName });
      return await this.getAll();
    } catch (error) {
      throw new Error(error.message || 'Error al agregar categoría');
    }
  },

  /**
   * Elimina una categoría
   */
  async delete(categoryName) {
    try {
      await apiService.delete(`/categories/${encodeURIComponent(categoryName)}`);
      return await this.getAll();
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar categoría');
    }
  },

  /**
   * Actualiza el nombre de una categoría
   */
  async update(oldName, newName) {
    try {
      await apiService.put(`/categories/${encodeURIComponent(oldName)}`, { 
        newName 
      });
      return await this.getAll();
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar categoría');
    }
  }
};