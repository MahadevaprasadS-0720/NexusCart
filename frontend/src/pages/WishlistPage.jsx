import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { initialProducts } from '../data/mockData';
import { api } from '../services/api';
import { fetchLiveMarketStoreProducts } from '../services/liveMarketService';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      const [apiRes, liveRes] = await Promise.allSettled([
        api.getProducts(),
        fetchLiveMarketStoreProducts()
      ]);

      let pool = [...initialProducts];
      if (apiRes.status === 'fulfilled' && apiRes.value?.products?.length > 0) {
        pool = [...pool, ...apiRes.value.products];
      }
      if (liveRes.status === 'fulfilled' && liveRes.value?.products?.length > 0) {
        pool = [...pool, ...liveRes.value.products];
      }

      // Deduplicate by id
      const uniqueMap = new Map();
      pool.forEach(p => {
        const id = p.id || p._id;
        if (id && !uniqueMap.has(id)) {
          uniqueMap.set(id, p);
        }
      });
      setAllProducts(Array.from(uniqueMap.values()));
    } catch (e) {
      setAllProducts(initialProducts);
    }
  };

  const wishlistedProducts = allProducts.filter(p => {
    const pId = p.id || p._id;
    return wishlist.includes(pId);
  });

  const handleMoveAllToCart = () => {
    if (wishlistedProducts.length === 0) return;
    wishlistedProducts.forEach(prod => {
      addToCart(prod, 1);
    });
    setToast(`🎉 Moved all ${wishlistedProducts.length} items to your Shopping Cart!`);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 font-['Inter'] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl neu-btn-circle text-red-500 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit']">
              My Saved Wishlist ({wishlistedProducts.length})
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Saved items available for quick checkout and purchase
            </p>
          </div>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={clearWishlist}
            className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-red-500 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" /> Clear All Wishlist
          </button>
        )}
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div className="neu-card p-4 rounded-2xl text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 shadow-sm animate-float">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Wishlist Items Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="neu-card p-12 sm:p-16 rounded-3xl text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-20 h-20 rounded-full neu-card-inset flex items-center justify-center mx-auto text-slate-400">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-800 font-['Outfit']">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Explore 10,000+ top electronics, smartphones, and fashion deals on NexusCart and tap the heart icon on items you love.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 neu-btn-primary px-6 py-3 rounded-2xl text-xs font-black text-white shadow-md"
            >
              <span>Explore Marketplace Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
