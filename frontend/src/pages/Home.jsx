import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import CategoryNav from '../components/CategoryNav';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { initialProducts, initialCategories } from '../data/mockData';
import { Zap, Sparkles, ShoppingBag } from 'lucide-react';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedBrand, maxPrice, searchFromUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await api.getCategories();
      if (catRes.success && catRes.categories) setCategories(catRes.categories);

      const prodRes = await api.getProducts({
        category: selectedCategory,
        brand: selectedBrand,
        maxPrice: maxPrice,
        search: searchFromUrl
      });
      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }
    } catch (error) {
      let filtered = [...initialProducts];
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (selectedBrand) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= maxPrice);
      }
      if (searchFromUrl) {
        filtered = filtered.filter(p =>
          (p.name && p.name.toLowerCase().includes(searchFromUrl.toLowerCase())) ||
          (p.title && p.title.toLowerCase().includes(searchFromUrl.toLowerCase()))
        );
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('');
    setMaxPrice(200000);
  };

  const dealProducts = products.filter(p => p.isDealOfTheDay);

  return (
    <div>
      {/* Hero Banner Carousel */}
      <BannerCarousel />

      <div className="section-container">
        {/* Category Icons Row */}
        <div style={{ marginTop: '1.5rem' }}>
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Lightning Deals Section */}
        {dealProducts.length > 0 && selectedCategory === 'All' && !searchFromUrl && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="section-header">
              <h2 className="section-title">
                <Zap size={22} color="#dc2626" fill="#dc2626" /> Amazon & Flipkart Lightning Deals
              </h2>
              <div className="deal-timer">Ends in 03h 45m 10s</div>
            </div>

            <div className="products-grid">
              {dealProducts.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Main Products Grid with Filter Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            onResetFilters={handleResetFilters}
          />

          <div>
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles size={20} color="#2874f0" />
                {selectedCategory === 'All' ? 'Explore Product Catalog' : `${selectedCategory} Store`}
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500', marginLeft: '0.5rem' }}>
                  ({products.length} items found)
                </span>
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading products...</div>
            ) : products.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products found</h3>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>Try clearing your search query or price filters.</p>
                <button className="btn-primary" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
