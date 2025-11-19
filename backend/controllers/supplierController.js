const db = require('../config/database');

// Obtener todos los proveedores
exports.getAllSuppliers = async (req, res, next) => {
  try {
    const [suppliers] = await db.query('SELECT * FROM suppliers ORDER BY name');
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

// Obtener proveedor por ID
exports.getSupplierById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [suppliers] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);

    if (suppliers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json(suppliers[0]);
  } catch (error) {
    next(error);
  }
};

// Crear proveedor
exports.createSupplier = async (req, res, next) => {
  try {
    const { name, phone, email, address, contact } = req.body;

    const [result] = await db.query(
      'INSERT INTO suppliers (name, phone, email, address, contact) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email || null, address || null, contact || null]
    );

    const [newSupplier] = await db.query('SELECT * FROM suppliers WHERE id = ?', [result.insertId]);

    res.status(201).json(newSupplier[0]);
  } catch (error) {
    next(error);
  }
};

// Actualizar proveedor
exports.updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, contact } = req.body;

    await db.query(
      'UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ?, contact = ? WHERE id = ?',
      [name, phone, email || null, address || null, contact || null, id]
    );

    const [updatedSupplier] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);

    res.json(updatedSupplier[0]);
  } catch (error) {
    next(error);
  }
};

// Eliminar proveedor
exports.deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si hay productos asociados
    const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE supplier_id = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${products[0].count} productos asociados`
      });
    }

    await db.query('DELETE FROM suppliers WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Proveedor eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};