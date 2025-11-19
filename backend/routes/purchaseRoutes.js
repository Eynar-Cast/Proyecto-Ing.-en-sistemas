const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Rutas de compras
router.get('/', purchaseController.getAllPurchases);
router.post('/', purchaseController.createPurchase);
router.get('/:id', purchaseController.getPurchaseById);
router.get('/supplier/:supplierId', purchaseController.getPurchasesBySupplier);

module.exports = router;