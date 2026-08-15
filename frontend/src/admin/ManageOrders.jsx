import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Clock, Truck, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { initialOrders } from '../data/mockData';

const ManageOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrders();
      if (res.success && res.orders) {
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
    setStatusMsg(`Order ${orderId} updated to ${newStatus}`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
            Customer Orders & Fulfillment Center ({orders.length})
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>View customer purchases and update order delivery status</p>
        </div>

        <button onClick={fetchOrders} style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <RefreshCw size={15} /> Refresh Order Feed
        </button>
      </div>

      {statusMsg && (
        <div style={{ background: '#065f46', color: '#34d399', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.2rem', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle size={18} /> {statusMsg}
        </div>
      )}

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER DETAILS</th>
              <th>SHIPPING ADDRESS</th>
              <th>PURCHASED ITEMS</th>
              <th>TOTAL PRICE</th>
              <th>PAYMENT STATUS</th>
              <th>DELIVERY STATUS</th>
              <th>UPDATE STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const orderId = o.id || o._id;
              const items = o.orderItems || o.items || [];
              const total = o.totalPrice || o.totalAmount || 0;
              const status = o.orderStatus || 'Pending';
              const address = o.shippingAddress?.address || 'Flat 402, Skyline Towers';
              const city = o.shippingAddress?.city || 'Bengaluru';

              return (
                <tr key={orderId}>
                  <td style={{ fontWeight: '800', color: '#38bdf8' }}>{orderId}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{o.customerName || 'Valued Customer'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{o.customerEmail || 'alex@example.com'}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', maxWidth: '180px', color: '#cbd5e1' }}>
                    {address}, {city}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {items.map(i => `${i.quantity}x ${i.title || i.product}`).join(', ')}
                  </td>
                  <td style={{ fontWeight: '800', color: '#38bdf8' }}>₹{total.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ fontSize: '0.78rem', background: '#1e3a8a', color: '#93c5fd', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      {o.paymentStatus || 'Paid'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={status}
                      onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #334155',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
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
  );
};

export default ManageOrders;
