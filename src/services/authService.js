import { storageService } from './storageService';
import { STORAGE_KEYS, ADMIN_CREDENTIALS, USER_TYPES } from '../constants';

export const authService = {
  /**
   * Valida credenciales de administrador
   */
  validateAdmin(username, password) {
    return username === ADMIN_CREDENTIALS.username && 
           password === ADMIN_CREDENTIALS.password;
  },

  /**
   * Valida credenciales de cliente
   */
  async validateClient(username, password) {
    const clients = await storageService.get(STORAGE_KEYS.CLIENTS) || [];
    return clients.find(c => c.username === username && c.password === password);
  },

  /**
   * Registra un nuevo cliente
   */
  async registerClient(clientData) {
    const clients = await storageService.get(STORAGE_KEYS.CLIENTS) || [];
    
    // Validar si el usuario ya existe
    if (clients.some(c => c.username === clientData.username)) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    if (clients.some(c => c.email === clientData.email)) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const newClient = {
      id: Date.now(),
      ...clientData,
      createdAt: new Date().toISOString(),
      purchases: []
    };

    clients.push(newClient);
    await storageService.set(STORAGE_KEYS.CLIENTS, clients);
    
    return newClient;
  },

  /**
   * Obtiene todos los clientes
   */
  async getClients() {
    return await storageService.get(STORAGE_KEYS.CLIENTS) || [];
  },

  /**
   * Actualiza un cliente
   */
  async updateClient(clientId, updatedData) {
    const clients = await this.getClients();
    const index = clients.findIndex(c => c.id === clientId);
    
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    clients[index] = {
      ...clients[index],
      ...updatedData
    };

    await storageService.set(STORAGE_KEYS.CLIENTS, clients);
    return clients[index];
  },

  /**
   * Elimina un cliente
   */
  async deleteClient(clientId) {
    const clients = await this.getClients();
    const filtered = clients.filter(c => c.id !== clientId);
    await storageService.set(STORAGE_KEYS.CLIENTS, filtered);
    return true;
  }
};
