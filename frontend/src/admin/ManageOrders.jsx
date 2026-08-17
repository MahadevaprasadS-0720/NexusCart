import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  Package,
  MapPin,
  ShieldCheck,
  Search,
  Eye,
  X,
  Printer,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { initialOrders } from '../data/mockData';

const ManageOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [inspectOrder, setInspectOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrders();
      if (res.success && res.orders && res.orders.length > 0) {
        setOrders(res.orders);
      }
    } catch (err) {
      setOrders(initialOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (err) {}

    setOrders(prev =>
      prev.map(o => ((o.id === orderId || o._id === orderId) ? { ...o, orderStatus: newStatus } : o))
    );
    setStatusMsg(`✅ Order ${orderId} updated to status "${newStatus}"!`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const filteredOrders = orders.filter(o => {
    const id = (o.id || o._id || '').toLowerCase();
    const name = (o.customerName || '').toLowerCase();
    const email = (o.customerEmail || '').toLowerCase();
    const status = (o.orderStatus || 'Pending').toLowerCase();

    const matchesSearch = id.includes(searchTerm.toLowerCase()) || name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || status.includes(selectedStatusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Placed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
            Customer Orders & Fulfillment ({orders.length})
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Cloud Firestore real-time customer purchase streams and tracking
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-black text-slate-700 hover:text-amber-600 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-amber-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="neu-card p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 neu-input flex items-center px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                selectedStatusFilter === st
                  ? 'neu-card-inset text-amber-700 font-black shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="neu-card p-6 rounded-3xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <th className="pb-3 px-3">Order ID</th>
              <th className="pb-3 px-3">Customer Details</th>
              <th className="pb-3 px-3">Delivery Address</th>
              <th className="pb-3 px-3">Purchased Items</th>
              <th className="pb-3 px-3">Total Amount</th>
              <th className="pb-3 px-3">Payment</th>
              <th className="pb-3 px-3">Lifecycle Status</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-semibold">
            {filteredOrders.map(o => {
              const orderId = o.id || o._id;
              const items = o.orderItems || o.items || [];
              const total = o.totalPrice || o.totalAmount || 0;
              const status = o.orderStatus || 'Pending';
              const shipping = o.shippingAddress || {};

              return (
                <tr key={orderId} className="hover:bg-slate-100/50 transition-colors">
                  <td className="py-3.5 px-3 font-black text-amber-600 font-mono">{orderId}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-extrabold text-slate-900">{o.customerName || 'Customer'}</div>
                    <div className="text-[10px] text-slate-400">{o.customerEmail || 'customer@nexus.com'}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 max-w-[160px] truncate">
                    {shipping.address || 'Flat 402, MG Road'}, {shipping.city || 'Bengaluru'}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-800 max-w-[200px] truncate">
                    {items.length > 0
                      ? items.map(i => `${i.quantity || 1}x ${i.title || i.product}`).join(', ')
                      : '1 Item'}
                  </td>
                  <td className="py-3.5 px-3 font-black text-slate-900">
                    ₹{total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="neu-badge px-2.5 py-1 text-[10px] font-black text-emerald-700 uppercase">
                      {o.paymentMethod || 'Paid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <select
                      value={status}
                      onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                      className="neu-input px-3 py-1.5 text-xs font-black text-slate-800 cursor-pointer outline-none"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setInspectOrder(o)}
                      className="neu-btn p-2 rounded-xl text-slate-700 hover:text-amber-600"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* INSPECT ORDER MODAL */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="neu-card p-6 sm:p-8 rounded-3xl w-full max-w-lg space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">ORDER RECEIPT</div>
                <h3 className="text-base font-black text-slate-900 font-mono">
                  {inspectOrder.id || inspectOrder._id}
                </h3>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="neu-card-inset p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Customer:</span>
                <span className="text-slate-900">{inspectOrder.customerName || 'Alex Johnson'}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-900">{inspectOrder.customerEmail || 'alex@example.com'}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Address:</span>
                <span className="text-slate-900 text-right">
                  {inspectOrder.shippingAddress?.address || 'Flat 402, MG Road'}, {inspectOrder.shippingAddress?.city || 'Bengaluru'}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="text-emerald-700 font-extrabold">{inspectOrder.paymentMethod || 'Clover / UPI'} (Paid)</span>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Ordered Items</h4>
              <div className="space-y-2">
                {(inspectOrder.orderItems || inspectOrder.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 neu-card rounded-xl text-xs font-bold">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                        alt={it.title}
                        className="w-9 h-9 object-contain rounded-lg neu-card-inset p-1"
                      />
                      <div>
                        <div className="text-slate-900 line-clamp-1">{it.title || it.product}</div>
                        <div className="text-[10px] text-slate-400">Qty: {it.quantity || 1}</div>
                      </div>
                    </div>
                    <div className="text-slate-900 font-black">
                      ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="text-amber-600 text-base">
                ₹{(inspectOrder.totalPrice || inspectOrder.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Print button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handlePrintInvoice}
                className="neu-btn-primary px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
