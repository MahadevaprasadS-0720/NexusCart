import React from 'react';
import { Smartphone, Tv, Shirt, Home, Refrigerator, Sparkles, Tag } from 'lucide-react';

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
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 font-['Inter']">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
        
        {/* All Products Chip */}
        <div
          onClick={() => onSelectCategory && onSelectCategory('All')}
          className={`p-4 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center group select-none ${
            selectedCategory === 'All'
              ? 'neu-cat-card-active'
              : 'neu-cat-card'
          }`}
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            selectedCategory === 'All'
              ? 'neu-card-inset text-amber-600'
              : 'neu-btn text-amber-500 shadow-sm'
          }`}>
            <Tag className="w-5 h-5" />
          </div>
          <span className={`text-xs font-black tracking-tight ${
            selectedCategory === 'All' ? 'text-amber-700' : 'text-slate-700'
          }`}>
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
              className={`p-4 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center group select-none ${
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
      </div>
    </div>
  );
};

export default CategoryNav;
