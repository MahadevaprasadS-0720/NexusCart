import React from 'react';
import { Menu, ChevronDown, Sparkles, Flame, Zap, ShieldCheck } from 'lucide-react';

const AmazonSubNav = ({
  selectedCategory = 'All',
  onSelectCategory,
  onOpenDrawer
}) => {
  const navItems = [
    { label: 'All Categories', value: 'All', icon: Menu, isAll: true },
    { label: 'Fresh & Groceries', value: 'Beauty & Toys' },
    { label: 'Amazon miniTV', value: 'Electronics', isHighlight: true },
    { label: 'Sell', value: 'All' },
    { label: 'Best Sellers', value: 'All', isBadge: 'HOT' },
    { label: "Today's Deals", value: 'All' },
    { label: 'Mobiles', value: 'Mobiles' },
    { label: 'Customer Service', value: 'All' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Fashion', value: 'Fashion' },
    { label: 'Home & Kitchen', value: 'Home & Kitchen' },
    { label: 'Appliances', value: 'Appliances' },
    { label: 'New Releases', value: 'All' },
    { label: 'Amazon Pay', value: 'All' }
  ];

  return (
    <nav className="bg-[#232f3e] text-white text-[13px] font-medium font-['Inter'] select-none border-b border-[#131921]">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 flex items-center justify-between h-[39px] overflow-x-auto no-scrollbar">
        
        {/* Left Category Quick Links */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {navItems.map((item) => {
            const isSelected = selectedCategory === item.value && item.value !== 'All';

            if (item.isAll) {
              return (
                <button
                  key={item.label}
                  onClick={onOpenDrawer}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm hover:outline hover:outline-1 hover:outline-white font-extrabold text-white cursor-pointer transition-all shrink-0 mr-1"
                >
                  <Menu className="w-4 h-4 stroke-[2.5]" />
                  <span>All</span>
                </button>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => onSelectCategory && onSelectCategory(item.value)}
                className={`px-2.5 py-1 rounded-sm hover:outline hover:outline-1 hover:outline-white cursor-pointer transition-all shrink-0 whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'font-black text-[#febd69] outline outline-1 outline-[#febd69]'
                    : 'text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.isBadge && (
                  <span className="bg-[#cc0c39] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {item.isBadge}
                  </span>
                )}
                {item.isHighlight && (
                  <span className="text-[#febd69] font-black text-[10px]">FREE</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Promotional Tag (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-[#febd69] pl-4 shrink-0 hover:underline cursor-pointer">
          <Zap className="w-3.5 h-3.5 fill-[#febd69]" />
          <span>Great Freedom Deals Live • Up to 70% Off</span>
        </div>

      </div>
    </nav>
  );
};

export default AmazonSubNav;
