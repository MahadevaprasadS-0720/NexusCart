// Mock Stripe / Razorpay Payment Gateway Integration Controller

// @desc    Create Payment Gateway Order / Intent (Razorpay / Stripe Simulation)
// @route   POST /api/payment/create-order
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount.'
      });
    }

    // Generate Payment Gateway Intent / Order Data
    const paymentData = {
      success: true,
      paymentGateway: 'Razorpay / Stripe Gateway',
      orderId: `pay_ord_${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount: Math.round(amount * 100), // in paise/cents
      currency: currency.toUpperCase(),
      clientSecret: `pi_sim_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      receipt: receipt || `receipt_${Date.now()}`
    };

    return res.json(paymentData);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Payment Gateway Transaction Signature
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id, paymentIntentId, status = 'success' } = req.body;

    const paymentId = razorpay_payment_id || paymentIntentId || `pay_tx_${Math.floor(100000 + Math.random() * 900000)}`;

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction: {
        paymentId,
        paymentStatus: 'Paid',
        method: req.body.paymentMethod || 'UPI / Card',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
