import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft, ShieldCheck, Key, Sparkles, LogOut, ExternalLink, Bell, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, toggleAdminMode, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout min-h-screen bg-[#eef2f7] text-slate-800 font-['Inter'] flex flex-col md:flex-row">
      {/* Sidebar Navigation - Neumorphic Soft-UI */}
      <aside className="w-full md:w-72 bg-[#eef2f7] p-6 flex flex-col shadow-[6px_0_24px_rgba(209,217,230,0.6)] border-r border-white/80 z-20 shrink-0">
        
        {/* Brand Header */}
        <div className="p-4 mb-8 neu-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-slate-800 font-['Outfit'] flex items-center gap-1">
              NexusCart <span className="text-amber-600 font-black">Portal</span>
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Admin Command
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 flex-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${
                isActive
                  ? 'neu-tab-active text-amber-700 font-extrabold shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${
                isActive
                  ? 'neu-tab-active text-amber-700 font-extrabold shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`
            }
          >
            <Package className="w-4 h-4 text-blue-500" />
            <span>Products Catalog</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${
                isActive
                  ? 'neu-tab-active text-amber-700 font-extrabold shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`
            }
          >
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span>Orders & Delivery</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${
                isActive
                  ? 'neu-tab-active text-amber-700 font-extrabold shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`
            }
          >
            <Users className="w-4 h-4 text-purple-500" />
            <span>User Accounts</span>
          </NavLink>

          <NavLink
            to="/admin/clover"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${
                isActive
                  ? 'neu-tab-active text-amber-700 font-extrabold shadow-inner'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`
            }
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>Clover & Live APIs</span>
          </NavLink>
        </nav>

        {/* Exit & Switch Actions */}
        <div className="pt-6 mt-6 border-t border-slate-300/60 flex flex-col gap-3">
          <button
            onClick={() => {
              if (toggleAdminMode) toggleAdminMode();
              navigate('/');
            }}
            className="w-full neu-btn py-3 px-4 text-slate-700 font-black text-xs flex items-center justify-center gap-2 hover:text-amber-600 transition-all cursor-pointer rounded-2xl"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" /> Back to Storefront
          </button>

          <button
            onClick={logout}
            className="w-full neu-card-inset py-2.5 px-4 text-red-500 font-extrabold text-[11px] flex items-center justify-center gap-2 hover:text-red-600 transition-all cursor-pointer rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 bg-[#eef2f7] p-6 md:p-10 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-300/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 neu-badge text-amber-600 text-[10px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Enterprise Admin Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 font-['Outfit']">
              NexusCart Operations
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Live Cloud Firestore telemetry, inventory management, and order fulfillment
            </p>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-extrabold text-slate-700 hover:text-amber-600 flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Visit Store</span>
            </Link>

            <div className="neu-card px-4 py-2 flex items-center gap-3 rounded-2xl">
              <div className="w-9 h-9 rounded-xl neu-btn-circle bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-800">{user?.name || 'Super Admin'}</div>
                <div className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Authenticated
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Outlet for Sub-pages */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
