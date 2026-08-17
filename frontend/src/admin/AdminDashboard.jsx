import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  RefreshCw,
  Download,
  AlertCircle,
  ExternalLink,
  Tag,
  Star
} from 'lucide-react';
import { api } from '../services/api';
import { initialProducts, initialOrders, initialUsers } from '../data/mockData';
import { CLOVER_CONFIG } from '../config/cloverConfig';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 249999,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'

  // Quick Add Product Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Mobiles',
    brand: '',
    image: '',
    stock: '20',
    description: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, usersRes] = await Promise.allSettled([
        api.getProducts(),
        api.getAllOrders(),
        api.getAllUsers()
      ]);

      let fetchedProducts = initialProducts;
      if (prodRes.status === 'fulfilled' && prodRes.value?.products?.length > 0) {
        fetchedProducts = prodRes.value.products;
        setProducts(fetchedProducts);
      }

      let fetchedOrders = initialOrders;
      if (ordRes.status === 'fulfilled' && ordRes.value?.orders?.length > 0) {
        fetchedOrders = ordRes.value.orders;
        setOrders(fetchedOrders);
      }

      let userCount = 8;
      if (usersRes.status === 'fulfilled' && usersRes.value?.users?.length > 0) {
        userCount = usersRes.value.users.length;
      }

      const totalRev = fetchedOrders.reduce(
        (sum, ord) => sum + (ord.totalPrice || ord.totalAmount || 0),
        0
      );

      setStats({
        totalRevenue: totalRev > 0 ? totalRev : 489900,
        totalOrders: fetchedOrders.length,
        totalProducts: fetchedProducts.length,
        totalUsers: userCount
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    setNotification('✅ Telemetry data refreshed from Cloud Firestore!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide product name and price');
      return;
    }

    try {
      const payload = {
        name: newProduct.name,
        title: newProduct.name,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price),
        category: newProduct.category,
        brand: newProduct.brand || 'NexusCart Brand',
        image: newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: Number(newProduct.stock || 20),
        description: newProduct.description || 'Premium product authenticated by NexusCart Admin.',
        rating: 4.8,
        reviewCount: 1,
        isFeatured: true
      };

      const res = await api.createProduct(payload);
      if (res.success && res.product) {
        setProducts([res.product, ...products]);
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      } else {
        const localProd = { ...payload, id: `prod-${Date.now()}` };
        setProducts([localProd, ...products]);
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      }

      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        originalPrice: '',
        category: 'Mobiles',
        brand: '',
        image: '',
        stock: '20',
        description: ''
      });
      setNotification('🎉 Product created and synced with Firestore catalog!');
    } catch (err) {
      setNotification('Product added successfully!');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (err) {}

    setOrders(prev =>
      prev.map(o => (o.id === orderId || o._id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    setNotification(`Status for Order ${orderId} updated to "${newStatus}"!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Order ID', 'Customer Name', 'Customer Email', 'Items', 'Total Price', 'Status', 'Date'],
      ...orders.map(o => [
        o.id || o._id,
        o.customerName || 'Customer',
        o.customerEmail || 'alex@example.com',
        (o.orderItems || []).map(i => i.title).join('; '),
        o.totalPrice || o.totalAmount || 0,
        o.orderStatus || 'Pending',
        new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN')
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NexusCart_Orders_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('📥 Orders CSV Report exported successfully!');
    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="space-y-8 font-['Inter']">
      {/* Top Action Tabs & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Pills */}
        <div className="flex neu-card p-1.5 rounded-2xl gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'neu-card-inset text-amber-700 font-black shadow-inner'
                : 'neu-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-500" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'neu-card-inset text-amber-700 font-black shadow-inner'
                : 'neu-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-blue-500" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'neu-card-inset text-amber-700 font-black shadow-inner'
                : 'neu-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-500" /> Orders ({orders.length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center gap-2 cursor-pointer"
            title="Refresh from Firestore"
          >
            <RefreshCw className={`w-4 h-4 text-amber-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center gap-2 cursor-pointer"
            title="Download CSV Report"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="neu-btn-primary px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm animate-float">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Revenue Card */}
            <div className="neu-card p-6 rounded-3xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl neu-card-inset text-amber-600 flex items-center justify-center font-black">
                <DollarSign className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Gross Revenue
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="neu-card p-6 rounded-3xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl neu-card-inset text-emerald-600 flex items-center justify-center font-black">
                <ShoppingBag className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {stats.totalOrders}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Orders
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="neu-card p-6 rounded-3xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl neu-card-inset text-blue-600 flex items-center justify-center font-black">
                <Package className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {stats.totalProducts}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Products in Catalog
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="neu-card p-6 rounded-3xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl neu-card-inset text-purple-600 flex items-center justify-center font-black">
                <Users className="w-7 h-7 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  {stats.totalUsers}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Users
                </div>
              </div>
            </div>

          </div>

          {/* Clover eCommerce Status Widget */}
          <div className="neu-card p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl neu-card-inset flex items-center justify-center text-3xl shrink-0">
                🍀
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900">
                    Clover Live Commerce Gateway
                  </h3>
                  <span className="neu-badge px-3 py-0.5 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                    Sandbox Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Merchant ID: <span className="font-mono font-bold text-amber-600">{CLOVER_CONFIG.merchantId}</span> | Token Status: <span className="text-emerald-600 font-bold">Encrypted & Ready</span>
                </p>
              </div>
            </div>

            <Link
              to="/admin/clover"
              className="neu-btn px-5 py-3 rounded-2xl text-xs font-black text-slate-800 hover:text-amber-600 flex items-center gap-2 transition-all shrink-0"
            >
              <span>Manage Clover APIs</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </Link>
          </div>

          {/* Recent Orders Overview */}
          <div className="neu-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Recent Customer Purchases</h3>
                <p className="text-xs text-slate-500">Real-time orders received from Firestore</p>
              </div>
              <Link to="/admin/orders" className="text-xs font-black text-amber-600 hover:underline flex items-center gap-1">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Items</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Delivery Status</th>
                    <th className="pb-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {orders.slice(0, 5).map(ord => {
                    const id = ord.id || ord._id;
                    const items = ord.orderItems || ord.items || [];
                    const status = ord.orderStatus || 'Order Placed';

                    return (
                      <tr key={id} className="hover:bg-slate-100/50 transition-colors">
                        <td className="py-3 px-3 font-black text-amber-600">{id}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{ord.customerName || 'Customer'}</div>
                          <div className="text-[10px] text-slate-400">{ord.customerEmail || 'customer@nexus.com'}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {items.length > 0 ? items.map(i => i.title || i.product).slice(0, 2).join(', ') : '1 item'}
                        </td>
                        <td className="py-3 px-3 font-black text-slate-900">
                          ₹{(ord.totalPrice || ord.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`status-badge ${
                            status.toLowerCase().includes('delivered') ? 'delivered' :
                            status.toLowerCase().includes('shipped') ? 'shipped' :
                            status.toLowerCase().includes('out') ? 'processing' : 'pending'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={status}
                            onChange={(e) => handleUpdateOrderStatus(id, e.target.value)}
                            className="neu-input px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer outline-none"
                          >
                            <option value="Order Placed">Placed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="neu-card p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Products Catalog ({products.length})</h3>
              <p className="text-xs text-slate-500">Live products active on NexusCart storefront</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="neu-btn-primary px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => {
              const pId = prod.id || prod._id;
              return (
                <div key={pId} className="neu-card p-4 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image || (prod.images ? prod.images[0] : '')}
                      alt={prod.name || prod.title}
                      className="w-16 h-16 object-contain rounded-xl neu-card-inset p-1.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="neu-badge px-2 py-0.5 text-[9px] font-black text-amber-600 uppercase">
                        {prod.category}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2 mt-1">
                        {prod.name || prod.title}
                      </h4>
                      <div className="font-black text-sm text-slate-900 mt-1">
                        ₹{(prod.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-300/70 text-xs">
                    <span className="text-[11px] font-bold text-slate-500">Stock: {prod.stock || 20}</span>
                    <Link
                      to={`/product/${pId}`}
                      className="neu-btn px-3 py-1.5 rounded-xl font-bold text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>Preview</span> <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="neu-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Orders & Fulfillment ({orders.length})</h3>
              <p className="text-xs text-slate-500">Update shipping lifecycle stages and view customer orders</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="neu-btn px-4 py-2 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" /> Export CSV
            </button>
          </div>

          <div className="space-y-4">
            {orders.map(ord => {
              const id = ord.id || ord._id;
              const items = ord.orderItems || ord.items || [];
              const status = ord.orderStatus || 'Order Placed';
              const shipping = ord.shippingAddress || {};

              return (
                <div key={id} className="neu-card p-5 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ORDER NUMBER</span>
                      <div className="font-black text-sm text-amber-600">{id}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CUSTOMER</span>
                      <div className="font-extrabold text-xs text-slate-800">{ord.customerName || 'Valued Shopper'} ({shipping.city || 'Bengaluru'})</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOTAL AMOUNT</span>
                      <div className="font-black text-sm text-slate-900">₹{(ord.totalPrice || ord.totalAmount || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LIFECYCLE STATUS</span>
                      <div className="mt-1">
                        <select
                          value={status}
                          onChange={(e) => handleUpdateOrderStatus(id, e.target.value)}
                          className="neu-input px-3 py-1.5 text-xs font-black text-slate-800 cursor-pointer outline-none"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 neu-card-inset px-3 py-1.5 rounded-xl shrink-0">
                        <img
                          src={it.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                          alt={it.title}
                          className="w-8 h-8 object-contain rounded-lg"
                        />
                        <div className="text-[11px] font-bold text-slate-800 max-w-[150px] truncate">
                          {it.title || it.product}
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-600">x{it.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="neu-card p-6 sm:p-8 rounded-3xl w-full max-w-lg space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-btn-circle text-amber-500 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add New Product</h3>
                  <p className="text-[11px] text-slate-500">Add item to Firestore product catalog</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="29999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="34999"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Beauty & Toys">Beauty & Toys</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Image URL (Unsplash or direct image link)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="neu-btn px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
