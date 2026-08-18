import React from 'react';
import { X, SlidersHorizontal, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

const FilterDrawerModal = ({
  isOpen = false,
  onClose,
  allProducts = [],
  filteredCount = 0,
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
  activeFiltersCount = 0,
  onResetFilters
}) => {
  if (!isOpen) return null;

  const handleApplyAndClose = () => {
    onClose();
    // Smooth scroll to catalog section
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-['Inter']">
      
      {/* Dark Blur Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full max-w-md sm:max-w-lg h-full bg-[#eef2f7] flex flex-col shadow-2xl z-50 border-l border-white/90 animate-in slide-in-from-right duration-300">
        
        {/* Sticky Header */}
        <div className="p-5 neu-nav flex items-center justify-between border-b border-slate-300/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-btn-circle text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 font-['Outfit']">
                  Refine Catalog Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="neu-card-inset text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {activeFiltersCount} Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {filteredCount} matching products live
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer transition-all"
            title="Close Filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <FilterSidebar
            allProducts={allProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            sortBy={sortBy}
            onSortChange={onSortChange}
            priceRange={priceRange}
            onPriceChange={onPriceChange}
            minPrice={minPrice}
            onMinPriceChange={onMinPriceChange}
            selectedBrands={selectedBrands}
            onBrandToggle={onBrandToggle}
            onClearBrands={onClearBrands}
            selectedDiscount={selectedDiscount}
            onDiscountChange={onDiscountChange}
            dealsOnly={dealsOnly}
            onDealsOnlyChange={onDealsOnlyChange}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={onInStockOnlyChange}
            onResetFilters={onResetFilters}
          />
        </div>

        {/* Sticky Footer Actions */}
        <div className="p-4 sm:p-5 neu-card rounded-none border-t border-slate-300/80 flex items-center gap-3 shrink-0 shadow-lg">
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="neu-btn px-4 py-3 text-slate-600 hover:text-red-500 font-black text-xs rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleApplyAndClose}
            className="flex-1 neu-btn-primary py-3 px-5 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Show {filteredCount} Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterDrawerModal;
