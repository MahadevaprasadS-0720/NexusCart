import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Sparkles,
  Tag,
  Layers,
  DollarSign,
  Star,
  Zap,
  Percent,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  PackageCheck,
  Flame,
  ArrowUpDown
} from 'lucide-react';

const FilterSidebar = ({
  allProducts = [],
  selectedCategory = 'All',
  onSelectCategory,
  sortBy = 'featured',
  onSortChange,
  priceRange = 250000,
  onPriceChange,
  minPrice = 0,
  onMinPriceChange,
  selectedBrands = [],
  onBrandToggle,
  onClearBrands,
  selectedRating = 0,
  onRatingChange,
  selectedDiscount = 0,
  onDiscountChange,
  dealsOnly = false,
  onDealsOnlyChange,
  inStockOnly = false,
  onInStockOnlyChange,
  onResetFilters,
  onRemoveSingleFilter
}) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [customMinInput, setCustomMinInput] = useState(minPrice > 0 ? String(minPrice) : '');
  const [customMaxInput, setCustomMaxInput] = useState(priceRange < 250000 ? String(priceRange) : '');

  // Collapsible section states for smooth accordion feel
  const [collapsedSections, setCollapsedSections] = useState({
    sort: false,
    categories: false,
    price: false,
    brands: false,
    ratings: false,
    discounts: false,
    availability: false
  });

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Helper to match categories flexibly
  const isCatMatch = (prodCat, targetCat) => {
    if (!prodCat) return false;
    const p = prodCat.toLowerCase().trim();
    const t = targetCat.toLowerCase().trim();
    if (p === t) return true;
    if ((p.includes('home') || p.includes('kitchen') || p.includes('utilities')) &&
        (t.includes('home') || t.includes('kitchen') || t.includes('utilities'))) return true;
    if ((p.includes('beauty') || p.includes('toy')) &&
        (t.includes('beauty') || t.includes('toy'))) return true;
    return false;
  };

  // Category List with Real-Time Dynamic Product Counts
  const categoryDefinitions = [
    { key: 'All', label: 'All Products' },
    { key: 'Mobiles', label: 'Mobiles' },
    { key: 'Electronics', label: 'Electronics' },
    { key: 'Fashion', label: 'Fashion' },
    { key: 'Home & Kitchen', label: 'Home Utilities' },
    { key: 'Appliances', label: 'Appliances' },
    { key: 'Beauty & Toys', label: 'Beauty & Toys' }
  ];

  const categoryCounts = useMemo(() => {
    const counts = { All: allProducts.length };
    categoryDefinitions.forEach(def => {
      if (def.key === 'All') return;
      counts[def.key] = allProducts.filter(p => isCatMatch(p.category, def.key)).length;
    });
    return counts;
  }, [allProducts]);

  // Dynamic Brands Extracted from Catalog with Counts
  const availableBrands = useMemo(() => {
    const counts = {};
    allProducts.forEach(p => {
      if (p.brand && p.brand.trim()) {
        const b = p.brand.trim();
        counts[b] = (counts[b] || 0) + 1;
      }
    });

    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .map(name => ({ name, count: counts[name] }));
  }, [allProducts]);

  // Filtered brands based on user typing in brand search
  const filteredBrandsList = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    return availableBrands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()));
  }, [availableBrands, brandSearch]);

  const displayedBrands = showAllBrands ? filteredBrandsList : filteredBrandsList.slice(0, 7);

  // Dynamic Rating Counts
  const ratingCounts = useMemo(() => {
    return {
      4.5: allProducts.filter(p => (Number(p.rating) || 0) >= 4.5).length,
      4.0: allProducts.filter(p => (Number(p.rating) || 0) >= 4.0).length,
      3.5: allProducts.filter(p => (Number(p.rating) || 0) >= 3.5).length,
      3.0: allProducts.filter(p => (Number(p.rating) || 0) >= 3.0).length,
    };
  }, [allProducts]);

  // Dynamic Discount Counts
  const discountCounts = useMemo(() => {
    return {
      10: allProducts.filter(p => (p.discountPercentage || 0) >= 10).length,
      20: allProducts.filter(p => (p.discountPercentage || 0) >= 20).length,
      30: allProducts.filter(p => (p.discountPercentage || 0) >= 30).length,
      50: allProducts.filter(p => (p.discountPercentage || 0) >= 50).length,
    };
  }, [allProducts]);

  // Count how many active filters exist
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== 'All') count++;
    if (selectedBrands && selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange < 250000 || minPrice > 0) count++;
    if (selectedRating > 0) count++;
    if (selectedDiscount > 0) count++;
    if (dealsOnly) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, selectedBrands, priceRange, minPrice, selectedRating, selectedDiscount, dealsOnly, inStockOnly]);

  // Quick Price Preset Ranges
  const quickPricePresets = [
    { label: 'All', min: 0, max: 250000 },
    { label: 'Under ₹2,000', min: 0, max: 2000 },
    { label: '₹2k - ₹10k', min: 2000, max: 10000 },
    { label: '₹10k - ₹50k', min: 10000, max: 50000 },
    { label: '₹50k - ₹1.5L', min: 50000, max: 150000 },
    { label: '₹1.5L+', min: 150000, max: 250000 }
  ];

  const applyCustomPriceRange = (e) => {
    e?.preventDefault();
    const minVal = customMinInput ? Math.max(0, parseInt(customMinInput, 10) || 0) : 0;
    const maxVal = customMaxInput ? Math.min(250000, parseInt(customMaxInput, 10) || 250000) : 250000;
    if (onMinPriceChange) onMinPriceChange(minVal);
    if (onPriceChange) onPriceChange(maxVal);
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 font-['Inter'] select-none">
      <div className="neu-card p-5 sm:p-6 space-y-6 rounded-3xl sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
        
        {/* ================= HEADER & RESET ================= */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-300/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 neu-card-inset text-amber-600 rounded-xl shadow-inner">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-sm tracking-tight font-['Outfit']">Refine Catalog</h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-full animate-pulse shadow-sm">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold text-slate-400">
                {allProducts.length} live products loaded
              </p>
            </div>
          </div>
          
          <button
            onClick={onResetFilters}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              activeFiltersCount > 0
                ? 'neu-btn text-amber-600 hover:text-red-600 active:scale-95'
                : 'text-slate-400 hover:text-slate-600 opacity-70'
            }`}
            title="Clear all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* ================= ACTIVE FILTER TAGS PILL TRAY ================= */}
        {activeFiltersCount > 0 && (
          <div className="p-3.5 neu-card-inset rounded-2xl space-y-2 border border-amber-200/50 bg-amber-50/20">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-amber-700">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" /> Active Filters:
              </span>
              <button
                onClick={onResetFilters}
                className="text-[10px] font-black text-red-500 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedCategory && selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-slate-800 bg-white">
                  <span>Cat: {selectedCategory}</span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onSelectCategory && onSelectCategory('All')}
                  />
                </span>
              )}

              {selectedBrands && selectedBrands.map(b => (
                <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-purple-700 bg-white">
                  <span>Brand: {b}</span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onBrandToggle && onBrandToggle(b)}
                  />
                </span>
              ))}

              {(priceRange < 250000 || minPrice > 0) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-emerald-700 bg-white">
                  <span>
                    ₹{Number(minPrice).toLocaleString('en-IN')} - ₹{Number(priceRange).toLocaleString('en-IN')}
                  </span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      if (onMinPriceChange) onMinPriceChange(0);
                      if (onPriceChange) onPriceChange(250000);
                      setCustomMinInput('');
                      setCustomMaxInput('');
                    }}
                  />
                </span>
              )}

              {selectedRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-amber-700 bg-white">
                  <span>{selectedRating}★ & Above</span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onRatingChange && onRatingChange(0)}
                  />
                </span>
              )}

              {selectedDiscount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-orange-700 bg-white">
                  <span>{selectedDiscount}%+ Off</span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onDiscountChange && onDiscountChange(0)}
                  />
                </span>
              )}

              {dealsOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-red-700 bg-white">
                  <span>⚡ Deals Only</span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onDealsOnlyChange && onDealsOnlyChange(false)}
                  />
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold neu-btn text-blue-700 bg-white">
                  <span>📦 In Stock Only</span>
                  <X
                    className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onInStockOnlyChange && onInStockOnlyChange(false)}
                  />
                </span>
              )}
            </div>
          </div>
        )}

        {/* ================= 1. SORT PRODUCTS ================= */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" /> Sort Order
            </span>
            {collapsedSections.sort ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.sort && (
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full neu-input text-slate-900 text-xs font-black px-3.5 py-2.5 outline-none cursor-pointer"
            >
              <option value="featured">✨ Featured & Deals (Recommended)</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💰 Price: High to Low</option>
              <option value="rating-desc">⭐ Highest Customer Rating</option>
              <option value="discount-desc">🔥 Biggest Discount %</option>
              <option value="name-asc">🔤 Alphabetical (A to Z)</option>
            </select>
          )}
        </div>

        {/* ================= 2. CATEGORIES FILTER ================= */}
        <div className="space-y-2.5 pt-2 border-t border-slate-300/80">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" /> Categories
            </span>
            {collapsedSections.categories ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.categories && (
            <div className="flex flex-wrap gap-2">
              {categoryDefinitions.map((cat) => {
                const isSelected = selectedCategory === cat.key || (cat.key === 'Home & Kitchen' && (selectedCategory === 'Home & Kitchen' || selectedCategory === 'Home Utilities'));
                const count = categoryCounts[cat.key] !== undefined ? categoryCounts[cat.key] : 0;

                return (
                  <button
                    key={cat.key}
                    onClick={() => onSelectCategory(cat.key)}
                    className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'neu-card-inset text-amber-700 font-black shadow-inner border border-amber-300/60'
                        : 'neu-btn text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200/80 text-slate-500'
                    }`}>
                      {count}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-amber-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= 3. MAX BUDGET & PRICE RANGE ================= */}
        <div className="space-y-3 pt-2 border-t border-slate-300/80">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Price & Budget
            </span>
            {collapsedSections.price ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.price && (
            <div className="space-y-3">
              {/* Range indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Range:</span>
                <span className="text-xs font-black text-amber-700 neu-card-inset px-2.5 py-1 rounded-lg border border-slate-200">
                  ₹{Number(minPrice).toLocaleString('en-IN')} - ₹{Number(priceRange).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Slider for Max Price */}
              <input
                type="range"
                min="500"
                max="250000"
                step="1000"
                value={priceRange}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>₹500</span>
                <span>₹1,00,000</span>
                <span>₹2,50,000+</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {quickPricePresets.map((preset) => {
                  const isPresetActive = minPrice === preset.min && priceRange === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        if (onMinPriceChange) onMinPriceChange(preset.min);
                        if (onPriceChange) onPriceChange(preset.max);
                        setCustomMinInput(preset.min > 0 ? String(preset.min) : '');
                        setCustomMaxInput(preset.max < 250000 ? String(preset.max) : '');
                      }}
                      className={`text-[10px] font-black py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer truncate ${
                        isPresetActive
                          ? 'neu-card-inset text-amber-700 font-extrabold bg-amber-50/50 border border-amber-300'
                          : 'neu-btn text-slate-600 hover:text-slate-900'
                      }`}
                      title={preset.label}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Min - Max Input Boxes */}
              <form onSubmit={applyCustomPriceRange} className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={customMinInput}
                  onChange={(e) => setCustomMinInput(e.target.value)}
                  className="w-1/2 neu-input text-[11px] font-bold px-2 py-1.5 text-center outline-none"
                />
                <span className="text-slate-400 font-black text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={customMaxInput}
                  onChange={(e) => setCustomMaxInput(e.target.value)}
                  className="w-1/2 neu-input text-[11px] font-bold px-2 py-1.5 text-center outline-none"
                />
                <button
                  type="submit"
                  className="neu-btn text-[10px] font-black px-2.5 py-1.5 text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ================= 4. BRAND FILTER (DYNAMIC) ================= */}
        <div className="space-y-2.5 pt-2 border-t border-slate-300/80">
          <button
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-500" /> Brand Filter
              {selectedBrands.length > 0 && (
                <span className="text-purple-600 font-bold">({selectedBrands.length})</span>
              )}
            </span>
            {collapsedSections.brands ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.brands && (
            <div className="space-y-2">
              {/* Brand mini-search */}
              {availableBrands.length > 5 && (
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full neu-input text-[11px] font-medium pl-7 pr-2.5 py-1.5 outline-none placeholder:text-slate-400"
                  />
                  {brandSearch && (
                    <X
                      className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-red-500"
                      onClick={() => setBrandSearch('')}
                    />
                  )}
                </div>
              )}

              {/* Brands list checkboxes */}
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {displayedBrands.length === 0 ? (
                  <p className="text-[11px] font-medium text-slate-400 py-2 text-center">
                    No brands found matching "{brandSearch}"
                  </p>
                ) : (
                  displayedBrands.map((b) => {
                    const isChecked = selectedBrands.includes(b.name);
                    return (
                      <label
                        key={b.name}
                        onClick={() => onBrandToggle && onBrandToggle(b.name)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all select-none ${
                          isChecked
                            ? 'neu-card-inset text-purple-800 font-black border border-purple-200/60 bg-purple-50/20'
                            : 'hover:bg-slate-200/50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="accent-purple-600 rounded cursor-pointer"
                          />
                          <span className="truncate max-w-[140px]">{b.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          ({b.count})
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Show More / Show Less Brands */}
              {filteredBrandsList.length > 7 && (
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setShowAllBrands(!showAllBrands)}
                    className="text-[11px] font-black text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    {showAllBrands ? '▲ Show Less' : `▼ View All (${filteredBrandsList.length} brands)`}
                  </button>
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={onClearBrands}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      Clear ({selectedBrands.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= 5. CUSTOMER RATINGS ================= */}
        <div className="space-y-2.5 pt-2 border-t border-slate-300/80">
          <button
            onClick={() => toggleSection('ratings')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Customer Ratings
            </span>
            {collapsedSections.ratings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.ratings && (
            <div className="space-y-1.5">
              {[
                { min: 4.5, label: '4.5★ & Above', desc: 'Top Rated' },
                { min: 4.0, label: '4.0★ & Above', desc: 'Popular' },
                { min: 3.5, label: '3.5★ & Above', desc: 'Good Value' },
                { min: 3.0, label: '3.0★ & Above', desc: 'All Ratings' }
              ].map((r) => {
                const isSelected = selectedRating === r.min;
                const count = ratingCounts[r.min] || 0;

                return (
                  <button
                    key={r.min}
                    onClick={() => onRatingChange(isSelected ? 0 : r.min)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'neu-card-inset text-amber-800 font-black border border-amber-300 bg-amber-50/30'
                        : 'neu-btn text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(r.min) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-extrabold">{r.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= 6. DEALS & SPECIAL OFFERS ================= */}
        <div className="space-y-2.5 pt-2 border-t border-slate-300/80">
          <button
            onClick={() => toggleSection('discounts')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" /> Deals & Discounts
            </span>
            {collapsedSections.discounts ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.discounts && (
            <div className="space-y-1.5">
              {/* Lightning Deals Toggle */}
              <label
                onClick={() => onDealsOnlyChange(!dealsOnly)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all select-none ${
                  dealsOnly
                    ? 'neu-card-inset text-red-700 font-black border border-red-200 bg-red-50/30'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>⚡ Lightning Deals & Hot Offers</span>
                </div>
                <input
                  type="checkbox"
                  checked={dealsOnly}
                  onChange={() => {}}
                  className="accent-red-500"
                />
              </label>

              {/* Discount Percentage Chips */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[10, 20, 30, 50].map((d) => {
                  const isSelected = selectedDiscount === d;
                  const count = discountCounts[d] || 0;

                  return (
                    <button
                      key={d}
                      onClick={() => onDiscountChange(isSelected ? 0 : d)}
                      className={`text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'neu-card-inset text-orange-700 font-black border border-orange-300'
                          : 'neu-btn text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{d}% Off+</span>
                      <span className="text-[9px] font-bold text-slate-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ================= 7. AVAILABILITY & DELIVERY ================= */}
        <div className="space-y-2.5 pt-2 border-t border-slate-300/80">
          <button
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-blue-600" /> Availability & Stock
            </span>
            {collapsedSections.availability ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {!collapsedSections.availability && (
            <div className="space-y-1.5">
              <label
                onClick={() => onInStockOnlyChange(!inStockOnly)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all select-none ${
                  inStockOnly
                    ? 'neu-card-inset text-blue-700 font-black border border-blue-200 bg-blue-50/20'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>In Stock Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => {}}
                  className="accent-blue-600"
                />
              </label>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};

export default FilterSidebar;
