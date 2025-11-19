import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  productService, 
  authService, 
  salesService, 
  categoryService,
  supplierService,
  movementService,
  employeeService,
  purchaseService
} from '../services';
import { VIEWS, USER_TYPES, DEFAULT_CATEGORIES } from '../constants';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  // Estados de datos
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [movements, setMovements] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [purchases, setPurchases] = useState([]);
  // Estados de UI
  const [currentView, setCurrentView] = useState(VIEWS.CATALOG);
  const [loading, setLoading] = useState(true);

  // ========== CARGA INICIAL ==========
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [
        productsData,
        categoriesData,
        suppliersData,
        salesData,
        movementsData,
        clientsData,
        employeesData,
        purchasesData 
      ] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        supplierService.getAll(),
        salesService.getAll(),
        movementService.getAll(),
        authService.getClients(),
        employeeService.getAll(),
        purchaseService.getAll() 
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setSales(salesData);
      setMovements(movementsData);
      setClients(clientsData);
      setEmployees(employeesData);
      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== AUTENTICACIÓN ==========
  const login = async (username, password, loginType) => {
  try {
    // LOGIN ADMIN
    if (loginType === USER_TYPES.ADMIN) {
      if (authService.validateAdmin(username, password)) {
        setIsAuthenticated(true);
        setUserType(USER_TYPES.ADMIN);
        setCurrentUser({ username: 'admin', fullName: 'Administrador' });
        setCurrentView(VIEWS.INVENTORY);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales de administrador incorrectas' };
      }

    // LOGIN EMPLOYEE (nuevo)
    } else if (loginType === USER_TYPES.EMPLOYEE) {
      const employee = await employeeService.validateEmployee(username, password);
      if (employee) {
        setIsAuthenticated(true);
        setUserType(USER_TYPES.EMPLOYEE);
        setCurrentUser(employee);
        setCurrentView(VIEWS.POS); // Vista del empleado
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales de empleado incorrectas' };
      }

    // LOGIN CLIENTE
    } else {
      const client = await authService.validateClient(username, password);
      if (client) {
        setIsAuthenticated(true);
        setUserType(USER_TYPES.CLIENT);
        setCurrentUser(client);
        setCurrentView(VIEWS.CATALOG);
        return { success: true };
      } else {
        return { success: false, error: 'Usuario o contraseña incorrectos' };
      }
    }

  } catch (error) {
    return { success: false, error: error.message };
  }
};


  const register = async (clientData) => {
    try {
      const newClient = await authService.registerClient(clientData);
      setClients(prev => [...prev, newClient]);
      return { success: true, client: newClient };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentUser(null);
    setCart([]);
    setCurrentView(VIEWS.CATALOG);
  };

  // ========== PRODUCTOS ==========
  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.add(productData);
      setProducts(prev => [...prev, newProduct]);
      
      // Registrar movimiento de entrada
      await movementService.create({
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'entrada',
        quantity: newProduct.stock,
        reason: 'Producto agregado al inventario',
        user: currentUser?.username || 'admin'
      });
      
      // Recargar movimientos
      const updatedMovements = await movementService.getAll();
      setMovements(updatedMovements);
      
      return { success: true, product: newProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const oldProduct = products.find(p => p.id === productId);
      const updatedProduct = await productService.update(productId, updatedData);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      
      // Registrar movimiento si cambió el stock
      const stockDiff = updatedData.stock - oldProduct.stock;
      if (stockDiff !== 0) {
        await movementService.create({
          productId: productId,
          productName: updatedProduct.name,
          type: stockDiff > 0 ? 'entrada' : 'salida',
          quantity: Math.abs(stockDiff),
          reason: 'Ajuste manual de inventario',
          user: currentUser?.username || 'admin'
        });
        
        // Recargar movimientos
        const updatedMovements = await movementService.getAll();
        setMovements(updatedMovements);
      }
      
      return { success: true, product: updatedProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.delete(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== CATEGORÍAS ==========
  const addCategory = async (categoryName) => {
    try {
      const updatedCategories = await categoryService.add(categoryName);
      setCategories(updatedCategories);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (categoryName) => {
    try {
      // Verificar si hay productos con esa categoría
      const productsInCategory = products.filter(p => p.category === categoryName);
      if (productsInCategory.length > 0) {
        return { 
          success: false, 
          error: `No se puede eliminar. Hay ${productsInCategory.length} productos en esta categoría` 
        };
      }
      
      const updatedCategories = await categoryService.delete(categoryName);
      setCategories(updatedCategories);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== PROVEEDORES ==========
  const addSupplier = async (supplierData) => {
    try {
      const newSupplier = await supplierService.add(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
      return { success: true, supplier: newSupplier };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateSupplier = async (supplierId, updatedData) => {
    try {
      const updatedSupplier = await supplierService.update(supplierId, updatedData);
      setSuppliers(prev => prev.map(s => s.id === supplierId ? updatedSupplier : s));
      return { success: true, supplier: updatedSupplier };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      // Verificar si hay productos asociados
      const productsWithSupplier = products.filter(p => p.supplierId === supplierId.toString());
      if (productsWithSupplier.length > 0) {
        return { 
          success: false, 
          error: `No se puede eliminar. Hay ${productsWithSupplier.length} productos asociados` 
        };
      }
      
      await supplierService.delete(supplierId);
      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== CARRITO ==========
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    const qty = parseInt(quantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };
  // ========== EMPLEADOS ==========
  const addEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeeService.add(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return { success: true, employee: newEmployee };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateEmployee = async (employeeId, updatedData) => {
    try {
      const updatedEmployee = await employeeService.update(employeeId, updatedData);
      setEmployees(prev => prev.map(e => e.id === employeeId ? updatedEmployee : e));
      return { success: true, employee: updatedEmployee };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleEmployeeStatus = async (employeeId, isActive) => {
    try {
      const updatedEmployee = isActive 
        ? await employeeService.activate(employeeId)
        : await employeeService.deactivate(employeeId);
      setEmployees(prev => prev.map(e => e.id === employeeId ? updatedEmployee : e));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const registerEmployeeSale = async (saleData) => {
    try {
      if (!currentUser || userType !== USER_TYPES.EMPLOYEE) {
        return { success: false, error: 'Solo empleados pueden registrar ventas' };
      }

      // Verificar stock
      for (let item of saleData.items) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
          return { 
            success: false, 
            error: `Stock insuficiente para ${item.name}` 
          };
        }
      }

      // Crear venta
      const sale = {
        id: Date.now(),
        items: saleData.items,
        total: saleData.total,
        clientName: saleData.clientName || 'Cliente',
        date: new Date().toISOString(),
        employeeId: currentUser.id,
        employeeName: currentUser.fullName
      };

      // Registrar venta en empleado
      await employeeService.registerSale(currentUser.id, sale);

      // Registrar venta global
      const newSale = await salesService.create(sale);
      setSales(prev => [...prev, newSale]);

      // Actualizar stock
      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts);

      // Registrar movimientos
      for (let item of saleData.items) {
        await movementService.create({
          productId: item.id,
          productName: item.name,
          type: 'venta',
          quantity: item.quantity,
          reason: `Venta #${sale.id} - Empleado: ${currentUser.fullName}`,
          user: currentUser.username
        });
      }

      // Recargar movimientos
      const updatedMovements = await movementService.getAll();
      setMovements(updatedMovements);

      // Actualizar empleado en estado
      const updatedEmployees = await employeeService.getAll();
      setEmployees(updatedEmployees);
      setCurrentUser(updatedEmployees.find(e => e.id === currentUser.id));

      return { success: true, sale };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  // ========== VENTAS ==========
  const completePurchase = async () => {
    try {
      if (cart.length === 0) {
        return { success: false, error: 'El carrito está vacío' };
      }

      // Verificar stock disponible
      for (let item of cart) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
          return { 
            success: false, 
            error: `Stock insuficiente para ${item.name}` 
          };
        }
      }

      // Crear venta
      const saleData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        clientId: currentUser?.id,
        clientName: currentUser?.fullName || 'Cliente',
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
      };

      const newSale = await salesService.create(saleData);
      setSales(prev => [...prev, newSale]);

      // Actualizar stock de productos
      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts);

      // Registrar movimientos
      for (let item of cart) {
        await movementService.create({
          productId: item.id,
          productName: item.name,
          type: 'venta',
          quantity: item.quantity,
          reason: `Venta #${newSale.id}`,
          user: currentUser?.username || 'Cliente'
        });
      }

      // Recargar movimientos
      const updatedMovements = await movementService.getAll();
      setMovements(updatedMovements);

      // Actualizar compras del cliente
      if (userType === USER_TYPES.CLIENT && currentUser) {
        const updatedClient = {
          ...currentUser,
          purchases: [...(currentUser.purchases || []), {
            id: newSale.id,
            date: newSale.date,
            items: newSale.items,
            total: newSale.total
          }]
        };
        
        await authService.updateClient(currentUser.id, updatedClient);
        setCurrentUser(updatedClient);
        
        const updatedClients = await authService.getClients();
        setClients(updatedClients);
      }

      clearCart();
      return { success: true, sale: newSale };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const registerPurchase = async (purchaseData) => {
  try {
    const newPurchase = await purchaseService.create(purchaseData);
    setPurchases(prev => [...prev, newPurchase]);
    
    // Recargar productos actualizados
    const updatedProducts = await productService.getAll();
    setProducts(updatedProducts);
    
    // Recargar movimientos
    const updatedMovements = await movementService.getAll();
    setMovements(updatedMovements);
    
    return { success: true, purchase: newPurchase };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

  // ========== VALORES DEL CONTEXTO ==========
  const value = {
    // Autenticación
    isAuthenticated,
    currentUser,
    userType,
    login,
    register,
    logout,
    
    // Datos
    products,
    categories,
    suppliers,
    sales,
    movements,
    clients,
    cart,
    employees,
    purchases, 
    
    // UI
    currentView,
    setCurrentView,
    loading,
    
    // Acciones de productos
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Acciones de categorías
    addCategory,
    deleteCategory,
    
    // Acciones de proveedores
    addSupplier,
    updateSupplier,
    deleteSupplier,
    
    // Acciones de carrito
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // Acciones de ventas
    completePurchase,
    // Acciones de compras
    registerPurchase,  // ← AGREGAR ESTA LÍNEA
    // Acciones de empleados
    addEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    registerEmployeeSale
  };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};