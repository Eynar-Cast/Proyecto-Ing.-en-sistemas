/**
 * Formatea un número como precio en dólares
 */
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea una fecha corta (solo día/mes/año)
 */
export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Valida un email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un teléfono (formato simple)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Genera un ID único basado en timestamp
 */
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Filtra productos según criterios
 */
export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Filtro por búsqueda
  if (filters.searchTerm) {
    const search = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    );
  }

  // Filtro por categoría
  if (filters.category && filters.category !== 'Todas') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  // Filtro por rango de precio
  if (filters.priceMin !== '' && filters.priceMin !== null) {
    filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.priceMin));
  }
  if (filters.priceMax !== '' && filters.priceMax !== null) {
    filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.priceMax));
  }

  return filtered;
};

/**
 * Ordena productos según criterio
 */
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case 'price-desc':
      return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case 'stock':
      return sorted.sort((a, b) => parseInt(b.stock) - parseInt(a.stock));
    default:
      return sorted;
  }
};

/**
 * Verifica si un producto tiene stock bajo
 */
export const hasLowStock = (product) => {
  return parseInt(product.stock) <= parseInt(product.minStock || 10);
};

/**
 * Calcula el total del carrito
 */
export const calculateCartTotal = (cart) => {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

/**
 * Calcula la cantidad total de items en el carrito
 */
export const calculateCartItemsCount = (cart) => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Exporta datos a JSON
 */
export const exportToJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Valida datos de formulario de producto
 */
export const validateProductForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'El nombre es obligatorio';
  }

  if (!formData.category) {
    errors.category = 'Debes seleccionar una categoría';
  }

  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }

  if (!formData.stock || parseInt(formData.stock) < 0) {
    errors.stock = 'El stock no puede ser negativo';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de registro de cliente
 */
export const validateClientRegistration = (data) => {
  const errors = {};

  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'El nombre completo es obligatorio';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Ingresa un email válido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
