import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import CategoryNav from '../components/CategoryNav';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { initialProducts, initialCategories } from '../data/mockData';
import { Zap, Sparkles, Search, SlidersHorizontal, Package, RefreshCw } from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  // State Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating-desc'
  const [priceRange, setPriceRange] = useState(200000);
  const [selectedBrand, setSelectedBrand] = useState('');

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
      let allProducts = (res.success && res.products && res.products.length) ? res.products : initialProducts;

      // Try fetching live items from Clover Sandbox API
      try {
        const cloverRes = await api.getCloverLiveProducts();
        if (cloverRes.success && cloverRes.products && cloverRes.products.length > 0) {
          const existingIds = new Set(allProducts.map(p => p.id || p._id));
          const cloverProducts = cloverRes.products.filter(p => !existingIds.has(p.id));
          allProducts = [...cloverProducts, ...allProducts];
        }
      } catch (ce) {
        // Clover offline or fallback
      }

      setProducts(allProducts);
    } catch (error) {
      console.log('Using local catalog dataset');
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceRange(200000);
    setSelectedBrand('');
    setSearchParams({});
  };

  // Smooth State Filtering Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Price Range
    if (priceRange) {
      result = result.filter(p => p.price <= Number(priceRange));
    }

    // 4. Brand
    if (selectedBrand) {
      result = result.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 5. Price & Rating Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, selectedBrand, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 font-['Inter']">
      
      {/* Top Category Pills Nav */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Hero Promotional Banner Slider */}
      <BannerCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Main Search & Control Bar (Mobile & Desktop) */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, model, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-sm font-medium pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort Catalog:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 text-slate-900 text-xs font-bold px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 cursor-pointer"
            >
              <option value="featured">✨ Featured Deals</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💰 Price: High to Low</option>
              <option value="rating-desc">⭐ Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Catalog Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              {selectedCategory === 'All' ? 'NexusCart Marketplace Catalog' : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Showing {filteredAndSortedProducts.length} verified products available for instant dispatch
            </p>
          </div>
        </div>

        {/* Main Grid Layout: Sidebar & Products */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filter Sidebar Container */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            onResetFilters={handleResetFilters}
          />

          {/* Product Grid Area */}
          <main className="flex-1 w-full">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-md mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-600 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">No Matching Products Found</h3>
                <p className="text-xs text-slate-500 font-medium">
                  We couldn't find any products matching your active filters or search terms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Catalog Filters
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
