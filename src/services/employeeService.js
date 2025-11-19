import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';

export const employeeService = {
  /**
   * Obtiene todos los empleados
   */
  async getAll() {
    return await storageService.get(STORAGE_KEYS.EMPLOYEES) || [];
  },

  /**
   * Guarda todos los empleados
   */
  async saveAll(employees) {
    return await storageService.set(STORAGE_KEYS.EMPLOYEES, employees);
  },

  /**
   * Agrega un nuevo empleado
   */
  async add(employeeData) {
    const employees = await this.getAll();
    
    // Validar si el usuario ya existe
    if (employees.some(e => e.username === employeeData.username)) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    if (employees.some(e => e.email === employeeData.email)) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      createdAt: new Date().toISOString(),
      isActive: true,
      sales: []
    };

    employees.push(newEmployee);
    await this.saveAll(employees);
    
    return newEmployee;
  },

  /**
   * Valida credenciales de empleado
   */
  async validateEmployee(username, password) {
    const employees = await this.getAll();
    return employees.find(e => 
      e.username === username && 
      e.password === password && 
      e.isActive
    );
  },

  /**
   * Actualiza un empleado
   */
  async update(employeeId, updatedData) {
    const employees = await this.getAll();
    const index = employees.findIndex(e => e.id === employeeId);
    
    if (index === -1) {
      throw new Error('Empleado no encontrado');
    }

    employees[index] = {
      ...employees[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    await this.saveAll(employees);
    return employees[index];
  },

  /**
   * Desactiva un empleado
   */
  async deactivate(employeeId) {
    return await this.update(employeeId, { isActive: false });
  },

  /**
   * Activa un empleado
   */
  async activate(employeeId) {
    return await this.update(employeeId, { isActive: true });
  },

  /**
   * Busca un empleado por ID
   */
  async findById(employeeId) {
    const employees = await this.getAll();
    return employees.find(e => e.id === employeeId);
  },

  /**
   * Obtiene ventas de un empleado
   */
  async getEmployeeSales(employeeId, startDate = null, endDate = null) {
    const employees = await this.getAll();
    const employee = employees.find(e => e.id === employeeId);
    
    if (!employee) return [];

    let sales = employee.sales || [];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      sales = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= start && saleDate <= end;
      });
    }

    return sales;
  },

  /**
   * Registra una venta para un empleado
   */
  async registerSale(employeeId, saleData) {
    const employees = await this.getAll();
    const employee = employees.find(e => e.id === employeeId);
    
    if (!employee) {
      throw new Error('Empleado no encontrado');
    }

    const sale = {
      ...saleData,
      employeeId,
      employeeName: employee.fullName,
      registeredAt: new Date().toISOString()
    };

    employee.sales = [...(employee.sales || []), sale];
    await this.saveAll(employees);
    
    return sale;
  }
};