const db = require('../config/database');

// Obtener todas las compras
exports.getAllPurchases = async (req, res, next) => {
  try {
    const [purchases] = await db.query(`
      SELECT 
        p.*,
        s.name as supplier_name
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.date DESC
    `);

    // Obtener items de cada compra
    for (let purchase of purchases) {
      const [items] = await db.query(
        'SELECT * FROM purchase_items WHERE purchase_id = ?',
        [purchase.id]
      );
      purchase.items = items;
    }

    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

// Crear nueva compra
exports.createPurchase = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { supplierId, supplierName, items, total, notes, user } = req.body;

    // Validar que haya items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe incluir al menos un producto'
      });
    }

    // Insertar compra
    const [purchaseResult] = await connection.query(
      'INSERT INTO purchases (supplier_id, supplier_name, total, notes, user) VALUES (?, ?, ?, ?, ?)',
      [supplierId, supplierName, total, notes || null, user]
    );

    const purchaseId = purchaseResult.insertId;

    // Insertar items y actualizar stock
    for (let item of items) {
      // Insertar item de compra
      await connection.query(
        'INSERT INTO purchase_items (purchase_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [purchaseId, item.productId, item.productName, item.price, item.quantity]
      );

      // Actualizar stock del producto
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.productId]
      );

      // Registrar movimiento
      await connection.query(
        'INSERT INTO movements (product_id, product_name, type, quantity, reason, user) VALUES (?, ?, ?, ?, ?, ?)',
        [
          item.productId,
          item.productName,
          'entrada',
          item.quantity,
          `Compra #${purchaseId} a proveedor ${supplierName}`,
          user
        ]
      );
    }

    await connection.commit();

    // Obtener la compra completa
    const [newPurchase] = await connection.query(
      'SELECT * FROM purchases WHERE id = ?',
      [purchaseId]
    );

    const [purchaseItems] = await connection.query(
      'SELECT * FROM purchase_items WHERE purchase_id = ?',
      [purchaseId]
    );

    newPurchase[0].items = purchaseItems;

    res.status(201).json(newPurchase[0]);
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Obtener compra por ID
exports.getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [purchases] = await db.query('SELECT * FROM purchases WHERE id = ?', [id]);
    
    if (purchases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada'
      });
    }

    const [items] = await db.query(
      'SELECT * FROM purchase_items WHERE purchase_id = ?',
      [id]
    );

    const purchase = purchases[0];
    purchase.items = items;

    res.json(purchase);
  } catch (error) {
    next(error);
  }
};

// Obtener compras por proveedor
exports.getPurchasesBySupplier = async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    
    const [purchases] = await db.query(
      'SELECT * FROM purchases WHERE supplier_id = ? ORDER BY date DESC',
      [supplierId]
    );

    for (let purchase of purchases) {
      const [items] = await db.query(
        'SELECT * FROM purchase_items WHERE purchase_id = ?',
        [purchase.id]
      );
      purchase.items = items;
    }

    res.json(purchases);
  } catch (error) {
    next(error);
  }
};