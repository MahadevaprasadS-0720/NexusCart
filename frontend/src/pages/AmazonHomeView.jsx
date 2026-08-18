import React from 'react';
import AmazonHeroBanner from '../components/amazon/AmazonHeroBanner';
import AmazonCategoryCards from '../components/amazon/AmazonCategoryCards';
import AmazonProductRow from '../components/amazon/AmazonProductRow';
import AmazonProductCard from '../components/amazon/AmazonProductCard';
import { Sparkles, Zap, Package, RefreshCw, Loader2 } from 'lucide-react';

const AmazonHomeView = ({
  products = [],
  loading = false,
  selectedCategory = 'All',
  onSelectCategory,
  searchQuery = '',
  onResetFilters
}) => {
  // Product slices for deal shelves
  const mobileProducts = products.filter(
    (p) => (p.category || '').toLowerCase().includes('mobile') || (p.category || '').toLowerCase().includes('phone')
  );
  const electronicProducts = products.filter(
    (p) => (p.category || '').toLowerCase().includes('electronic') || (p.category || '').toLowerCase().includes('laptop')
  );
  const fashionProducts = products.filter(
    (p) => (p.category || '').toLowerCase().includes('fashion') || (p.category || '').toLowerCase().includes('dress')
  );
  const homeProducts = products.filter(
    (p) => (p.category || '').toLowerCase().includes('home') || (p.category || '').toLowerCase().includes('kitchen')
  );

  return (
    <div className="bg-[#e3e6e6] min-h-screen pb-16 font-['Inter']">
      
      {/* 1. Hero Promo Slider (Full-Width) */}
      <AmazonHeroBanner />

      {/* 2. Overlapping 4-in-1 Category Cards */}
      <AmazonCategoryCards onSelectCategory={onSelectCategory} />

      {/* 3. Today's Deals Horizontal Carousel */}
      {products.length > 0 && (
        <AmazonProductRow
          title="Today's Deals"
          subtitle="Top offers refreshed daily with Prime Fast Delivery"
          linkText="See all deals"
          categoryFilter="All"
          products={products}
          onSelectCategory={onSelectCategory}
        />
      )}

      {/* 4. Blockbuster Deals on Mobiles */}
      {mobileProducts.length > 0 && (
        <AmazonProductRow
          title="Blockbuster Deals in Smartphones & Mobiles"
          subtitle="Latest 5G Phones with Exchange Offers & No Cost EMI"
          linkText="Explore Mobiles"
          categoryFilter="Mobiles"
          products={mobileProducts}
          onSelectCategory={onSelectCategory}
        />
      )}

      {/* 5. Electronics & Audio Bestsellers */}
      {electronicProducts.length > 0 && (
        <AmazonProductRow
          title="Best Sellers in Computers & Audio Accessories"
          subtitle="MacBooks, Noise Canceling Headphones & Smart Gadgets"
          linkText="Explore Electronics"
          categoryFilter="Electronics"
          products={electronicProducts}
          onSelectCategory={onSelectCategory}
        />
      )}

      {/* 6. Trending Fashion & Lifestyle */}
      {fashionProducts.length > 0 && (
        <AmazonProductRow
          title="Up to 60% Off | Trending Fashion, Shoes & Watches"
          subtitle="Top styles from Nike, Ray-Ban, Zara & Calvin Klein"
          linkText="Explore Fashion"
          categoryFilter="Fashion"
          products={fashionProducts}
          onSelectCategory={onSelectCategory}
        />
      )}

      {/* 7. Comprehensive Catalog Grid */}
      <div className="max-w-[1500px] mx-auto px-4 my-8">
        
        {/* Category Header */}
        <div className="bg-white p-4 mb-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {selectedCategory === 'All' ? 'Results in All Categories' : `Results in ${selectedCategory}`}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Price and other details may vary based on product size and color.
            </p>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory && onSelectCategory('All')}
              className="text-xs font-bold text-[#007185] hover:underline cursor-pointer"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white p-16 text-center space-y-4 shadow-sm border border-slate-200 max-w-lg mx-auto my-8">
            <Loader2 className="w-10 h-10 text-[#f3a847] animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Loading Amazon.in Catalog...</h3>
            <p className="text-xs text-slate-500">
              Retrieving verified live pricing, fast Prime shipping & stock data.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 text-center space-y-4 shadow-sm border border-slate-200 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Matching Results Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any products matching your search terms or active category.
            </p>
            <button
              onClick={onResetFilters}
              className="px-5 py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full text-xs font-black text-slate-900 shadow-sm cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <AmazonProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default AmazonHomeView;
