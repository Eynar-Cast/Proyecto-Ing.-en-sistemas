const db = require('../config/database');

// Obtener todos los productos
exports.getAllProducts = async (req, res, next) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*,
        s.name as supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);

    // Convertir campos de MySQL a formato JavaScript
    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      stock: p.stock,
      unit: p.unit,
      description: p.description,
      minStock: p.min_stock,
      image: p.image,
      supplierId: p.supplier_id?.toString(),
      supplierName: p.supplier_name,
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));

    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const p = products[0];
    const formattedProduct = {
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      stock: p.stock,
      unit: p.unit,
      description: p.description,
      minStock: p.min_stock,
      image: p.image,
      supplierId: p.supplier_id?.toString(),
      createdAt: p.created_at,
      updatedAt: p.updated_at
    };

    res.json(formattedProduct);
  } catch (error) {
    next(error);
  }
};

// Crear producto
exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock, unit, description, minStock, image, supplierId } = req.body;

    const [result] = await db.query(
      `INSERT INTO products (name, category, price, stock, unit, description, min_stock, image, supplier_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, price, stock, unit || 'unidad', description, minStock || 10, image, supplierId || null]
    );

    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    
    const p = newProduct[0];
    const formattedProduct = {
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      stock: p.stock,
      unit: p.unit,
      description: p.description,
      minStock: p.min_stock,
      image: p.image,
      supplierId: p.supplier_id?.toString(),
      createdAt: p.created_at,
      updatedAt: p.updated_at
    };

    res.status(201).json(formattedProduct);
  } catch (error) {
    next(error);
  }
};

// Actualizar producto
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, unit, description, minStock, image, supplierId } = req.body;

    await db.query(
      `UPDATE products 
       SET name = ?, category = ?, price = ?, stock = ?, unit = ?, 
           description = ?, min_stock = ?, image = ?, supplier_id = ?
       WHERE id = ?`,
      [name, category, price, stock, unit, description, minStock, image, supplierId || null, id]
    );

    const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    
    const p = updatedProduct[0];
    const formattedProduct = {
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      stock: p.stock,
      unit: p.unit,
      description: p.description,
      minStock: p.min_stock,
      image: p.image,
      supplierId: p.supplier_id?.toString(),
      createdAt: p.created_at,
      updatedAt: p.updated_at
    };

    res.json(formattedProduct);
  } catch (error) {
    next(error);
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar stock
exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    const [products] = await db.query('SELECT stock FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    let newStock;
    const currentStock = products[0].stock;

    switch (operation) {
      case 'add':
        newStock = currentStock + quantity;
        break;
      case 'subtract':
        newStock = currentStock - quantity;
        break;
      default:
        newStock = quantity;
    }

    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente'
      });
    }

    await db.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);

    const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    
    const p = updatedProduct[0];
    const formattedProduct = {
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      stock: p.stock,
      unit: p.unit,
      description: p.description,
      minStock: p.min_stock,
      image: p.image,
      supplierId: p.supplier_id?.toString(),
      createdAt: p.created_at,
      updatedAt: p.updated_at
    };

    res.json(formattedProduct);
  } catch (error) {
    next(error);
  }
};