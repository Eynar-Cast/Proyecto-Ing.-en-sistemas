const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de MySQL
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(400).json({
          success: false,
          message: 'Ya existe un registro con esos datos'
        });
      case 'ER_NO_REFERENCED_ROW_2':
        return res.status(400).json({
          success: false,
          message: 'Referencia inválida a otro registro'
        });
      case 'ER_ROW_IS_REFERENCED_2':
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar porque tiene registros asociados'
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Error en la base de datos',
          error: err.message
        });
    }
  }

  // Error personalizado
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;