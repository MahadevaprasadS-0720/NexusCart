const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');
const UserModel = require('../models/User');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const products = await ProductModel.findAll();
    const orders = await OrderModel.findAll();
    const users = await UserModel.findAll();

    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const lowStockProducts = products.filter(p => p.stock < 10);
    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;

    // Monthly revenue simulation data for admin dashboard chart
    const salesChartData = [
      { month: 'Jan', revenue: 45000, orders: 32 },
      { month: 'Feb', revenue: 62000, orders: 48 },
      { month: 'Mar', revenue: 78000, orders: 55 },
      { month: 'Apr', revenue: 94000, orders: 68 },
      { month: 'May', revenue: 112000, orders: 84 },
      { month: 'Jun', revenue: 145000, orders: 110 }
    ];

    const categoryBreakdown = [
      { name: 'Mobiles', sales: 42 },
      { name: 'Electronics', sales: 28 },
      { name: 'Fashion', sales: 18 },
      { name: 'Appliances', sales: 12 }
    ];

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.length,
        pendingOrders: pendingOrdersCount,
        lowStockAlerts: lowStockProducts.length
      },
      recentOrders: orders.slice(0, 5),
      lowStockProducts,
      salesChartData,
      categoryBreakdown
    });
  } catch (error) {
    next(error);
  }
};
