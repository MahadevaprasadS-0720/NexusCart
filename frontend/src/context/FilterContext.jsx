import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { fetchLiveMarketStoreProducts } from '../services/liveMarketService';
import { initialCategories } from '../data/mockData';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(250000);
  const [minPrice, setMinPrice] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter Drawer / Modal State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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
  };

  // Helper to normalize category matching
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

  // Active filter counter
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

  // Multitier Filter & Sorting Algorithm
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
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

    // 2. Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => isCategoryMatching(p.category, selectedCategory));
    }

    // 3. Price
    if (minPrice > 0) {
      result = result.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (priceRange && priceRange < 250000) {
      result = result.filter(p => Number(p.price) <= Number(priceRange));
    }

    // 4. Brands
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

    // 5. Discount
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

    // 7. In Stock
    if (inStockOnly) {
      result = result.filter(p => p.stock === undefined || p.stock > 0);
    }

    // 8. Sorting
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
      result.sort((a, b) => {
        const scoreA = (a.isDealOfTheDay ? 2 : 0) + (a.isFeatured ? 1 : 0) + (Number(a.rating) || 0) * 0.2;
        const scoreB = (b.isDealOfTheDay ? 2 : 0) + (b.isFeatured ? 1 : 0) + (Number(b.rating) || 0) * 0.2;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, minPrice, selectedBrands, selectedDiscount, dealsOnly, inStockOnly, sortBy]);

  const value = {
    products,
    categories,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory: handleCategorySelect,
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
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
