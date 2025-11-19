const db = require('../config/database');
const bcrypt = require('bcrypt');

// Login de cliente
exports.loginClient = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const [clients] = await db.query('SELECT * FROM clients WHERE username = ?', [username]);

    if (clients.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const client = clients[0];
    const isValidPassword = await bcrypt.compare(password, client.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // No enviar la contraseña en la respuesta
    const { password: _, ...clientData } = client;

    res.json({
      success: true,
      client: {
        id: clientData.id,
        username: clientData.username,
        fullName: clientData.full_name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        createdAt: clientData.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de empleado
exports.loginEmployee = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const [employees] = await db.query(
      'SELECT * FROM employees WHERE username = ? AND is_active = 1',
      [username]
    );

    if (employees.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const employee = employees[0];
    const isValidPassword = await bcrypt.compare(password, employee.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const { password: _, ...employeeData } = employee;

    res.json({
      success: true,
      employee: {
        id: employeeData.id,
        username: employeeData.username,
        fullName: employeeData.full_name,
        email: employeeData.email,
        phone: employeeData.phone,
        isActive: employeeData.is_active === 1,
        createdAt: employeeData.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Registro de cliente
exports.registerClient = async (req, res, next) => {
  try {
    const { username, password, fullName, email, phone, address } = req.body;

    // Verificar si el usuario ya existe
    const [existing] = await db.query('SELECT * FROM clients WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO clients (username, password, full_name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, fullName, email, phone || null, address || null]
    );

    const [newClient] = await db.query('SELECT * FROM clients WHERE id = ?', [result.insertId]);
    const { password: _, ...clientData } = newClient[0];

    res.status(201).json({
      success: true,
      client: {
        id: clientData.id,
        username: clientData.username,
        fullName: clientData.full_name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        createdAt: clientData.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};