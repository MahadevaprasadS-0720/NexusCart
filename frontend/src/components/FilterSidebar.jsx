import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Tag,
  Layers,
  DollarSign,
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
  selectedDiscount = 0,
  onDiscountChange,
  dealsOnly = false,
  onDealsOnlyChange,
  inStockOnly = false,
  onInStockOnlyChange,
  onResetFilters,
  isDrawer = false
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
    discounts: false,
    availability: false
  });

  const toggleSection = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Helper to normalize and match categories with 100% precision
  const normalizeCat = (cat) => {
    if (!cat) return '';
    const c = String(cat).toLowerCase().replace(/[-_&]/g, ' ').trim();
    if (c.includes('mobile') || c.includes('phone') || c.includes('tablet') || c.includes('smartphone')) return 'Mobiles';
    if (c.includes('electronic') || c.includes('laptop') || c.includes('watch') || c.includes('audio') || c.includes('headphone') || c.includes('camera')) return 'Electronics';
    if (c.includes('fashion') || c.includes('cloth') || c.includes('dress') || c.includes('shoe') || c.includes('shirt') || c.includes('bag') || c.includes('sunglass') || c.includes('jewel') || c.includes('sneaker')) return 'Fashion';
    if (c.includes('home') || c.includes('kitchen') || c.includes('furniture') || c.includes('utilit') || c.includes('decor') || c.includes('cookware')) return 'Home & Kitchen';
    if (c.includes('appliance') || c.includes('automotive') || c.includes('vehicle') || c.includes('motorcycle') || c.includes('sports')) return 'Appliances';
    if (c.includes('beauty') || c.includes('toy') || c.includes('fragrance') || c.includes('skin') || c.includes('grocer') || c.includes('cosmetic') || c.includes('perfume')) return 'Beauty & Toys';
    return cat;
  };

  const isCatMatch = (prodCat, targetCat) => {
    if (!targetCat || targetCat === 'All') return true;
    const prodNorm = normalizeCat(prodCat);
    const targetNorm = normalizeCat(targetCat);
    return prodNorm.toLowerCase() === targetNorm.toLowerCase();
  };

  // Category List Definitions
  const categoryDefinitions = [
    { key: 'All', label: 'All Products' },
    { key: 'Mobiles', label: 'Mobiles' },
    { key: 'Electronics', label: 'Electronics' },
    { key: 'Fashion', label: 'Fashion' },
    { key: 'Home & Kitchen', label: 'Home Utilities' },
    { key: 'Appliances', label: 'Appliances' },
    { key: 'Beauty & Toys', label: 'Beauty & Toys' }
  ];

  // Dynamic Real-time Category Counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allProducts.length };
    categoryDefinitions.forEach(def => {
      if (def.key === 'All') return;
      counts[def.key] = allProducts.filter(p => isCatMatch(p.category, def.key)).length;
    });
    return counts;
  }, [allProducts]);

  // Contextual Products for the currently selected category
  const contextualProducts = useMemo(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      return allProducts.filter(p => isCatMatch(p.category, selectedCategory));
    }
    return allProducts;
  }, [allProducts, selectedCategory]);

  // Dynamic Brands contextual to selected category
  const availableBrands = useMemo(() => {
    const counts = {};
    contextualProducts.forEach(p => {
      if (p.brand && p.brand.trim()) {
        const b = p.brand.trim();
        counts[b] = (counts[b] || 0) + 1;
      }
    });

    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .map(name => ({ name, count: counts[name] }));
  }, [contextualProducts]);

  // Filtered brands based on user typing in brand search
  const filteredBrandsList = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    return availableBrands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()));
  }, [availableBrands, brandSearch]);

  const displayedBrands = showAllBrands ? filteredBrandsList : filteredBrandsList.slice(0, 7);

  // Dynamic Discount Counts
  const discountCounts = useMemo(() => {
    return {
      10: contextualProducts.filter(p => (p.discountPercentage || 0) >= 10).length,
      20: contextualProducts.filter(p => (p.discountPercentage || 0) >= 20).length,
      30: contextualProducts.filter(p => (p.discountPercentage || 0) >= 30).length,
      50: contextualProducts.filter(p => (p.discountPercentage || 0) >= 50).length,
    };
  }, [contextualProducts]);

  // Count how many active filters exist
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== 'All') count++;
    if (selectedBrands && selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange < 250000 || minPrice > 0) count++;
    if (selectedDiscount > 0) count++;
    if (dealsOnly) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, selectedBrands, priceRange, minPrice, selectedDiscount, dealsOnly, inStockOnly]);

  // Quick Price Preset Ranges
  const quickPricePresets = [
    { label: 'All Budgets', min: 0, max: 250000 },
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

  const ContentJSX = (
    <div className="w-full space-y-5 select-none font-['Inter']">
      
      {/* ================= HEADER & RESET (Rendered only on inline sidebar) ================= */}
      {!isDrawer && (
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
                {contextualProducts.length} matching products
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
      )}

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
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-amber-700 text-xs font-black shadow-xs border border-amber-300">
                Cat: {selectedCategory}
                <X
                  className="w-3 h-3 text-amber-500 hover:text-red-600 cursor-pointer"
                  onClick={() => onSelectCategory && onSelectCategory('All')}
                />
              </span>
            )}

            {selectedBrands.map(brand => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-purple-700 text-xs font-black shadow-xs border border-purple-300"
              >
                {brand}
                <X
                  className="w-3 h-3 text-purple-500 hover:text-red-600 cursor-pointer"
                  onClick={() => onBrandToggle && onBrandToggle(brand)}
                />
              </span>
            ))}

            {(priceRange < 250000 || minPrice > 0) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-emerald-700 text-xs font-black shadow-xs border border-emerald-300">
                ₹{Number(minPrice).toLocaleString('en-IN')} - ₹{Number(priceRange).toLocaleString('en-IN')}
                <X
                  className="w-3 h-3 text-emerald-500 hover:text-red-600 cursor-pointer"
                  onClick={() => {
                    if (onMinPriceChange) onMinPriceChange(0);
                    if (onPriceChange) onPriceChange(250000);
                  }}
                />
              </span>
            )}

            {selectedDiscount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-orange-700 text-xs font-black shadow-xs border border-orange-300">
                {selectedDiscount}%+ Off
                <X
                  className="w-3 h-3 text-orange-500 hover:text-red-600 cursor-pointer"
                  onClick={() => onDiscountChange && onDiscountChange(0)}
                />
              </span>
            )}

            {dealsOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-red-700 text-xs font-black shadow-xs border border-red-300">
                Deals Only
                <X
                  className="w-3 h-3 text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() => onDealsOnlyChange && onDealsOnlyChange(false)}
                />
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-blue-700 text-xs font-black shadow-xs border border-blue-300">
                In Stock
                <X
                  className="w-3 h-3 text-blue-500 hover:text-red-600 cursor-pointer"
                  onClick={() => onInStockOnlyChange && onInStockOnlyChange(false)}
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* ================= 1. SORT ORDER ================= */}
      <div className="space-y-2 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer hover:text-amber-600 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" /> Sort Order
          </span>
          {collapsedSections.sort ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {!collapsedSections.sort && (
          <div className="pt-1">
            <select
              value={sortBy}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="w-full neu-input text-xs font-extrabold text-slate-800 p-2.5 outline-none cursor-pointer"
            >
              <option value="featured">✨ Featured & Deals (Recommended)</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💰 Price: High to Low</option>
              <option value="rating-desc">⭐ Highest Customer Rating</option>
              <option value="discount-desc">🔥 Biggest Discount %</option>
              <option value="name-asc">🔤 Title: A to Z</option>
            </select>
          </div>
        )}
      </div>

      {/* ================= 2. CATEGORIES ================= */}
      <div className="space-y-2 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer hover:text-amber-600 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" /> Categories
          </span>
          {collapsedSections.categories ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {!collapsedSections.categories && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categoryDefinitions.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(cat.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'neu-card-inset text-amber-700 bg-amber-50/50 border border-amber-300 shadow-sm'
                      : 'neu-btn text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-amber-500 text-white' : 'neu-card-inset text-slate-500'
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

      {/* ================= 3. PRICE BUDGET RANGE ================= */}
      <div className="space-y-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer hover:text-amber-600 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Price & Budget
          </span>
          {collapsedSections.price ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {!collapsedSections.price && (
          <div className="space-y-3 pt-1">
            {/* Quick 1-Click Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {quickPricePresets.map((preset) => {
                const isActive = minPrice === preset.min && priceRange === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (onMinPriceChange) onMinPriceChange(preset.min);
                      if (onPriceChange) onPriceChange(preset.max);
                      setCustomMinInput(preset.min > 0 ? String(preset.min) : '');
                      setCustomMaxInput(preset.max < 250000 ? String(preset.max) : '');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                      isActive
                        ? 'neu-card-inset text-emerald-700 border border-emerald-400 font-black'
                        : 'neu-btn text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-extrabold text-slate-700">
                <span>Max Price:</span>
                <span className="text-emerald-600">₹{Number(priceRange).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="250000"
                step="500"
                value={priceRange}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (onPriceChange) onPriceChange(val);
                  setCustomMaxInput(String(val));
                }}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>₹500</span>
                <span>₹1,00,000</span>
                <span>₹2,50,000+</span>
              </div>
            </div>

            {/* Min - Max Input Boxes */}
            <form onSubmit={applyCustomPriceRange} className="flex items-center gap-2 pt-1">
              <input
                type="number"
                placeholder="Min ₹"
                value={customMinInput}
                onChange={(e) => setCustomMinInput(e.target.value)}
                className="w-full neu-input text-xs font-bold text-slate-800 p-2 text-center"
              />
              <span className="text-slate-400 text-xs font-bold">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={customMaxInput}
                onChange={(e) => setCustomMaxInput(e.target.value)}
                className="w-full neu-input text-xs font-bold text-slate-800 p-2 text-center"
              />
              <button
                type="submit"
                className="neu-btn-primary px-3 py-2 text-xs font-black text-white rounded-xl cursor-pointer shrink-0"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= 4. BRANDS ================= */}
      {availableBrands.length > 0 && (
        <div className="space-y-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => toggleSection('brands')}
              className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer hover:text-amber-600 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-purple-500" /> Brands ({availableBrands.length})
            </button>
            
            <div className="flex items-center gap-2">
              {selectedBrands.length > 0 && (
                <button
                  type="button"
                  onClick={onClearBrands}
                  className="text-[10px] font-black text-red-500 hover:underline cursor-pointer"
                >
                  Clear ({selectedBrands.length})
                </button>
              )}
              <button
                type="button"
                onClick={() => toggleSection('brands')}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {collapsedSections.brands ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!collapsedSections.brands && (
            <div className="space-y-2.5 pt-1">
              {/* Brand Search Input */}
              {availableBrands.length > 5 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search brand name..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full neu-input text-xs pl-8 pr-7 py-1.5 font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  {brandSearch && (
                    <button
                      onClick={() => setBrandSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Brand Checkbox List */}
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {displayedBrands.map((b) => {
                  const isChecked = selectedBrands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      onClick={() => onBrandToggle && onBrandToggle(b.name)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isChecked
                          ? 'neu-card-inset text-purple-800 bg-purple-50/40 font-bold border border-purple-200'
                          : 'hover:bg-slate-200/50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate max-w-[170px]">{b.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold neu-card-inset px-1.5 py-0.2 rounded-md">
                        {b.count}
                      </span>
                    </label>
                  );
                })}
              </div>

              {filteredBrandsList.length > 7 && (
                <button
                  type="button"
                  onClick={() => setShowAllBrands(!showAllBrands)}
                  className="text-xs font-bold text-purple-600 hover:underline cursor-pointer pt-1"
                >
                  {showAllBrands ? 'Show Less Brands' : `+ Show All ${filteredBrandsList.length} Brands`}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. DEALS & DISCOUNTS ================= */}
      <div className="space-y-3 pb-3 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => toggleSection('discounts')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer hover:text-amber-600 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Deals & Discounts
          </span>
          {collapsedSections.discounts ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {!collapsedSections.discounts && (
          <div className="space-y-2 pt-1">
            {/* Deals Only Toggle */}
            <label
              onClick={() => onDealsOnlyChange && onDealsOnlyChange(!dealsOnly)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                dealsOnly
                  ? 'neu-card-inset text-red-700 bg-red-50/50 border border-red-300'
                  : 'neu-btn text-slate-700 hover:text-red-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>⚡ Lightning Deals Only</span>
              </div>
              <input
                type="checkbox"
                checked={dealsOnly}
                onChange={() => {}}
                className="accent-red-600"
              />
            </label>

            {/* Discount % Pills */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[10, 20, 30, 50].map((disc) => {
                const isSelected = selectedDiscount === disc;
                return (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => onDiscountChange && onDiscountChange(isSelected ? 0 : disc)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'neu-card-inset text-orange-700 border border-orange-400 font-black'
                        : 'neu-btn text-slate-600 hover:text-orange-600'
                    }`}
                  >
                    {disc}% or more off
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= 6. AVAILABILITY ================= */}
      <div className="space-y-2 pb-2">
        <button
          type="button"
          onClick={() => toggleSection('availability')}
          className="w-full flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider cursor-pointer hover:text-amber-600 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-blue-500" /> Availability
          </span>
          {collapsedSections.availability ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {!collapsedSections.availability && (
          <div className="pt-1">
            <label
              onClick={() => onInStockOnlyChange && onInStockOnlyChange(!inStockOnly)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                inStockOnly
                  ? 'neu-card-inset text-blue-700 bg-blue-50/50 border border-blue-300'
                  : 'neu-btn text-slate-700 hover:text-blue-600'
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
  );

  if (isDrawer) {
    return ContentJSX;
  }

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 font-['Inter'] select-none">
      <div className="neu-card p-5 sm:p-6 space-y-6 rounded-3xl sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
        {ContentJSX}
      </div>
    </aside>
  );
};

export default FilterSidebar;
