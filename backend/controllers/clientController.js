const db = require('../config/database');
const bcrypt = require('bcrypt');

// Obtener todos los clientes
exports.getAllClients = async (req, res, next) => {
  try {
    const [clients] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');

    const formattedClients = clients.map(c => ({
      id: c.id,
      username: c.username,
      fullName: c.full_name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      createdAt: c.created_at,
      purchases: [] // Las compras se pueden cargar por separado si es necesario
    }));

    res.json(formattedClients);
  } catch (error) {
    next(error);
  }
};

// Obtener cliente por ID
exports.getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [clients] = await db.query('SELECT * FROM clients WHERE id = ?', [id]);

    if (clients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    const c = clients[0];
    const formattedClient = {
      id: c.id,
      username: c.username,
      fullName: c.full_name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      createdAt: c.created_at
    };

    res.json(formattedClient);
  } catch (error) {
    next(error);
  }
};

// Actualizar cliente
exports.updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, address } = req.body;

    await db.query(
      'UPDATE clients SET full_name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [fullName, email || null, phone || null, address || null, id]
    );

    const [updatedClient] = await db.query('SELECT * FROM clients WHERE id = ?', [id]);

    const c = updatedClient[0];
    const formattedClient = {
      id: c.id,
      username: c.username,
      fullName: c.full_name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      createdAt: c.created_at
    };

    res.json(formattedClient);
  } catch (error) {
    next(error);
  }
};

// Eliminar cliente
exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM clients WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};