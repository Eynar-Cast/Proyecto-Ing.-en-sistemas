const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:oldName', categoryController.updateCategory);
router.delete('/:name', categoryController.deleteCategory);

module.exports = router;