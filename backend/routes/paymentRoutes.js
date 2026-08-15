const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment Gateway Simulation Routes
router.post('/create-order', paymentController.createPaymentIntent);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
