const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.getAllSales);
router.post('/', saleController.createSale);
router.get('/client/:clientId', saleController.getSalesByClient);
router.get('/stats', saleController.getStats);
router.get('/top-products', saleController.getTopProducts);

module.exports = router;