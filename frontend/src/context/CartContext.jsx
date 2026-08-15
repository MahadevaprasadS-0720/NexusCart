import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? (user.uid || user.id) : 'guest';

  // User-isolated Cart State
  const [cartItems, setCartItems] = useState(() => {
    if (!userId || userId === 'guest') {
      const saved = localStorage.getItem('cart_guest');
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(`cart_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // User-isolated Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    if (!userId || userId === 'guest') {
      const saved = localStorage.getItem('wishlist_guest');
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(`wishlist_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync state whenever authenticated User UID changes (Login / Logout / Switch User)
  useEffect(() => {
    if (user && user.uid) {
      const userCart = localStorage.getItem(`cart_${user.uid}`);
      const userWishlist = localStorage.getItem(`wishlist_${user.uid}`);
      setCartItems(userCart ? JSON.parse(userCart) : []);
      setWishlist(userWishlist ? JSON.parse(userWishlist) : []);
    } else {
      // User logged out: clear state cleanly
      setCartItems([]);
      setWishlist([]);
    }
  }, [user?.uid]);

  // Persist Cart per User UID
  useEffect(() => {
    const key = user && user.uid ? `cart_${user.uid}` : 'cart_guest';
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user?.uid]);

  // Persist Wishlist per User UID
  useEffect(() => {
    const key = user && user.uid ? `wishlist_${user.uid}` : 'wishlist_guest';
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, user?.uid]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const pId = product.id || product._id;
      const existingIndex = prev.findIndex(item => (item.id || item._id) === pId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if ((item.id || item._id) === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => (item.id || item._id) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    if (user && user.uid) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  const toggleWishlist = (product) => {
    const targetId = typeof product === 'object' ? (product.id || product._id) : product;
    setWishlist(prev =>
      prev.includes(targetId)
        ? prev.filter(id => id !== targetId)
        : [...prev, targetId]
    );
  };

  const isInWishlist = (product) => {
    if (!product) return false;
    const targetId = typeof product === 'object' ? (product.id || product._id) : product;
    return wishlist.includes(targetId);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalDiscount = cartItems.reduce(
    (acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartTotal,
        totalDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
