import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { isTabSessionAuthenticated, purgeTabSession } from './services/firebaseAuth';

// Core Stylesheet
import './App.css';

// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

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

// Admin Dashboard Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import AdminUsers from './admin/AdminUsers';

// Tab Lifecycle Guard Component (Enforces One-Tab, One-Login on Tab Init)
const TabLifecycleGuard = ({ children }) => {
  const { logout } = useAuth();

  useEffect(() => {
    // Listener for browser tab lifecycle events on application initialization
    const handleTabInitAndLifecycle = async () => {
      // Check if this tab session was explicitly authenticated
      if (!isTabSessionAuthenticated()) {
        // Force logout & clear any stale session tokens inherited from other tabs
        await purgeTabSession();
        if (logout) {
          logout();
        }
      }
    };

    handleTabInitAndLifecycle();

    // Event listener for tab navigation and visibility restores
    window.addEventListener('pageshow', handleTabInitAndLifecycle);
    return () => {
      window.removeEventListener('pageshow', handleTabInitAndLifecycle);
    };
  }, [logout]);

  return children;
};

// Customer Layout Wrapper
const UserStoreLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <CartDrawer />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TabLifecycleGuard>
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

                {/* Protected User Profile & Shopping Cart & Orders */}
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

              {/* Protected Admin Routes */}
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
              </Route>

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<UserStoreLayout />}>
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </TabLifecycleGuard>
    </AuthProvider>
  );
}

export default App;

