const db = require('../config/database');

// Obtener todos los movimientos
exports.getAllMovements = async (req, res, next) => {
  try {
    const [movements] = await db.query('SELECT * FROM movements ORDER BY date DESC');
    res.json(movements);
  } catch (error) {
    next(error);
  }
};

// Crear movimiento
exports.createMovement = async (req, res, next) => {
  try {
    const { productId, productName, type, quantity, reason, user } = req.body;

    const [result] = await db.query(
      `INSERT INTO movements (product_id, product_name, type, quantity, reason, user, date)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [productId, productName, type, quantity, reason, user]
    );

    const [newMovement] = await db.query('SELECT * FROM movements WHERE id = ?', [result.insertId]);

    res.status(201).json(newMovement[0]);
  } catch (error) {
    next(error);
  }
};

// Obtener movimientos por producto
exports.getMovementsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const [movements] = await db.query(
      'SELECT * FROM movements WHERE product_id = ? ORDER BY date DESC',
      [productId]
    );

    res.json(movements);
  } catch (error) {
    next(error);
  }
};

// Obtener movimientos por tipo
exports.getMovementsByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    const [movements] = await db.query(
      'SELECT * FROM movements WHERE type = ? ORDER BY date DESC',
      [type]
    );

    res.json(movements);
  } catch (error) {
    next(error);
  }
};

// Obtener movimientos por rango de fechas
exports.getMovementsByDateRange = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const [movements] = await db.query(
      'SELECT * FROM movements WHERE date BETWEEN ? AND ? ORDER BY date DESC',
      [start, end]
    );

    res.json(movements);
  } catch (error) {
    next(error);
  }
};