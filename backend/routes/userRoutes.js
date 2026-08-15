const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Admin User Management Routes
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.put('/:id/role', verifyToken, verifyAdmin, userController.updateUserRole);

module.exports = router;
