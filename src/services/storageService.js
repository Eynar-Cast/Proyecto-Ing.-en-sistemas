/**
 * Servicio de almacenamiento
 * Abstrae el acceso a window.storage para facilitar el manejo de datos
 */

export const storageService = {
  /**
   * Obtiene un valor del almacenamiento
   */
  async get(key) {
    try {
      const result = await window.storage.get(key);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error(`Error al obtener ${key}:`, error);
      return null;
    }
  },

  /**
   * Guarda un valor en el almacenamiento
   */
  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error al guardar ${key}:`, error);
      return false;
    }
  },

  /**
   * Elimina un valor del almacenamiento
   */
  async remove(key) {
    try {
      await window.storage.remove(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar ${key}:`, error);
      return false;
    }
  },

  /**
   * Limpia todo el almacenamiento
   */
  async clear() {
    try {
      await window.storage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar almacenamiento:', error);
      return false;
    }
  }
};
