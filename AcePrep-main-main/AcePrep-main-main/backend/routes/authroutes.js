const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

// Route to login
router.post('/login', authController.login);
router.post('/signup', authController.signup);


module.exports = router;
