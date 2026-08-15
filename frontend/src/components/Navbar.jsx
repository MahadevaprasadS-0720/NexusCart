import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, User, Heart, ShoppingCart, ShieldCheck, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ categories = [], onSearch }) => {
  const { user, role, isAdminMode, toggleAdminMode, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const isAdmin = role === 'admin' || isAdminMode || (user && user.role === 'admin');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, selectedCategory);
    }
    navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  return (
    <header className="top-header-wrapper">
      {/* Top Navbar */}
      <div className="top-header">
        <Link to="/" className="brand-logo">
          <ShoppingBag size={26} color="#febd69" />
          <div>
            NexusCart <span className="highlight">Prime</span>
            <div className="brand-badge">NexusCart Official</div>
          </div>
        </Link>

        <div className="deliver-location">
          <MapPin size={18} color="#febd69" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Deliver to {user ? user.name.split(' ')[0] : 'Guest'}</div>
            <div style={{ fontWeight: '700' }}>Bengaluru 560001</div>
          </div>
        </div>

        <form className="search-box" onSubmit={handleSearchSubmit}>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search NexusCart deals, electronics, fashion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn" title="Search NexusCart">
            <Search size={20} />
          </button>
        </form>

        <div className="header-actions">
          {/* Navigation Links */}
          <Link to="/" className="header-action-btn" title="Home">
            Home
          </Link>

          <Link to="/orders" className="header-action-btn" title="My Orders">
            <Package size={20} />
            <span>My Orders</span>
          </Link>

          <Link to="/wishlist" className="header-action-btn" title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="header-action-btn" title="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            <span style={{ fontWeight: '700' }}>Cart</span>
          </Link>

          {/* Admin Dashboard Link (Only visible to Admin role) */}
          {isAdmin && (
            <Link to="/admin" className="admin-switch-btn" title="Access Admin Dashboard">
              <ShieldCheck size={16} /> Admin Dashboard
            </Link>
          )}

          {user ? (
            <div className="header-action-btn" style={{ gap: '0.4rem' }}>
              <User size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.name.split(' ')[0]}</span>
              <button onClick={logout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="header-action-btn">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="category-subnav">
        <Link to="/">⚡ Today's NexusCart Deals</Link>
        <Link to="/?category=Mobiles">Mobiles</Link>
        <Link to="/?category=Electronics">Electronics</Link>
        <Link to="/?category=Fashion">Fashion & Apparel</Link>
        <Link to="/?category=Home%20%26%20Kitchen">Home & Kitchen</Link>
        <Link to="/?category=Appliances">TV & Appliances</Link>
        {isAdmin && (
          <Link to="/admin/manage-products" style={{ marginLeft: 'auto', color: '#38bdf8', fontWeight: '700' }}>
            🛠️ Manage Products & Inventory
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
