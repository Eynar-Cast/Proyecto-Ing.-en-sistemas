const db = require('../config/database');

// Obtener todas las ventas
exports.getAllSales = async (req, res, next) => {
  try {
    const [sales] = await db.query(`
      SELECT 
        s.*,
        c.full_name as client_name,
        e.full_name as employee_name
      FROM sales s
      LEFT JOIN clients c ON s.client_id = c.id
      LEFT JOIN employees e ON s.employee_id = e.id
      ORDER BY s.date DESC
    `);

    // Obtener items de cada venta
    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const [items] = await db.query(
          'SELECT * FROM sale_items WHERE sale_id = ?',
          [sale.id]
        );
        
        return {
          id: sale.id,
          items: items.map(i => ({
            id: i.product_id,
            name: i.product_name,
            category: i.category,
            price: parseFloat(i.price),
            quantity: i.quantity
          })),
          total: parseFloat(sale.total),
          clientId: sale.client_id,
          clientName: sale.client_name || 'Cliente',
          employeeId: sale.employee_id,
          employeeName: sale.employee_name,
          date: sale.date,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0)
        };
      })
    );

    res.json(salesWithItems);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva venta
exports.createSale = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { items, total, clientId, clientName, employeeId, itemCount } = req.body;

    // Verificar stock disponible
    for (let item of items) {
      const [products] = await connection.query(
        'SELECT stock FROM products WHERE id = ?',
        [item.id]
      );

      if (products.length === 0 || products[0].stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${item.name}`
        });
      }
    }

    // Crear venta
    const [saleResult] = await connection.query(
      'INSERT INTO sales (client_id, employee_id, total, date) VALUES (?, ?, ?, NOW())',
      [clientId || null, employeeId || null, total]
    );

    const saleId = saleResult.insertId;

    // Insertar items de la venta
    for (let item of items) {
      await connection.query(
        `INSERT INTO sale_items (sale_id, product_id, product_name, category, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [saleId, item.id, item.name, item.category, item.price, item.quantity]
      );

      // Actualizar stock del producto
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );

      // Registrar movimiento
      await connection.query(
        `INSERT INTO movements (product_id, product_name, type, quantity, reason, user, date)
         VALUES (?, ?, 'venta', ?, ?, ?, NOW())`,
        [item.id, item.name, item.quantity, `Venta #${saleId}`, clientName || 'Cliente']
      );
    }

    await connection.commit();

    // Obtener la venta completa
    const [newSale] = await connection.query('SELECT * FROM sales WHERE id = ?', [saleId]);
    const [saleItems] = await connection.query('SELECT * FROM sale_items WHERE sale_id = ?', [saleId]);

    res.status(201).json({
      id: newSale[0].id,
      items: saleItems.map(i => ({
        id: i.product_id,
        name: i.product_name,
        category: i.category,
        price: parseFloat(i.price),
        quantity: i.quantity
      })),
      total: parseFloat(newSale[0].total),
      clientId: newSale[0].client_id,
      clientName: clientName || 'Cliente',
      employeeId: newSale[0].employee_id,
      date: newSale[0].date,
      itemCount: saleItems.reduce((sum, i) => sum + i.quantity, 0)
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Obtener ventas por cliente
exports.getSalesByClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const [sales] = await db.query(
      'SELECT * FROM sales WHERE client_id = ? ORDER BY date DESC',
      [clientId]
    );

    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const [items] = await db.query(
          'SELECT * FROM sale_items WHERE sale_id = ?',
          [sale.id]
        );
        
        return {
          ...sale,
          items: items.map(i => ({
            id: i.product_id,
            name: i.product_name,
            price: parseFloat(i.price),
            quantity: i.quantity
          }))
        };
      })
    );

    res.json(salesWithItems);
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas de ventas
exports.getStats = async (req, res, next) => {
  try {
    const [totalSales] = await db.query('SELECT COUNT(*) as count, SUM(total) as revenue FROM sales');
    
    const [todaySales] = await db.query(
      'SELECT COUNT(*) as count, SUM(total) as revenue FROM sales WHERE DATE(date) = CURDATE()'
    );

    const [monthSales] = await db.query(
      'SELECT COUNT(*) as count, SUM(total) as revenue FROM sales WHERE YEAR(date) = YEAR(NOW()) AND MONTH(date) = MONTH(NOW())'
    );

    res.json({
      totalSales: totalSales[0].count || 0,
      totalRevenue: parseFloat(totalSales[0].revenue) || 0,
      averageSale: totalSales[0].count > 0 ? parseFloat(totalSales[0].revenue) / totalSales[0].count : 0,
      todaySales: todaySales[0].count || 0,
      todayRevenue: parseFloat(todaySales[0].revenue) || 0,
      monthSales: monthSales[0].count || 0,
      monthRevenue: parseFloat(monthSales[0].revenue) || 0
    });
  } catch (error) {
    next(error);
  }
};

// Obtener productos más vendidos
exports.getTopProducts = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const [topProducts] = await db.query(
      `SELECT 
        product_name,
        SUM(quantity) as total_quantity,
        SUM(price * quantity) as total_revenue
       FROM sale_items
       GROUP BY product_name
       ORDER BY total_quantity DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json(topProducts.map(p => ({
      name: p.product_name,
      quantity: p.total_quantity,
      revenue: parseFloat(p.total_revenue)
    })));
  } catch (error) {
    next(error);
  }
};