import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className="category-bar-grid">
      <div
        className={`category-icon-card ${selectedCategory === 'All' ? 'border-amber-400' : ''}`}
        onClick={() => onSelectCategory && onSelectCategory('All')}
      >
        <div className="category-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
          <Tag size={24} />
        </div>
        <span>All Products</span>
      </div>

      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Smartphone;
        const isSelected = selectedCategory === cat.name;
        return (
          <div
            key={cat.id || cat.name}
            className="category-icon-card"
            style={isSelected ? { borderColor: '#2874f0', backgroundColor: '#eff6ff' } : {}}
            onClick={() => onSelectCategory && onSelectCategory(cat.name)}
          >
            <div className="category-icon-wrapper">
              <IconComponent size={24} />
            </div>
            <span>{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryNav;
