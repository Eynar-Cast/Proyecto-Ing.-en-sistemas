import { apiService } from './apiService';

export const employeeService = {
  /**
   * Obtiene todos los empleados
   */
  async getAll() {
    try {
      return await apiService.get('/employees');
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      return [];
    }
  },

  /**
   * Agrega un nuevo empleado
   */
  async add(employeeData) {
    try {
      return await apiService.post('/employees', employeeData);
    } catch (error) {
      throw new Error(error.message || 'Error al agregar empleado');
    }
  },

  /**
   * Valida credenciales de empleado
   */
  async validateEmployee(username, password) {
    try {
      const response = await apiService.post('/auth/login/employee', {
        username,
        password
      });
      return response.employee;
    } catch (error) {
      return null;
    }
  },

  /**
   * Actualiza un empleado
   */
  async update(employeeId, updatedData) {
    try {
      return await apiService.put(`/employees/${employeeId}`, updatedData);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar empleado');
    }
  },

  /**
   * Desactiva un empleado
   */
  async deactivate(employeeId) {
    try {
      return await apiService.put(`/employees/${employeeId}/deactivate`);
    } catch (error) {
      throw new Error(error.message || 'Error al desactivar empleado');
    }
  },

  /**
   * Activa un empleado
   */
  async activate(employeeId) {
    try {
      return await apiService.put(`/employees/${employeeId}/activate`);
    } catch (error) {
      throw new Error(error.message || 'Error al activar empleado');
    }
  },

  /**
   * Busca un empleado por ID
   */
  async findById(employeeId) {
    try {
      return await apiService.get(`/employees/${employeeId}`);
    } catch (error) {
      throw new Error(error.message || 'Empleado no encontrado');
    }
  },

  /**
   * Obtiene ventas de un empleado
   */
  async getEmployeeSales(employeeId, startDate = null, endDate = null) {
    try {
      let url = `/employees/${employeeId}/sales`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return await apiService.get(url);
    } catch (error) {
      console.error('Error al obtener ventas del empleado:', error);
      return [];
    }
  },

  /**
   * Registra una venta para un empleado
   */
  async registerSale(employeeId, saleData) {
    try {
      return await apiService.post(`/employees/${employeeId}/sales`, saleData);
    } catch (error) {
      throw new Error(error.message || 'Error al registrar venta');
    }
  }
};