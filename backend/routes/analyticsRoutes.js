const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Admin Analytics Dashboard Data
router.get('/dashboard', verifyToken, verifyAdmin, analyticsController.getDashboardStats);

module.exports = router;
