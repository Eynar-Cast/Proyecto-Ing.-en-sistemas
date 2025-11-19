const db = require('../config/database');

// Obtener todas las categorías
exports.getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT name FROM categories ORDER BY name');
    const categoryNames = categories.map(c => c.name);
    res.json(categoryNames);
  } catch (error) {
    next(error);
  }
};

// Crear categoría
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Verificar si ya existe
    const [existing] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La categoría ya existe'
      });
    }

    await db.query('INSERT INTO categories (name) VALUES (?)', [name]);

    // Devolver todas las categorías
    const [categories] = await db.query('SELECT name FROM categories ORDER BY name');
    const categoryNames = categories.map(c => c.name);
    
    res.status(201).json(categoryNames);
  } catch (error) {
    next(error);
  }
};

// Actualizar categoría
exports.updateCategory = async (req, res, next) => {
  try {
    const { oldName } = req.params;
    const { newName } = req.body;

    // Verificar si el nuevo nombre ya existe
    const [existing] = await db.query('SELECT * FROM categories WHERE name = ? AND name != ?', [newName, oldName]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    // Actualizar categoría
    await db.query('UPDATE categories SET name = ? WHERE name = ?', [newName, oldName]);

    // Actualizar productos con esa categoría
    await db.query('UPDATE products SET category = ? WHERE category = ?', [newName, oldName]);

    // Devolver todas las categorías
    const [categories] = await db.query('SELECT name FROM categories ORDER BY name');
    const categoryNames = categories.map(c => c.name);
    
    res.json(categoryNames);
  } catch (error) {
    next(error);
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res, next) => {
  try {
    const { name } = req.params;

    // Verificar si hay productos con esa categoría
    const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE category = ?', [name]);
    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${products[0].count} productos en esta categoría`
      });
    }

    await db.query('DELETE FROM categories WHERE name = ?', [name]);

    // Devolver todas las categorías
    const [categories] = await db.query('SELECT name FROM categories ORDER BY name');
    const categoryNames = categories.map(c => c.name);
    
    res.json(categoryNames);
  } catch (error) {
    next(error);
  }
};