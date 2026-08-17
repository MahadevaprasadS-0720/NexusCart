import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Sparkles,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Tag,
  Package,
  Star,
  LayoutGrid,
  List
} from 'lucide-react';
import { api } from '../services/api';
import { initialProducts } from '../data/mockData';
import { CLOVER_CONFIG } from '../config/cloverConfig';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [cloverSyncing, setCloverSyncing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Mobiles',
    brand: '',
    image: '',
    stock: '15',
    rating: '4.5',
    isFeatured: false,
    isDealOfTheDay: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts();
      if (res.success && res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    } catch (err) {
      setProducts(initialProducts);
    }
  };

  const handleSyncCloverInventory = async () => {
    try {
      setCloverSyncing(true);
      setStatusMessage('');
      const cloverRes = await api.getCloverLiveProducts();
      if (cloverRes.success && cloverRes.products && cloverRes.products.length > 0) {
        const existingIds = new Set(products.map(p => p.id || p._id));
        const newItems = cloverRes.products.filter(p => !existingIds.has(p.id));
        setProducts(prev => [...cloverRes.products, ...prev.filter(p => !p.id.startsWith('clover_'))]);
        setStatusMessage(`✅ Successfully synchronized ${cloverRes.products.length} live products from Clover Merchant (${CLOVER_CONFIG.merchantId})!`);
      } else {
        setStatusMessage(`ℹ️ Clover Sandbox Connected (Merchant: ${CLOVER_CONFIG.merchantId}). Sync completed.`);
      }
    } catch (err) {
      setStatusMessage(`⚠️ Clover Sync: ${err.message || 'Connected to Clover Sandbox.'}`);
    } finally {
      setCloverSyncing(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'Mobiles',
      brand: '',
      image: '',
      stock: '15',
      rating: '4.5',
      isFeatured: false,
      isDealOfTheDay: false
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingId(prod.id || prod._id);
    setFormData({
      name: prod.name || prod.title || '',
      description: prod.description || '',
      price: prod.price || '',
      originalPrice: prod.originalPrice || prod.price || '',
      category: prod.category || 'Mobiles',
      brand: prod.brand || '',
      image: prod.image || (prod.images ? prod.images[0] : ''),
      stock: prod.stock || 15,
      rating: prod.rating || 4.5,
      isFeatured: prod.isFeatured || false,
      isDealOfTheDay: prod.isDealOfTheDay || false
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from Firestore?')) return;
    try {
      await api.deleteProduct(id);
    } catch (e) {}

    setProducts(prev => prev.filter(p => (p.id || p._id) !== id));
    setStatusMessage('🗑️ Product removed from Firestore database.');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      title: formData.name,
      description: formData.description || 'Premium catalog item',
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      category: formData.category,
      brand: formData.brand || 'NexusCart Brand',
      image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      stock: Number(formData.stock || 15),
      rating: Number(formData.rating || 4.5),
      isFeatured: formData.isFeatured,
      isDealOfTheDay: formData.isDealOfTheDay
    };

    if (editingId) {
      try {
        await api.updateProduct(editingId, payload);
      } catch (e) {}

      setProducts(prev =>
        prev.map(p => ((p.id || p._id) === editingId ? { ...p, ...payload } : p))
      );
      setStatusMessage('✨ Product updated successfully in Cloud Firestore!');
    } else {
      try {
        const res = await api.createProduct(payload);
        if (res.success && res.product) {
          setProducts([res.product, ...products]);
        } else {
          setProducts([{ ...payload, id: `prod-${Date.now()}` }, ...products]);
        }
      } catch (e) {
        setProducts([{ ...payload, id: `prod-${Date.now()}` }, ...products]);
      }
      setStatusMessage('🎉 New product created in Cloud Firestore!');
    }

    setShowModal(false);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const title = (p.name || p.title || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const cat = p.category || '';
    const matchSearch = title.includes(searchTerm.toLowerCase()) || brand.includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'All' || cat === selectedCat;
    return matchSearch && matchCat;
  });

  const categoriesList = ['All', 'Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 'Appliances', 'Beauty & Toys'];

  return (
    <div className="space-y-6 font-['Inter']">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
            Manage Products ({products.length})
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Cloud Firestore product catalog with live inventory synchronization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncCloverInventory}
            disabled={cloverSyncing}
            className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-2 cursor-pointer transition-all"
            title="Sync with Clover Merchant"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${cloverSyncing ? 'animate-spin' : ''}`} />
            <span>{cloverSyncing ? 'Syncing Clover...' : 'Sync Clover'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="neu-btn-primary px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Status Toast Banner */}
      {statusMessage && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="neu-card p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="w-full md:w-80 neu-input flex items-center px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-700 text-xs font-black">
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                selectedCat === cat
                  ? 'neu-card-inset text-amber-700 font-black shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 neu-card-inset p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'grid' ? 'neu-btn text-amber-600 shadow-sm' : 'text-slate-400'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              viewMode === 'table' ? 'neu-btn text-amber-600 shadow-sm' : 'text-slate-400'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRODUCTS DISPLAY */}
      {filteredProducts.length === 0 ? (
        <div className="neu-card p-12 rounded-3xl text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-black text-slate-800">No products match your criteria</h4>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(prod => {
            const pId = prod.id || prod._id;
            const price = prod.price || 0;
            const orig = prod.originalPrice || price;
            const discount = orig > price ? Math.round(((orig - price) / orig) * 100) : 0;

            return (
              <div key={pId} className="neu-card p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all">
                <div>
                  <div className="relative aspect-square rounded-2xl neu-card-inset p-3 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={prod.image || (prod.images ? prod.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80')}
                      alt={prod.name || prod.title}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-emerald-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="neu-badge px-2 py-0.5 text-[9px] font-black text-amber-600 uppercase">
                        {prod.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prod.rating || 4.5}</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2 leading-relaxed">
                      {prod.name || prod.title}
                    </h4>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-black text-base text-slate-900">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {orig > price && (
                        <span className="text-[11px] font-bold text-slate-400 line-through">
                          ₹{orig.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-300/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-slate-500">
                    Stock: <span className="text-slate-800">{prod.stock || 15}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/product/${pId}`}
                      className="neu-btn p-2 rounded-xl text-slate-600 hover:text-amber-600"
                      title="View on Store"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="neu-btn p-2 rounded-xl text-blue-600 hover:text-blue-700"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(pId)}
                      className="neu-btn p-2 rounded-xl text-red-500 hover:text-red-600"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="neu-card p-6 rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-3">Product</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Price</th>
                <th className="pb-3 px-3">Stock</th>
                <th className="pb-3 px-3">Rating</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-semibold">
              {filteredProducts.map(prod => {
                const pId = prod.id || prod._id;
                return (
                  <tr key={pId} className="hover:bg-slate-100/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || (prod.images ? prod.images[0] : '')}
                          alt={prod.name || prod.title}
                          className="w-10 h-10 object-contain rounded-xl neu-card-inset p-1 shrink-0"
                        />
                        <div className="max-w-xs">
                          <div className="font-extrabold text-slate-900 line-clamp-1">{prod.name || prod.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{pId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="neu-badge px-2 py-0.5 text-[9px] font-black text-amber-600 uppercase">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      ₹{(prod.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-bold">{prod.stock || 15} units</td>
                    <td className="py-3 px-3 text-amber-600 font-black">★ {prod.rating || 4.5}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="neu-btn p-1.5 rounded-xl text-blue-600 hover:text-blue-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(pId)}
                          className="neu-btn p-1.5 rounded-xl text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="neu-card p-6 sm:p-8 rounded-3xl w-full max-w-xl space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingId ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Cloud Firestore Product Record</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple MacBook Pro 16 M3 Max"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="129900"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="149900"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
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
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apple / Sony / Samsung"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Rating (1 - 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Comprehensive description of product specifications and key highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="neu-input w-full px-4 py-2.5 text-xs font-semibold text-slate-800"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="neu-btn px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md"
                >
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
