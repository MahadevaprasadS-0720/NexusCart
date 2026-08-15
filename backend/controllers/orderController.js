const OrderModel = require('../models/Order');

// @desc    Create new customer order (User)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, items, shippingAddress, totalPrice, totalAmount, paymentMethod, paymentStatus } = req.body;

    const rawItems = orderItems || items;
    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items found in cart.'
      });
    }

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required.'
      });
    }

    const orderData = {
      user: req.user ? (req.user.id || req.user._id) : null,
      userId: req.user ? (req.user.id || req.user._id) : 'usr-customer-1',
      customerName: shippingAddress.fullName || (req.user ? req.user.name : 'Valued Customer'),
      customerEmail: req.user ? req.user.email : 'customer@example.com',
      orderItems: rawItems,
      shippingAddress,
      totalPrice: Number(totalPrice || totalAmount || 0),
      paymentMethod: paymentMethod || 'UPI / NetBanking',
      paymentStatus: paymentStatus || 'Paid'
    };

    const newOrder = await OrderModel.create(orderData);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders (User)
// @route   GET /api/orders/my-orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : 'usr-customer-1';
    const orders = await OrderModel.findByUserId(userId);

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customer orders (Admin Only)
// @route   GET /api/orders/admin/all
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.findAll();

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order delivery status (Admin Only)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, status } = req.body;
    const newStatus = orderStatus || status;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new orderStatus.'
      });
    }

    const updatedOrder = await OrderModel.updateStatus(req.params.id, newStatus);
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
