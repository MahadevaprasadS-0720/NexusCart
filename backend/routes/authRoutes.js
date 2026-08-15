const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Authentication Routes
router.post('/signup', authController.registerUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/admin-login', authController.loginAdmin);
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
