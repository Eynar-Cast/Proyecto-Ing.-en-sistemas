// Credenciales de administrador
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Categorías predefinidas
export const DEFAULT_CATEGORIES = [
  'Cemento', 
  'Arena', 
  'Grava', 
  'Ladrillos', 
  'Herramientas', 
  'Pintura', 
  'Madera', 
  'Tubería', 
  'Acero', 
  'Ferretería',
  'Eléctrico', 
  'Plomería', 
  'Acabados', 
  'Pisos'
];

// Unidades de medida
export const UNITS = [
  'unidad',
  'kg',
  'litro',
  'metro',
  'm²',
  'm³',
  'bolsa',
  'caja',
  'paquete'
];

// Tipos de movimiento de inventario
export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
  VENTA: 'venta',
  AJUSTE: 'ajuste'
};

// Claves de almacenamiento local
export const STORAGE_KEYS = {
  PRODUCTS: 'construction-products',
  CATEGORIES: 'construction-categories',
  SUPPLIERS: 'construction-suppliers',
  SALES: 'construction-sales',
  MOVEMENTS: 'construction-movements',
  EMPLOYEES: 'construction-employees',
  CLIENTS: 'construction-clients'
};

// Vistas de la aplicación
export const VIEWS = {
  POS: 'pos', // Punto de venta
  EMPLOYEES: 'employees',
  REPORTS: 'reports',
  CATALOG: 'catalog',
  INVENTORY: 'inventory',
  SALES: 'sales',
  SUPPLIERS: 'suppliers',
  CLIENTS: 'clients'
};

// Tipos de usuario
export const USER_TYPES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CLIENT: 'client'
};

// Rutas de acceso
export const ACCESS_ROUTES = {
  ADMIN: '/admin',
  EMPLOYEE: '/employee',
  CLIENT: '/shop'
};
// Mensajes del sistema
export const MESSAGES = {
  PRODUCT_ADDED: 'Producto agregado exitosamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado exitosamente',
  CATEGORY_ADDED: 'Categoría agregada exitosamente',
  CATEGORY_DELETED: 'Categoría eliminada exitosamente',
  SUPPLIER_ADDED: 'Proveedor agregado exitosamente',
  SUPPLIER_UPDATED: 'Proveedor actualizado exitosamente',
  SUPPLIER_DELETED: 'Proveedor eliminado exitosamente',
  PURCHASE_COMPLETED: '¡Compra realizada con éxito!',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  REGISTER_SUCCESS: '¡Registro exitoso! Ahora puedes iniciar sesión',
  LOGOUT_SUCCESS: 'Sesión cerrada'
};



