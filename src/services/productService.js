import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';

export const productService = {
  /**
   * Obtiene todos los productos
   */
  async getAll() {
    return await storageService.get(STORAGE_KEYS.PRODUCTS) || [];
  },

  /**
   * Guarda todos los productos
   */
  async saveAll(products) {
    return await storageService.set(STORAGE_KEYS.PRODUCTS, products);
  },

  /**
   * Agrega un nuevo producto
   */
  async add(product) {
    const products = await this.getAll();
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    await this.saveAll(products);
    return newProduct;
  },

  /**
   * Actualiza un producto existente
   */
  async update(productId, updatedData) {
    const products = await this.getAll();
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    products[index] = {
      ...products[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    await this.saveAll(products);
    return products[index];
  },

  /**
   * Elimina un producto
   */
  async delete(productId) {
    const products = await this.getAll();
    const filtered = products.filter(p => p.id !== productId);
    await this.saveAll(filtered);
    return true;
  },

  /**
   * Busca un producto por ID
   */
  async findById(productId) {
    const products = await this.getAll();
    return products.find(p => p.id === productId);
  },

  /**
   * Actualiza el stock de un producto
   */
  async updateStock(productId, quantity, operation = 'set') {
    const product = await this.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    let newStock;
    switch (operation) {
      case 'add':
        newStock = product.stock + quantity;
        break;
      case 'subtract':
        newStock = product.stock - quantity;
        break;
      default:
        newStock = quantity;
    }

    if (newStock < 0) {
      throw new Error('Stock insuficiente');
    }

    return await this.update(productId, { stock: newStock });
  }
};
