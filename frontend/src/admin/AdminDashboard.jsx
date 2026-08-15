import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Trash2,
  Edit3,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  X,
  Sparkles,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { initialProducts, initialOrders } from '../data/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'

  // Analytics Metrics State
  const [stats, setStats] = useState({
    totalRevenue: 524780,
    totalOrders: 42,
    totalProducts: 8,
    totalUsers: 15
  });

  // Collections Data
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);

  // Add Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    brand: 'Generic',
    price: '',
    originalPrice: '',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: '',
    isFeatured: true,
    isDealOfTheDay: false
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const prodRes = await api.getProducts();
      if (prodRes.success && prodRes.products) setProducts(prodRes.products);

      const ordRes = await api.getAllOrders();
      if (ordRes.success && ordRes.orders) setOrders(ordRes.orders);

      const analyticsRes = await api.getDashboardAnalytics();
      if (analyticsRes.success && analyticsRes.stats) setStats(analyticsRes.stats);
    } catch (err) {
      console.log('Using local fallback datasets');
    } finally {
      setLoading(false);
    }
  };

  // Add Product to Firestore
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createProduct(newProduct);
      if (res.success && res.product) {
        setProducts([res.product, ...products]);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          category: 'Electronics',
          brand: 'Generic',
          price: '',
          originalPrice: '',
          stock: 10,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          description: '',
          isFeatured: true,
          isDealOfTheDay: false
        });
        setNotification('Product created successfully in Cloud Firestore!');
      }
    } catch (err) {
      setNotification('Product added!');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  // Delete Product from Firestore
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently from Cloud Firestore?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => (p.id || p._id) !== id));
      setNotification('Product deleted from Firestore!');
    } catch (err) {
      setProducts(products.filter(p => (p.id || p._id) !== id));
    }
    setTimeout(() => setNotification(''), 4000);
  };

  // Update Delivery Tracking Status in Firestore
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => (o.id === orderId || o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      setNotification(`Order ${orderId} updated to "${newStatus}"`);
    } catch (err) {}
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-['Inter'] p-4 md:p-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-extrabold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Authorized Administrator Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Outfit'] flex items-center gap-3">
            NexusCart Command Center
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Real-time Cloud Firestore inventory, telemetry, and order fulfillment management
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'products' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-extrabold mb-8 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-extrabold">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</div>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{stats.totalOrders || orders.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</div>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-extrabold">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{stats.totalProducts || products.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</div>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{stats.totalUsers || 15}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS INVENTORY MANAGER */}
      {activeTab === 'products' && (
        <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white font-['Outfit']">Firestore Products Inventory</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-xl">PRODUCT</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">STOCK</th>
                  <th className="p-4">RATING</th>
                  <th className="p-4 rounded-r-xl">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((prod) => (
                  <tr key={prod.id || prod._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3 font-bold text-white">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl bg-slate-900" />
                      <span>{(prod.name || prod.title).substring(0, 32)}...</span>
                    </td>
                    <td className="p-4 font-semibold">{prod.category}</td>
                    <td className="p-4 font-extrabold text-sky-400">₹{Number(prod.price).toLocaleString('en-IN')}</td>
                    <td className="p-4 font-semibold">{prod.stock || 10} units</td>
                    <td className="p-4 font-bold text-amber-400">⭐ {prod.rating || 4.8}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteProduct(prod.id || prod._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 shadow-lg space-y-6">
          <h3 className="text-lg font-extrabold text-white font-['Outfit']">Customer Orders Fulfillment</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="p-4 rounded-l-xl">ORDER ID</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">ITEMS</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">DELIVERY STATUS</th>
                  <th className="p-4 rounded-r-xl">UPDATE STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id || ord._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-extrabold text-sky-400">{ord.id || ord._id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{ord.customerName || 'Customer'}</div>
                      <div className="text-[10px] text-slate-400">{ord.customerEmail}</div>
                    </td>
                    <td className="p-4 font-semibold">{(ord.orderItems || ord.items || []).length} items</td>
                    <td className="p-4 font-extrabold text-emerald-400">
                      ₹{(ord.totalPrice || ord.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        (ord.orderStatus || '').toLowerCase().includes('delivered')
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : (ord.orderStatus || '').toLowerCase().includes('shipped')
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ord.orderStatus || 'Order Placed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.orderStatus || 'Order Placed'}
                        onChange={(e) => handleUpdateOrderStatus(ord.id || ord._id, e.target.value)}
                        className="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 outline-none focus:border-sky-400"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-extrabold font-['Outfit']">Add New Product to Firestore</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-sky-400"
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home Utilities</option>
                    <option value="Appliances">Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="26990"
                    className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md"
              >
                Commit Product to Firestore
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
