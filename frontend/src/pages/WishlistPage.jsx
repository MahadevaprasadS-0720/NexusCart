import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { initialProducts } from '../data/mockData';

const WishlistPage = () => {
  const { wishlist } = useCart();
  const wishlistedProducts = initialProducts.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Heart size={28} color="#ef4444" fill="#ef4444" />
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
          My Wishlist ({wishlistedProducts.length})
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '4rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Heart size={64} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.4rem' }}>Your Wishlist is Empty</h2>
          <p style={{ color: '#64748b' }}>Save products you love to view or buy them anytime.</p>
        </div>
      ) : (
        <div className="products-grid">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
