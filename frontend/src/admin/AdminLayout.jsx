import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft, ShieldCheck, TrendingUp, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, toggleAdminMode } = useAuth();

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <ShieldCheck size={26} color="#38bdf8" />
          <div>
            NexusCart <span style={{ color: '#febd69', fontSize: '0.8rem' }}>Admin Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={20} /> Products Catalog
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} /> Orders & Shipping
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Customer Accounts
          </NavLink>
          <NavLink to="/admin/clover" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Key size={20} /> Clover & Live APIs
          </NavLink>
        </nav>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: 'auto' }}>
          <button
            onClick={toggleAdminMode}
            style={{
              width: '100%',
              background: '#334155',
              color: '#f8fafc',
              border: 'none',
              padding: '0.6rem',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Exit to NexusCart Store
          </button>
        </div>
      </aside>

      {/* Main Admin View Container */}
      <main className="admin-main">
        <div className="admin-top-bar">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>NexusCart Operations Center</h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Live marketplace telemetry and management suite</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f8fafc' }}>{user ? user.name : 'Admin Manager'}</div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>Super Admin</div>
            </div>
            <div style={{ width: '40px', height: '40px', background: '#0284c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
              A
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
