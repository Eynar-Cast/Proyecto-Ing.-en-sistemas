const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');

router.get('/', movementController.getAllMovements);
router.post('/', movementController.createMovement);
router.get('/product/:productId', movementController.getMovementsByProduct);
router.get('/type/:type', movementController.getMovementsByType);
router.get('/range', movementController.getMovementsByDateRange);

module.exports = router;