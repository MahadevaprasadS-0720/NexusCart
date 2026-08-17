import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { isCartDrawerOpen, setIsCartDrawerOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-['Inter']">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-[#eef2f7] flex flex-col shadow-2xl z-50 border-l border-white/80 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 neu-card flex justify-between items-center m-4 rounded-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-btn-circle text-amber-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-black text-sm text-slate-800 font-['Outfit']">
              Your Cart ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="neu-card p-10 rounded-3xl text-center space-y-3 my-8">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-black text-sm text-slate-800">Your cart is empty!</p>
              <p className="text-xs text-slate-500">Explore deals and add products to start shopping.</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const pId = item.id || item._id;
              const price = item.price || 0;

              return (
                <div
                  key={pId}
                  className="neu-card p-3.5 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl neu-card-inset p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={item.images && item.images[0] ? item.images[0] : item.image}
                      alt={item.name || item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                      {item.name || item.title}
                    </h4>
                    <div className="text-xs font-black text-amber-600 mt-0.5">
                      ₹{price.toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 neu-card-inset px-2 py-0.5 rounded-xl">
                        <button
                          onClick={() => updateQuantity(pId, -1)}
                          className="neu-btn p-1 rounded-lg text-slate-600 hover:text-amber-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 text-[11px] font-black text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(pId, 1)}
                          className="neu-btn p-1 rounded-lg text-slate-600 hover:text-amber-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(pId)}
                        className="neu-btn p-1.5 rounded-xl text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 m-4 neu-card rounded-3xl space-y-3">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-500">Cart Total:</span>
              <span className="text-base text-amber-600">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigate('/cart');
              }}
              className="w-full neu-btn-primary py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
