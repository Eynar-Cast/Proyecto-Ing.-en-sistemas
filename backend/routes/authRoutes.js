const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login/client', authController.loginClient);
router.post('/login/employee', authController.loginEmployee);
router.post('/register/client', authController.registerClient);

module.exports = router;