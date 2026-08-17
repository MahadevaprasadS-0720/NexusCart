import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles, Tag, Layers, DollarSign } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceChange,
  selectedBrand,
  onBrandChange,
  onResetFilters
}) => {
  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'LG', 'Dyson', 'Ray-Ban'];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 font-['Inter']">
      <div className="neu-card p-6 space-y-6 sticky top-24 rounded-3xl">
        
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-300/70">
          <div className="flex items-center gap-2">
            <div className="p-2 neu-card-inset text-amber-600 rounded-xl">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 text-sm tracking-tight font-['Outfit']">Refine Catalog</h3>
          </div>
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors group cursor-pointer"
            title="Clear all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" /> Reset
          </button>
        </div>

        {/* Price Sort Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Sort Products
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full neu-input text-slate-900 text-xs font-bold px-3.5 py-2.5 outline-none cursor-pointer"
          >
            <option value="featured">✨ Featured Deals</option>
            <option value="price-asc">💵 Price: Low to High</option>
            <option value="price-desc">💰 Price: High to Low</option>
            <option value="rating-desc">⭐ Highest Customer Rating</option>
          </select>
        </div>

        {/* Interactive Category Chips */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {['All', 'Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 'Appliances', 'Beauty & Toys'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'neu-card-inset text-amber-700 font-black shadow-inner'
                      : 'neu-btn text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat === 'Home & Kitchen' ? 'Home Utilities' : cat}</span>
                  {isSelected && <Check className="w-3 h-3 text-amber-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Price Range Slider */}
        <div className="space-y-3 pt-2 border-t border-slate-300/70">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Max Budget</label>
            <span className="text-xs font-black text-amber-600 neu-card-inset px-2.5 py-1 rounded-lg">
              ₹{Number(priceRange).toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="200000"
            step="5000"
            value={priceRange}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>₹5,000</span>
            <span>₹2,00,000</span>
          </div>
        </div>

        {/* Brand Checkboxes */}
        <div className="space-y-2.5 pt-2 border-t border-slate-300/70">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-purple-500" /> Brand Filter
          </label>
          <div className="space-y-1.5">
            {brands.map((b) => {
              const isChecked = selectedBrand === b;
              return (
                <label
                  key={b}
                  onClick={() => onBrandChange(isChecked ? '' : b)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all select-none ${
                    isChecked
                      ? 'neu-card-inset text-amber-700 font-black'
                      : 'hover:bg-slate-200/50 text-slate-600'
                  }`}
                >
                  <span>{b}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="accent-amber-500"
                  />
                </label>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default FilterSidebar;
