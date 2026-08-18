import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Core Stylesheet
import './App.css';

// Neumorphic Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Amazon.in Experience Components
import AmazonHeader from './components/amazon/AmazonHeader';
import AmazonSubNav from './components/amazon/AmazonSubNav';
import AmazonFooter from './components/amazon/AmazonFooter';
import AmazonDrawer from './components/amazon/AmazonDrawer';

// Customer Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrders from './pages/MyOrders';
import WishlistPage from './pages/WishlistPage';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CloverLivePage from './pages/CloverLivePage';

// Admin Dashboard Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import AdminUsers from './admin/AdminUsers';

// Customer Dual-Experience Layout Wrapper
// Guest -> Amazon.in Experience | Logged-in -> Neumorphic Soft-UI Experience
const UserStoreLayout = () => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manualMode, setManualMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexus_view_mode') || null;
    }
    return null;
  });

  // Default to Amazon if unauthenticated, or Neumorphic if logged in
  const isAmazonMode = manualMode !== null ? manualMode === 'amazon' : !user;

  const toggleMode = () => {
    const nextMode = isAmazonMode ? 'neumorphic' : 'amazon';
    setManualMode(nextMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_view_mode', nextMode);
    }
  };

  return (
    <div className={`app-container ${isAmazonMode ? 'bg-[#e3e6e6]' : 'neu-bg'}`}>
      {isAmazonMode ? (
        <>
          <AmazonHeader
            onOpenDrawer={() => setDrawerOpen(true)}
            previewMode="amazon"
            onTogglePreviewMode={toggleMode}
          />
          <AmazonSubNav onOpenDrawer={() => setDrawerOpen(true)} />
          <AmazonDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <CartDrawer />
          <main className="main-content">
            <Outlet context={{ isAmazonMode, toggleMode }} />
          </main>
          <AmazonFooter onTogglePreviewMode={toggleMode} />
        </>
      ) : (
        <>
          <Navbar onTogglePreviewMode={toggleMode} />
          <CartDrawer />
          <main className="main-content">
            <Outlet context={{ isAmazonMode, toggleMode }} />
          </main>
          <Footer onTogglePreviewMode={toggleMode} />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Customer Storefront Routes */}
            <Route path="/" element={<UserStoreLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="product-details/:id" element={<ProductDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="register" element={<Signup />} />
              <Route path="wishlist" element={<WishlistPage />} />

              {/* Shopping Cart & Customer Profile */}
              <Route path="cart" element={<Cart />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="order-success/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Admin Routes (Clover APIs & Diagnostics are strictly Private to Admin) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="manage-products" element={<ManageProducts />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="manage-orders" element={<ManageOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="clover" element={<CloverLivePage />} />
              <Route path="clover-live" element={<CloverLivePage />} />
              <Route path="live-products" element={<CloverLivePage />} />
            </Route>

            {/* Direct Admin Clover Route Access */}
            <Route
              path="/clover"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CloverLivePage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<UserStoreLayout />}>
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
