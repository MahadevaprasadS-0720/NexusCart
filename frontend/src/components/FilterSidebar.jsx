import React from 'react';
import { Filter, Star, RefreshCw } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  maxPrice,
  onPriceChange,
  onResetFilters
}) => {
  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Dyson', 'LG', 'Ray-Ban'];

  return (
    <aside
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '1.2rem',
        border: '1px solid #e2e8f0',
        height: 'fit-content',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px solid #f1f5f9' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={18} color="#2874f0" /> Filters
        </h3>
        <button
          onClick={onResetFilters}
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem' }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="cat"
              checked={selectedCategory === 'All'}
              onChange={() => onSelectCategory('All')}
            />
            All Categories
          </label>
          {categories.map((c) => (
            <label key={c.id || c.name} style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="cat"
                checked={selectedCategory === c.name}
                onChange={() => onSelectCategory(c.name)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem' }}>Brand</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="brand"
              checked={selectedBrand === ''}
              onChange={() => onSelectBrand('')}
            />
            All Brands
          </label>
          {brands.map((b) => (
            <label key={b} style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === b}
                onChange={() => onSelectBrand(b)}
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem' }}>Max Price</h4>
        <input
          type="range"
          min="5000"
          max="200000"
          step="5000"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#2874f0' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
          <span>₹5,000</span>
          <span style={{ fontWeight: '700', color: '#2874f0' }}>₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem' }}>Customer Rating</h4>
        {[4, 3, 2].map((stars) => (
          <div key={stars} style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(stars)].map((_, i) => (
                <Star key={i} size={13} fill="#f59e0b" />
              ))}
            </div>
            <span>& Up</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
