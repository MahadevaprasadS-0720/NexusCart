const express = require('express');
const router = express.Router();
const cloverController = require('../controllers/cloverController');

// Public Clover Status & Live Products
router.get('/status', cloverController.getStatus);
router.get('/products', cloverController.getLiveProducts);
router.get('/products/:id', cloverController.getLiveProductById);

// Inventory Sync & Charge
router.post('/sync', cloverController.syncInventory);
router.post('/charge', cloverController.processCharge);

module.exports = router;
