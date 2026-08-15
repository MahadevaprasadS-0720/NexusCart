const mongoose = require('mongoose');
const { initialOrders } = require('../data/mockData');

// Define Mongoose Schema for Order
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userId: {
      type: String,
      default: 'usr-customer-1'
    },
    customerName: {
      type: String,
      default: 'Valued Customer'
    },
    customerEmail: {
      type: String,
      default: 'customer@example.com'
    },
    orderItems: [
      {
        product: {
          type: String,
          required: true
        },
        productId: String,
        title: String,
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        price: {
          type: Number,
          required: true
        },
        image: String
      }
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' }
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Paid'
    },
    paymentMethod: {
      type: String,
      default: 'UPI / NetBanking'
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

let MongooseOrderModel;
try {
  MongooseOrderModel = mongoose.model('Order', orderSchema);
} catch (e) {
  MongooseOrderModel = mongoose.models.Order;
}

// In-Memory Storage Fallback
let ordersStore = [...initialOrders];

class OrderModel {
  static async create(data) {
    const total = Number(data.totalPrice || data.totalAmount || 0);
    const items = (data.orderItems || data.items || []).map(item => ({
      product: item.product || item.productId || item.title,
      productId: item.productId || item.product,
      title: item.title || item.product,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    }));

    try {
      if (mongoose.connection.readyState === 1 && MongooseOrderModel) {
        return await MongooseOrderModel.create({
          user: data.user || null,
          userId: data.userId || 'usr-customer-1',
          customerName: data.customerName || data.shippingAddress?.fullName || 'Valued Customer',
          customerEmail: data.customerEmail || 'customer@example.com',
          orderItems: items,
          shippingAddress: data.shippingAddress || {},
          totalPrice: total,
          paymentStatus: data.paymentStatus || 'Paid',
          paymentMethod: data.paymentMethod || 'UPI',
          orderStatus: 'Pending'
        });
      }
    } catch (e) {}

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      _id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: data.userId || 'usr-customer-1',
      customerName: data.customerName || data.shippingAddress?.fullName || 'Alex Johnson',
      customerEmail: data.customerEmail || 'alex@example.com',
      orderItems: items,
      items,
      totalPrice: total,
      totalAmount: total,
      shippingAddress: data.shippingAddress || {},
      paymentMethod: data.paymentMethod || 'UPI / NetBanking',
      paymentStatus: data.paymentStatus || 'Paid',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    ordersStore.unshift(newOrder);
    return newOrder;
  }

  static async findByUserId(userId) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseOrderModel) {
        return await MongooseOrderModel.find({ $or: [{ user: userId }, { userId }] }).sort({ createdAt: -1 });
      }
    } catch (e) {}

    return ordersStore.filter(o => o.userId === userId || o.user === userId);
  }

  static async findAll() {
    try {
      if (mongoose.connection.readyState === 1 && MongooseOrderModel) {
        return await MongooseOrderModel.find().sort({ createdAt: -1 });
      }
    } catch (e) {}

    return ordersStore;
  }

  static async updateStatus(id, status) {
    try {
      if (mongoose.connection.readyState === 1 && MongooseOrderModel) {
        return await MongooseOrderModel.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
      }
    } catch (e) {}

    const order = ordersStore.find(o => o.id === id || o._id === id);
    if (order) {
      order.orderStatus = status;
    }
    return order;
  }
}

module.exports = OrderModel;
