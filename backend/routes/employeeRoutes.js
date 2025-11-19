const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.put('/:id/deactivate', employeeController.deactivateEmployee);
router.put('/:id/activate', employeeController.activateEmployee);
router.get('/:id/sales', employeeController.getEmployeeSales);
router.post('/:id/sales', employeeController.registerSale);

module.exports = router;