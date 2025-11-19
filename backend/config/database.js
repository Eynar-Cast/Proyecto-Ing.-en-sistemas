const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia esto por tu usuario
  password: '', // Cambia esto por tu contraseña
  database: 'materialpro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a la base de datos MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

module.exports = pool;