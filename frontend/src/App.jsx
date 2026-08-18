import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import { AddressProvider } from './context/AddressContext';

// Core Stylesheet
import './App.css';

// Shared Neumorphic Components
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
import CloverLivePage from './pages/CloverLivePage';

// Admin Dashboard Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import AdminUsers from './admin/AdminUsers';

// Customer Layout Wrapper (Pure Neumorphic Soft-UI Experience)
const UserStoreLayout = () => {
  return (
    <div className="app-container neu-bg">
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
      <AddressProvider>
        <CartProvider>
          <FilterProvider>
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
          </FilterProvider>
        </CartProvider>
      </AddressProvider>
    </AuthProvider>
  );
}

export default App;
