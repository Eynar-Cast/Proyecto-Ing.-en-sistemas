const db = require('../config/database');
const bcrypt = require('bcrypt');

// Obtener todos los empleados
exports.getAllEmployees = async (req, res, next) => {
  try {
    const [employees] = await db.query('SELECT * FROM employees ORDER BY created_at DESC');

    const formattedEmployees = employees.map(e => ({
      id: e.id,
      username: e.username,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      isActive: e.is_active === 1,
      createdAt: e.created_at,
      sales: [] // Las ventas se cargan por separado
    }));

    res.json(formattedEmployees);
  } catch (error) {
    next(error);
  }
};

// Obtener empleado por ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [employees] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    const e = employees[0];
    const formattedEmployee = {
      id: e.id,
      username: e.username,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      isActive: e.is_active === 1,
      createdAt: e.created_at
    };

    res.json(formattedEmployee);
  } catch (error) {
    next(error);
  }
};

// Crear empleado
exports.createEmployee = async (req, res, next) => {
  try {
    const { username, password, fullName, email, phone } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO employees (username, password, full_name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, fullName, email, phone || null]
    );

    const [newEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);

    const e = newEmployee[0];
    const formattedEmployee = {
      id: e.id,
      username: e.username,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      isActive: e.is_active === 1,
      createdAt: e.created_at,
      sales: []
    };

    res.status(201).json(formattedEmployee);
  } catch (error) {
    next(error);
  }
};

// Actualizar empleado
exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, password } = req.body;

    if (password) {
      // Si se proporciona una nueva contraseña, actualizarla
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE employees SET full_name = ?, email = ?, phone = ?, password = ? WHERE id = ?',
        [fullName, email, phone || null, hashedPassword, id]
      );
    } else {
      // Si no, solo actualizar los demás campos
      await db.query(
        'UPDATE employees SET full_name = ?, email = ?, phone = ? WHERE id = ?',
        [fullName, email, phone || null, id]
      );
    }

    const [updatedEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);

    const e = updatedEmployee[0];
    const formattedEmployee = {
      id: e.id,
      username: e.username,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      isActive: e.is_active === 1,
      createdAt: e.created_at,
      sales: []
    };

    res.json(formattedEmployee);
  } catch (error) {
    next(error);
  }
};

// Desactivar empleado
exports.deactivateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.query('UPDATE employees SET is_active = 0 WHERE id = ?', [id]);

    const [updatedEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);

    const e = updatedEmployee[0];
    const formattedEmployee = {
      id: e.id,
      username: e.username,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      isActive: e.is_active === 1,
      createdAt: e.created_at,
      sales: []
    };

    res.json(formattedEmployee);
  } catch (error) {
    next(error);
  }
};

// Activar empleado
exports.activateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.query('UPDATE employees SET is_active = 1 WHERE id = ?', [id]);

    const [updatedEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);

    const e = updatedEmployee[0];
    const formattedEmployee = {
      id: e.id,
      username: e.username,
      fullName: e.full_name,
      email: e.email,
      phone: e.phone,
      isActive: e.is_active === 1,
      createdAt: e.created_at,
      sales: []
    };

    res.json(formattedEmployee);
  } catch (error) {
    next(error);
  }
};

// Obtener ventas de un empleado
exports.getEmployeeSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM sales WHERE employee_id = ?';
    const params = [id];

    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const [sales] = await db.query(query, params);

    res.json(sales);
  } catch (error) {
    next(error);
  }
};

// Registrar venta para empleado
exports.registerSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const saleData = req.body;

    // Aquí se registraría la venta (esto se maneja mejor en el controlador de ventas)
    // Este endpoint es más para referencia

    res.json({
      success: true,
      message: 'Venta registrada'
    });
  } catch (error) {
    next(error);
  }
};