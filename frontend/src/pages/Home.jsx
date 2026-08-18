import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import CategoryNav from '../components/CategoryNav';
import NeumorphicCategoryShowcase from '../components/NeumorphicCategoryShowcase';
import NeumorphicDealRow from '../components/NeumorphicDealRow';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { fetchLiveMarketStoreProducts } from '../services/liveMarketService';
import { initialCategories } from '../data/mockData';
import {
  Zap,
  Search,
  SlidersHorizontal,
  Package,
  RefreshCw,
  Loader2,
  X,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);

  // State Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'discount-desc' | 'name-asc'
  const [priceRange, setPriceRange] = useState(250000);
  const [minPrice, setMinPrice] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Mobile Filter Drawer Toggle State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const catFromUrl = searchParams.get('category');
    if (searchFromUrl !== null) setSearchQuery(searchFromUrl);
    if (catFromUrl !== null) setSelectedCategory(catFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      if (res.success && res.products && res.products.length > 0) {
        setProducts(res.products);
      } else {
        const liveMarketRes = await fetchLiveMarketStoreProducts();
        if (liveMarketRes.success && liveMarketRes.products) {
          setProducts(liveMarketRes.products);
        }
      }
    } catch (error) {
      console.warn('Catalog loaded via live market fallback');
      const liveMarketRes = await fetchLiveMarketStoreProducts();
      if (liveMarketRes.success && liveMarketRes.products) {
        setProducts(liveMarketRes.products);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setSelectedBrands([]);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceRange(250000);
    setMinPrice(0);
    setSelectedBrands([]);
    setSelectedDiscount(0);
    setDealsOnly(false);
    setInStockOnly(false);
    setSearchParams({});
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

  const isCategoryMatching = (productCategory, filterCategory) => {
    if (!filterCategory || filterCategory === 'All') return true;
    const prodNorm = normalizeCat(productCategory);
    const filterNorm = normalizeCat(filterCategory);
    return prodNorm.toLowerCase() === filterNorm.toLowerCase();
  };

  // Total active filter counter
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== 'All') count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange < 250000 || minPrice > 0) count++;
    if (selectedDiscount > 0) count++;
    if (dealsOnly) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, selectedBrands, priceRange, minPrice, selectedDiscount, dealsOnly, inStockOnly]);

  // Robust Multitier Filtering & Sorting Engine (Strict AND Logic)
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search Query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter (Strict exact matching)
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => isCategoryMatching(p.category, selectedCategory));
    }

    // 3. Price Range (Min and Max)
    if (minPrice > 0) {
      result = result.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (priceRange && priceRange < 250000) {
      result = result.filter(p => Number(p.price) <= Number(priceRange));
    }

    // 4. Multiple Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const pBrand = (p.brand || '').toLowerCase().trim();
        const pTitle = (p.title || p.name || '').toLowerCase();
        return selectedBrands.some(b => {
          const brandLower = b.toLowerCase().trim();
          return pBrand === brandLower || pTitle.includes(brandLower);
        });
      });
    }

    // 5. Discount % Filter
    if (selectedDiscount > 0) {
      result = result.filter(p => {
        const disc = p.discountPercentage ||
          (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0);
        return disc >= selectedDiscount;
      });
    }

    // 6. Deals Only
    if (dealsOnly) {
      result = result.filter(p =>
        p.isDealOfTheDay ||
        p.isFeatured ||
        (p.discountPercentage && p.discountPercentage >= 15)
      );
    }

    // 7. In Stock Only
    if (inStockOnly) {
      result = result.filter(p => p.stock === undefined || p.stock > 0);
    }

    // 8. Comprehensive Sorting Algorithm
    if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'discount-desc') {
      const getDisc = (p) => p.discountPercentage || (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0);
      result.sort((a, b) => getDisc(b) - getDisc(a));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    } else {
      // 'featured' sort
      result.sort((a, b) => {
        const scoreA = (a.isDealOfTheDay ? 2 : 0) + (a.isFeatured ? 1 : 0) + (Number(a.rating) || 0) * 0.2;
        const scoreB = (b.isDealOfTheDay ? 2 : 0) + (b.isFeatured ? 1 : 0) + (Number(b.rating) || 0) * 0.2;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, minPrice, selectedBrands, selectedDiscount, dealsOnly, inStockOnly, sortBy]);

  // Slices for Category showcases
  const mobileProducts = useMemo(() => products.filter(p => isCategoryMatching(p.category, 'Mobiles')), [products]);
  const electronicProducts = useMemo(() => products.filter(p => isCategoryMatching(p.category, 'Electronics')), [products]);
  const fashionProducts = useMemo(() => products.filter(p => isCategoryMatching(p.category, 'Fashion')), [products]);

  return (
    <div className="min-h-screen neu-bg pb-16 font-['Inter']">
      
      {/* 1. Top Category Pills Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* 2. Hero Promotional Banner Carousel */}
      <BannerCarousel />

      {/* 3. Amazon-Style 4-in-1 Category Showcases (Styled in Neumorphic Soft-UI) */}
      <NeumorphicCategoryShowcase onSelectCategory={handleCategorySelect} />

      {/* 4. Flash Deals & Flagship Scroller */}
      {products.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <NeumorphicDealRow
          title="⚡ Flash Deals of the Day"
          subtitle="Special limited-time offers with instant dispatch & full warranty"
          linkText="Explore All Deals"
          categoryFilter="All"
          products={products}
          onSelectCategory={handleCategorySelect}
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
          onSelectCategory={handleCategorySelect}
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
          onSelectCategory={handleCategorySelect}
        />
      )}

      {/* 7. Main Catalog Section with Refine Sidebar & Grid */}
      <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search & Sort Bar */}
        <div className="neu-card p-4 md:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, model, brand, or specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full neu-input text-slate-900 text-sm font-medium pl-10 pr-10 py-3 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden neu-btn text-slate-800 text-xs font-black px-4 py-3 flex items-center gap-2 cursor-pointer relative"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Refine Catalog</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-black text-slate-500 uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="neu-btn text-slate-800 text-xs font-extrabold px-3.5 py-3 outline-none cursor-pointer"
              >
                <option value="featured">✨ Featured & Deals</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💰 Price: High to Low</option>
                <option value="rating-desc">⭐ Highest Customer Rating</option>
                <option value="discount-desc">🔥 Biggest Discount %</option>
                <option value="name-asc">🔤 Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Header Title & Results Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              {selectedCategory === 'All' ? 'NexusCart Verified Catalog' : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-extrabold">{filteredAndSortedProducts.length}</span> of {products.length} live verified items
            </p>
          </div>

          {/* Quick Active Filter Badges Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="neu-card-inset text-amber-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  {selectedCategory}
                  <X className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => handleCategorySelect('All')} />
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

        {/* Main Grid Layout: Sidebar & Products */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filter Sidebar Container */}
          <div className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 shrink-0`}>
            <FilterSidebar
              allProducts={products}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
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
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <main className="flex-1 w-full">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Home;
