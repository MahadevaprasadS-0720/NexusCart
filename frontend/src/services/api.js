import {
  signUpUser,
  signInUser,
  signInAdmin,
  signOutUser
} from './firebaseAuth';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  getDashboardAnalytics,
  seedInitialDataIfEmpty
} from './firebaseDb';

// Unified API Service Layer powered by Google Firebase (v9+ Modular SDK)
export const api = {
  // Authentication Services
  async signup(userData) {
    return await signUpUser(
      userData.name,
      userData.email,
      userData.password,
      userData.role
    );
  },

  async login(credentials) {
    return await signInUser(credentials.email, credentials.password);
  },

  async adminLogin(credentials) {
    return await signInAdmin(credentials.email, credentials.password);
  },

  async register(userData) {
    return await this.signup(userData);
  },

  async logout() {
    return await signOutUser();
  },

  async getCurrentUser() {
    return { success: true };
  },

  // Product Catalog Services
  async getProducts(params = {}) {
    return await getProducts(params);
  },

  async getProductById(id) {
    return await getProductById(id);
  },

  async getCategories() {
    return await getCategories();
  },

  async createProduct(productData) {
    return await createProduct(productData);
  },

  async updateProduct(id, updates) {
    return await updateProduct(id, updates);
  },

  async deleteProduct(id) {
    return await deleteProduct(id);
  },

  // Order & Checkout Services
  async createOrder(orderData) {
    return await createOrder(orderData);
  },

  async getMyOrders() {
    return await getUserOrders();
  },

  async getUserOrders(userId) {
    return await getUserOrders(userId);
  },

  async getAllOrders() {
    return await getAllOrders();
  },

  async updateOrderStatus(id, status) {
    return await updateOrderStatus(id, status);
  },

  // Payment Gateway Simulation
  async createPaymentIntent(amount, receipt) {
    return {
      success: true,
      paymentGateway: 'Firebase / Razorpay Payment Intent',
      orderId: `pay_ord_${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      clientSecret: `pi_firebase_${Date.now()}`
    };
  },

  async verifyPayment(paymentDetails) {
    return {
      success: true,
      message: 'Payment authorized and verified with Firebase Backend',
      transaction: {
        paymentId: `pay_${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Paid',
        timestamp: new Date().toISOString()
      }
    };
  },

  // Users & Admin Operations
  async getAllUsers() {
    return await getAllUsers();
  },

  async updateUserRole(id, role) {
    return await updateUserRole(id, role);
  },

  async getDashboardAnalytics() {
    return await getDashboardAnalytics();
  },

  async seedData() {
    return await seedInitialDataIfEmpty();
  }
};
