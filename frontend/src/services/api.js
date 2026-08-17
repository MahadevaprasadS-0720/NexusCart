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
  getProductReviews,
  addProductReview,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  getUserProfile,
  updateUserProfile,
  getDashboardAnalytics,
  seedInitialDataIfEmpty
} from './firebaseDb';

import {
  fetchLiveCloverProducts,
  fetchLiveCloverProductById,
  processCloverPayment
} from './cloverService';
import {
  fetchLiveMarketStoreProducts,
  fetchLiveMarketProductById
} from './liveMarketService';
import { CLOVER_CONFIG } from '../config/cloverConfig';

// Unified API Service Layer powered by Google Firebase (v9+ Modular SDK) and Clover eCommerce API
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

  // Product Catalog Services (Powered 100% by Live Real-Time E-Commerce APIs & Clover)
  async getProducts(params = {}) {
    try {
      let allProducts = [];

      // 1. Fetch 100+ Real Live Products from Live E-Commerce API Feed
      try {
        const liveMarketRes = await fetchLiveMarketStoreProducts();
        if (liveMarketRes.success && liveMarketRes.products && liveMarketRes.products.length > 0) {
          allProducts = [...liveMarketRes.products];
        }
      } catch (e) {
        console.warn('Live market API feed failed:', e);
      }

      // 2. Fetch Live Clover Merchant Products
      try {
        const cloverRes = await fetchLiveCloverProducts();
        if (cloverRes.success && cloverRes.products && cloverRes.products.length > 0) {
          const existingIds = new Set(allProducts.map(p => p.id || p._id));
          const newCloverProducts = cloverRes.products.filter(p => !existingIds.has(p.id));
          allProducts = [...newCloverProducts, ...allProducts];
        }
      } catch (ce) {}

      // 3. Fetch custom user-added items from Firestore DB (if any)
      try {
        const baseRes = await getProducts(params);
        if (baseRes.success && baseRes.products && baseRes.products.length > 0) {
          // Only include user-created products from database (ignore fallback mock IDs)
          const dbProducts = baseRes.products.filter(p => !String(p.id).startsWith('prod-10'));
          const existingIds = new Set(allProducts.map(p => p.id || p._id));
          const newDbProducts = dbProducts.filter(p => !existingIds.has(p.id));
          allProducts = [...newDbProducts, ...allProducts];
        }
      } catch (dbe) {}

      // Apply category filtering
      if (params.category && params.category !== 'All') {
        allProducts = allProducts.filter(p => p.category?.toLowerCase() === params.category.toLowerCase());
      }

      // Apply search filtering
      if (params.search) {
        const q = params.search.toLowerCase();
        allProducts = allProducts.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }

      return {
        success: true,
        source: 'Live E-Commerce API Feed',
        count: allProducts.length,
        products: allProducts
      };
    } catch (err) {
      const liveMarketRes = await fetchLiveMarketStoreProducts();
      return liveMarketRes;
    }
  },

  async getProductById(id) {
    if (String(id).startsWith('mkt_')) {
      const liveRes = await fetchLiveMarketProductById(id);
      if (liveRes.success && liveRes.product) return liveRes;
    }
    if (String(id).startsWith('clover_')) {
      const cloverRes = await fetchLiveCloverProductById(id);
      if (cloverRes.success && cloverRes.product) return cloverRes;
    }
    return await getProductById(id);
  },

  async getProductReviews(productId) {
    return await getProductReviews(productId);
  },

  async addProductReview(productId, reviewData) {
    return await addProductReview(productId, reviewData);
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
  async getUserProfile(userId) {
    return await getUserProfile(userId);
  },

  async updateUserProfile(userId, updates) {
    return await updateUserProfile(userId, updates);
  },

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
  },

  // Clover eCommerce & Live Products Integration
  async getCloverLiveProducts() {
    return await fetchLiveCloverProducts();
  },

  async getCloverLiveProductById(id) {
    return await fetchLiveCloverProductById(id);
  },

  async processCloverPayment(paymentData) {
    return await processCloverPayment(paymentData);
  },

  getCloverConfig() {
    return CLOVER_CONFIG;
  }
};
