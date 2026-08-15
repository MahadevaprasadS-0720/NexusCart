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
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
        
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-600">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Refine Catalog</h3>
          </div>
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors group"
            title="Clear all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" /> Reset
          </button>
        </div>

        {/* Price Sort Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Sort Products
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
          >
            <option value="featured">✨ Featured Deals</option>
            <option value="price-asc">💵 Price: Low to High</option>
            <option value="price-desc">💰 Price: High to Low</option>
            <option value="rating-desc">⭐ Highest Customer Rating</option>
          </select>
        </div>

        {/* Interactive Category Chips */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {['All', 'Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 'Appliances'].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-950/10 scale-105'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span>{cat === 'Home & Kitchen' ? 'Home Utilities' : cat}</span>
                  {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Price Range Slider */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Budget</label>
            <span className="text-xs font-extrabold text-amber-600 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
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
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>₹5,000</span>
            <span>₹2,00,000</span>
          </div>
        </div>

        {/* Brand Checkboxes */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-purple-500" /> Brand Filter
          </label>
          <div className="space-y-1.5">
            {brands.map((b) => {
              const isChecked = selectedBrand === b;
              return (
                <label
                  key={b}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isChecked ? 'bg-amber-400/10 text-slate-900 font-bold border border-amber-400/30' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onBrandChange(isChecked ? '' : b)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-amber-400"
                    />
                    <span>{b}</span>
                  </div>
                  {isChecked && <Sparkles className="w-3 h-3 text-amber-500" />}
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
