const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer Order Routes
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);

// Admin Order Management Routes
router.get('/admin/all', protect, adminOnly, orderController.getAllOrders);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
