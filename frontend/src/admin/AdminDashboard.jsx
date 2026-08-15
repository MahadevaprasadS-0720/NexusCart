import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalRevenue: 524780,
      totalOrders: 42,
      totalProducts: 8,
      totalCustomers: 15,
      pendingOrders: 3,
      lowStockAlerts: 2
    },
    recentOrders: [
      { id: 'ORD-98421', customerName: 'Alex Johnson', totalAmount: 26990, orderStatus: 'Processing', createdAt: new Date().toISOString() },
      { id: 'ORD-98420', customerName: 'Sarah Smith', totalAmount: 16995, orderStatus: 'Delivered', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    salesChartData: [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 62000 },
      { month: 'Mar', revenue: 78000 },
      { month: 'Apr', revenue: 94000 },
      { month: 'May', revenue: 112000 },
      { month: 'Jun', revenue: 145000 }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardAnalytics();
      if (res.success && res.stats) {
        setData(res);
      }
    } catch (err) {
      console.log('Using simulated analytics data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Metrics Summary Overview Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#0284c7', color: '#fff' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">₹{data.stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="stat-lbl">Total Gross Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#16a34a', color: '#fff' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="stat-val">{data.stats.totalOrders}</div>
            <div className="stat-lbl">Total Orders Placed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#9333ea', color: '#fff' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="stat-val">{data.stats.totalProducts}</div>
            <div className="stat-lbl">Total Store Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#059669', color: '#fff' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{data.stats.totalCustomers || data.stats.totalUsers || 15}</div>
            <div className="stat-lbl">Total Users & Accounts</div>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Visual Graph Representation */}
      <div className="admin-table-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#38bdf8" /> Monthly NexusCart Growth Trend
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: '700', display: 'flex', alignItems: 'center' }}>
            +28.4% growth <ArrowUpRight size={16} />
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '180px', paddingTop: '1rem', borderBottom: '1px solid #334155' }}>
          {data.salesChartData.map((bar) => {
            const heightPercent = Math.min(100, (bar.revenue / 150000) * 100);
            return (
              <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                  ₹{(bar.revenue / 1000).toFixed(0)}k
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '45px',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1' }}>{bar.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="admin-table-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '1rem' }}>
          Recent NexusCart Marketplace Orders
        </h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((order) => (
              <tr key={order.id || order._id}>
                <td style={{ fontWeight: '700', color: '#38bdf8' }}>{order.id || order._id}</td>
                <td>{order.customerName}</td>
                <td style={{ fontWeight: '700' }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ color: '#94a3b8' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
