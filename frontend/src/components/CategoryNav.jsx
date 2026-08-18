import React from 'react';
import { Smartphone, Tv, Shirt, Home, Refrigerator, Sparkles, Tag, SlidersHorizontal, Filter } from 'lucide-react';

const iconMap = {
  Smartphone,
  Tv,
  Shirt,
  Home,
  Refrigerator,
  Sparkles
};

const CategoryNav = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  activeFiltersCount = 0,
  onOpenFilter,
  isFilterOpen = false
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 font-['Inter']">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        
        {/* 1. All Products Chip */}
        <div
          onClick={() => onSelectCategory && onSelectCategory('All')}
          className={`p-4 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center group select-none transition-all duration-300 ${
            selectedCategory === 'All' && !isFilterOpen
              ? 'neu-cat-card-active'
              : 'neu-cat-card'
          }`}
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            selectedCategory === 'All' && !isFilterOpen
              ? 'neu-card-inset text-amber-600'
              : 'neu-btn text-amber-500 shadow-sm'
          }`}>
            <Tag className="w-5 h-5" />
          </div>
          <span className={`text-xs font-black tracking-tight ${
            selectedCategory === 'All' && !isFilterOpen ? 'text-amber-700' : 'text-slate-700'
          }`}>
            All Products
          </span>
        </div>

        {/* 2-7. Dynamic Category Chips */}
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Smartphone;
          const isSelected = selectedCategory === cat.name && !isFilterOpen;

          return (
            <div
              key={cat.id || cat.name}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`p-4 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center group select-none transition-all duration-300 ${
                isSelected
                  ? 'neu-cat-card-active'
                  : 'neu-cat-card'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                isSelected
                  ? 'neu-card-inset text-amber-600'
                  : 'neu-btn text-slate-600 shadow-sm'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-xs font-black tracking-tight line-clamp-1 ${
                isSelected ? 'text-amber-700' : 'text-slate-700'
              }`}>
                {cat.name}
              </span>
            </div>
          );
        })}

        {/* 8. NEW: Dedicated "Filters" / "Refine Catalog" Tab */}
        <div
          onClick={onOpenFilter}
          className={`p-4 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center group select-none transition-all duration-300 relative ${
            isFilterOpen || activeFiltersCount > 0
              ? 'neu-cat-card-active border-amber-500/80 shadow-amber-500/10'
              : 'neu-cat-card'
          }`}
          title="Open Refine Catalog Filters Panel"
        >
          {/* Active Filter Counter Badge */}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
              {activeFiltersCount}
            </span>
          )}

          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isFilterOpen || activeFiltersCount > 0
              ? 'neu-card-inset text-amber-600'
              : 'neu-btn text-amber-500 shadow-sm'
          }`}>
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <span className={`text-xs font-black tracking-tight flex items-center gap-1 ${
            isFilterOpen || activeFiltersCount > 0 ? 'text-amber-700 font-extrabold' : 'text-slate-700'
          }`}>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] font-black text-amber-600">({activeFiltersCount})</span>
            )}
          </span>
        </div>

      </div>
    </div>
  );
};

export default CategoryNav;
