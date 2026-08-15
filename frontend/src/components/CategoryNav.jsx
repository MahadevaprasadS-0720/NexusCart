import React from 'react';
import { Smartphone, Tv, Shirt, Home, Refrigerator, Sparkles, Tag, Layers } from 'lucide-react';

const iconMap = {
  Smartphone,
  Tv,
  Shirt,
  Home,
  Refrigerator,
  Sparkles
};

const CategoryNav = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
        
        {/* All Products Chip */}
        <div
          onClick={() => onSelectCategory && onSelectCategory('All')}
          className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 text-center group ${
            selectedCategory === 'All'
              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-b from-amber-50/50 to-white'
              : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Tag className="w-5 h-5" />
          </div>
          <span className={`text-xs font-extrabold tracking-tight ${selectedCategory === 'All' ? 'text-amber-700' : 'text-slate-700'}`}>
            All Products
          </span>
        </div>

        {/* Dynamic Category Chips */}
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Smartphone;
          const isSelected = selectedCategory === cat.name;

          return (
            <div
              key={cat.id || cat.name}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 text-center group ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-gradient-to-b from-sky-50/50 to-white'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                isSelected ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'bg-slate-100 text-slate-600'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-xs font-extrabold tracking-tight line-clamp-1 ${isSelected ? 'text-sky-700' : 'text-slate-700'}`}>
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
