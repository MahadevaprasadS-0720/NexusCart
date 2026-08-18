import React, { useMemo } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import CategoryNav from '../components/CategoryNav';
import NeumorphicCategoryShowcase from '../components/NeumorphicCategoryShowcase';
import NeumorphicDealRow from '../components/NeumorphicDealRow';
import FilterDrawerModal from '../components/FilterDrawerModal';
import ProductCard from '../components/ProductCard';
import { useFilters } from '../context/FilterContext';
import {
  Zap,
  Package,
  RefreshCw,
  Loader2,
  X
} from 'lucide-react';

const Home = () => {
  const {
    products,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minPrice,
    setMinPrice,
    selectedBrands,
    handleBrandToggle,
    setSelectedBrands,
    selectedDiscount,
    setSelectedDiscount,
    dealsOnly,
    setDealsOnly,
    inStockOnly,
    setInStockOnly,
    activeFiltersCount,
    handleResetFilters,
    filteredAndSortedProducts,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen
  } = useFilters();

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

  const isCategoryMatching = (productCategory, filterCategory) => {
    if (!filterCategory || filterCategory === 'All') return true;
    const prodNorm = normalizeCat(productCategory);
    const filterNorm = normalizeCat(filterCategory);
    return prodNorm.toLowerCase() === filterNorm.toLowerCase();
  };

  // Slices for Category showcases
  const mobileProducts = useMemo(() => products.filter(p => isCategoryMatching(p.category, 'Mobiles')), [products]);
  const electronicProducts = useMemo(() => products.filter(p => isCategoryMatching(p.category, 'Electronics')), [products]);
  const fashionProducts = useMemo(() => products.filter(p => isCategoryMatching(p.category, 'Fashion')), [products]);

  return (
    <div className="min-h-screen neu-bg pb-16 font-['Inter'] w-full">
      
      {/* 1. Top Category Pills Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeFiltersCount={activeFiltersCount}
        onOpenFilter={() => setIsFilterDrawerOpen(true)}
        isFilterOpen={isFilterDrawerOpen}
      />

      {/* Slide-in Interactive Refine Catalog Drawer Modal (opened from top navbar "Filters" button or tab) */}
      <FilterDrawerModal
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        allProducts={products}
        filteredCount={filteredAndSortedProducts.length}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        selectedBrands={selectedBrands}
        onBrandToggle={handleBrandToggle}
        onClearBrands={() => setSelectedBrands([])}
        selectedDiscount={selectedDiscount}
        onDiscountChange={setSelectedDiscount}
        dealsOnly={dealsOnly}
        onDealsOnlyChange={setDealsOnly}
        inStockOnly={inStockOnly}
        onInStockOnlyChange={setInStockOnly}
        activeFiltersCount={activeFiltersCount}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Hero Promotional Banner Carousel */}
      <BannerCarousel />

      {/* 3. Amazon-Style 4-in-1 Category Showcases */}
      <NeumorphicCategoryShowcase onSelectCategory={setSelectedCategory} />

      {/* 4. Flash Deals & Flagship Scroller */}
      {products.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <NeumorphicDealRow
          title="⚡ Flash Deals of the Day"
          subtitle="Special limited-time offers with instant dispatch & full warranty"
          linkText="Explore All Deals"
          categoryFilter="All"
          products={products}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* 5. Blockbuster Smartphones Scroller */}
      {mobileProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <NeumorphicDealRow
          title="📱 Blockbuster Deals in Mobiles & 5G Flagships"
          subtitle="Apple iPhone 15 Pro, Samsung Galaxy S24 Ultra & Top Brands"
          linkText="View All Mobiles"
          categoryFilter="Mobiles"
          products={mobileProducts}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* 6. Electronics & Audio Bestsellers Scroller */}
      {electronicProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <NeumorphicDealRow
          title="🎧 Best Sellers in Electronics, Laptops & Audio"
          subtitle="MacBook Air M2, Sony Noise Canceling Headphones & High-Res Audio"
          linkText="View All Electronics"
          categoryFilter="Electronics"
          products={electronicProducts}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* 7. Main Catalog Section - 100% Full-Screen Edge-to-Edge 5-Columns Grid */}
      <div id="catalog-section" className="w-full px-4 sm:px-6 lg:px-10 pt-6">
        
        {/* Catalog Header Title & Results Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              {selectedCategory === 'All' ? 'NexusCart Verified Catalog' : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-extrabold">{filteredAndSortedProducts.length}</span> of {products.length} live verified items
              {searchQuery && (
                <span className="text-amber-600 font-bold ml-1">
                  for "{searchQuery}"
                </span>
              )}
            </p>
          </div>

          {/* Quick Active Filter Badges Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="neu-card-inset text-amber-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  {selectedCategory}
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedBrands.map(b => (
                <span key={b} className="neu-card-inset text-purple-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  {b}
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => handleBrandToggle(b)} />
                </span>
              ))}
              {(priceRange < 250000 || minPrice > 0) && (
                <span className="neu-card-inset text-emerald-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  ₹{Number(minPrice).toLocaleString('en-IN')} - ₹{Number(priceRange).toLocaleString('en-IN')}
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => { setMinPrice(0); setPriceRange(250000); }} />
                </span>
              )}
              {selectedDiscount > 0 && (
                <span className="neu-card-inset text-orange-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  {selectedDiscount}%+ Off
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setSelectedDiscount(0)} />
                </span>
              )}
              {dealsOnly && (
                <span className="neu-card-inset text-red-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  Deals Only
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setDealsOnly(false)} />
                </span>
              )}
              {inStockOnly && (
                <span className="neu-card-inset text-blue-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  In Stock
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => setInStockOnly(false)} />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer ml-1"
              >
                Clear All ({activeFiltersCount})
              </button>
            </div>
          )}
        </div>

        {/* 100% Full-Width Product Grid - Exactly 5 Columns */}
        <main className="w-full">
          {loading ? (
            <div className="neu-card rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto my-8">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <h3 className="text-lg font-black text-slate-900">Loading Live Product Catalog...</h3>
              <p className="text-xs text-slate-500 font-semibold">
                Streaming 150+ real-time e-commerce products with live pricing and verified details.
              </p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="neu-card rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl neu-card-inset text-amber-600 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No Matching Products Found</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                We couldn't find any products matching your active filters or search terms. Try adjusting your budget or category.
              </p>
              <button
                onClick={handleResetFilters}
                className="neu-btn-primary inline-flex items-center gap-2 text-white font-black text-xs px-5 py-3 rounded-2xl transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Reset All Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Home;
