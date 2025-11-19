/**
 * setupStorage.js
 * 
 * Implementa una API de almacenamiento personalizada (window.storage)
 * que abstrae el uso de localStorage con una interfaz más amigable
 */

window.storage = {
  /**
   * Obtiene un valor del almacenamiento
   * @param {string} key - Clave del valor a obtener
   * @returns {Promise<{value: string}|null>} Promesa que resuelve con el valor o null
   */
  get: async function(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return { value };
    } catch (error) {
      console.error(`Error al obtener ${key} del almacenamiento:`, error);
      return null;
    }
  },

  /**
   * Guarda un valor en el almacenamiento
   * @param {string} key - Clave del valor
   * @param {string} value - Valor a guardar (debe ser string)
   * @returns {Promise<void>}
   */
  set: async function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error al guardar ${key} en el almacenamiento:`, error);
      throw error;
    }
  },

  /**
   * Elimina un valor del almacenamiento
   * @param {string} key - Clave del valor a eliminar
   * @returns {Promise<void>}
   */
  remove: async function(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar ${key} del almacenamiento:`, error);
      throw error;
    }
  },

  /**
   * Limpia todo el almacenamiento
   * @returns {Promise<void>}
   */
  clear: async function() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar el almacenamiento:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las claves del almacenamiento
   * @returns {Promise<string[]>} Array con todas las claves
   */
  keys: async function() {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error al obtener las claves del almacenamiento:', error);
      return [];
    }
  }
};

console.log('✅ window.storage API inicializada correctamente');
