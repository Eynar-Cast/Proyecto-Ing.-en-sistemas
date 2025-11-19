import { storageService } from './storageService';
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from '../constants';

export const categoryService = {
  /**
   * Obtiene todas las categorías
   */
  async getAll() {
    const categories = await storageService.get(STORAGE_KEYS.CATEGORIES);
    return categories || DEFAULT_CATEGORIES;
  },

  /**
   * Guarda todas las categorías
   */
  async saveAll(categories) {
    return await storageService.set(STORAGE_KEYS.CATEGORIES, categories);
  },

  /**
   * Agrega una nueva categoría
   */
  async add(categoryName) {
    const categories = await this.getAll();
    
    if (categories.includes(categoryName)) {
      throw new Error('La categoría ya existe');
    }

    categories.push(categoryName);
    await this.saveAll(categories);
    return categories;
  },

  /**
   * Elimina una categoría
   */
  async delete(categoryName) {
    const categories = await this.getAll();
    const filtered = categories.filter(c => c !== categoryName);
    await this.saveAll(filtered);
    return filtered;
  },

  /**
   * Actualiza el nombre de una categoría
   */
  async update(oldName, newName) {
    const categories = await this.getAll();
    const index = categories.indexOf(oldName);
    
    if (index === -1) {
      throw new Error('Categoría no encontrada');
    }

    if (categories.includes(newName) && oldName !== newName) {
      throw new Error('Ya existe una categoría con ese nombre');
    }

    categories[index] = newName;
    await this.saveAll(categories);
    return categories;
  }
};
