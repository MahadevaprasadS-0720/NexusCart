import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Tag, ShieldCheck } from 'lucide-react';

const NeumorphicCategoryShowcase = ({ onSelectCategory }) => {
  const showcaseCards = [
    {
      id: 'showcase-1',
      title: 'Smartphones & 5G Flagships',
      subtitle: 'Up to 25% Off + No Cost EMI',
      category: 'Mobiles',
      badge: '⚡ HOT DEALS',
      linkText: 'Explore Mobiles',
      items: [
        {
          label: 'iPhone 15 Pro Max',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        },
        {
          label: 'Galaxy S24 Ultra',
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        },
        {
          label: 'Budget under ₹15,000',
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        },
        {
          label: 'Fast Chargers & Gear',
          image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        }
      ]
    },
    {
      id: 'showcase-2',
      title: 'Next-Gen Audio & Computers',
      subtitle: 'Top Rated Electronics & Gadgets',
      category: 'Electronics',
      badge: '🎧 BEST SELLERS',
      linkText: 'Explore Electronics',
      items: [
        {
          label: 'MacBook Air M2',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'Sony Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'Smart Watches',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'iPads & Tablets',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        }
      ]
    },
    {
      id: 'showcase-3',
      title: 'Trending Fashion & Lifestyle',
      subtitle: 'Minimum 40% Off on Top Brands',
      category: 'Fashion',
      badge: '👟 POPULAR PICKS',
      linkText: 'Explore Fashion',
      items: [
        {
          label: 'Nike Air Jordans',
          image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Ray-Ban Eyewear',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Designer Apparel',
          image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Luxury Watches',
          image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        }
      ]
    },
    {
      id: 'showcase-4',
      title: 'Revamp Home & Appliances',
      subtitle: 'Modern Living & Smart Utilities',
      category: 'Home & Kitchen',
      badge: '🏠 HOME ESSENTIALS',
      linkText: 'Explore Home & Utilities',
      items: [
        {
          label: 'Dyson Cordless Vacuums',
          image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'LG 4K OLED Smart TVs',
          image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&q=80',
          cat: 'Appliances'
        },
        {
          label: 'Kitchen & Cookware',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'Smart Air Conditioners',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          cat: 'Appliances'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 font-['Inter'] select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {showcaseCards.map((card) => (
          <div
            key={card.id}
            className="neu-card p-5 rounded-3xl flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-md"
          >
            <div>
              {/* Badge & Title */}
              <div className="flex items-center justify-between mb-2">
                <span className="neu-card-inset text-amber-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl">
                  {card.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-400">4 Top Picks</span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-['Outfit'] leading-snug">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                {card.subtitle}
              </p>

              {/* 4 Inset Tiles Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {card.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectCategory && onSelectCategory(item.cat)}
                    className="group cursor-pointer flex flex-col items-center text-center"
                  >
                    <div className="w-full h-24 sm:h-28 neu-card-inset rounded-2xl overflow-hidden p-2 mb-1.5 flex items-center justify-center transition-transform group-hover:scale-102">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Explore Button */}
            <button
              onClick={() => onSelectCategory && onSelectCategory(card.category)}
              className="mt-5 w-full py-2.5 px-4 neu-btn rounded-xl text-xs font-black text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{card.linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeumorphicCategoryShowcase;
