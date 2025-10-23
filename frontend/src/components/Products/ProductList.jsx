import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Grid3X3, 
  List, 
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Sliders,
  RefreshCw,
  Package,
  DollarSign,
  Tag,
  AlertCircle,
  Loader2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Info,
  ChevronUp,
  Zap,
  Award,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Toast Component - Minimal and Elegant
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <XCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] px-5 py-3.5 rounded-xl shadow-2xl transform transition-all duration-300 ease-out ${getToastStyles()} backdrop-blur-sm bg-opacity-95 toast-slide-in flex items-center space-x-3 max-w-md`}>
      {getIcon()}
      <p className="font-medium text-sm">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

// Toast Manager Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    minPrice: '',
    maxPrice: '',
    search: '',
  });
  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Search suggestions state
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  const { addToWishlist, removeFromWishlist, wishlist, addToCart: authAddToCart } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const API_BASE = `${process.env.REACT_APP_API_URL}/api/products`;

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item._id === productId || item.product === productId);
  }, [wishlist]);

  // Scroll event listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load search history
  useEffect(() => {
    const savedRecentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedRecentSearches);
    setPopularSearches(['iPhone', 'Samsung Galaxy', 'MacBook', 'Gaming Laptop', 'Wireless Headphones', 'Smart Watch']);
  }, []);

  // Save search to history
  const saveSearchToHistory = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return;
    const updatedRecent = [searchTerm, ...recentSearches.filter(term => term !== searchTerm)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
  }, [recentSearches]);

  // Serialize filters
  const serializeFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category.length > 0) filters.category.forEach(cat => params.append('category', cat));
    if (filters.brand.length > 0) filters.brand.forEach(brand => params.append('brand', brand));
    if (filters.minPrice && Number(filters.minPrice) >= 0) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice && Number(filters.maxPrice) > 0) params.append('maxPrice', filters.maxPrice);
    if (filters.search.trim()) params.append('search', filters.search.trim());
    params.append('sort', sortBy);
    params.append('page', currentPage);
    params.append('limit', 12);
    return params.toString();
  }, [filters, sortBy, currentPage]);

  // Fetch search suggestions
  const fetchSearchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchLoading(true);
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = serializeFilters();
      const response = await fetch(`${API_BASE}?${query}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [serializeFilters]);

  // Fetch filters
  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const response = await fetch(`${API_BASE}/filters`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setPriceRange(data.priceRange || { min: 0, max: 5000 });
    } catch (error) {
      console.error('Error fetching filters:', error);
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && suggestionsRef.current && 
          !searchRef.current.contains(event.target) && 
          !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effects
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchFilters(); }, [fetchFilters]);
  useEffect(() => {
    if (debouncedSearchTerm !== undefined && debouncedSearchTerm !== filters.search) {
      setFilters(prev => ({ ...prev, search: debouncedSearchTerm }));
      if (currentPage !== 1) setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    fetchSearchSuggestions(filters.search);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [filters.search, fetchSearchSuggestions]);

  // Event handlers
  const handleCheckboxChange = useCallback((e) => {
    const { name, value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: checked ? [...prev[name], value] : prev[name].filter(item => item !== value)
    }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    setShowSuggestions(value.length >= 2 || (value.length === 0 && recentSearches.length > 0));
  }, [recentSearches.length]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
    saveSearchToHistory(suggestion);
    setCurrentPage(1);
  }, [saveSearchToHistory]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (filters.search.trim()) {
      saveSearchToHistory(filters.search.trim());
      setShowSuggestions(false);
      fetchProducts();
    }
  }, [filters.search, saveSearchToHistory, fetchProducts]);

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
    setShowSuggestions(false);
  }, []);

  const handlePriceChange = useCallback((type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: [], brand: [], minPrice: '', maxPrice: '', search: '' });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Wishlist toggle - ONLY SHOW TOAST HERE
  const toggleWishlist = useCallback(async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        showToast('error', 'Please login to manage your wishlist');
        return;
      }

      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        showToast('success', 'Removed from wishlist');
      } else {
        await addToWishlist(productId);
        showToast('success', 'Added to wishlist');
      }
    } catch (error) {
      showToast('error', 'Failed to update wishlist');
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist, showToast]);

  const viewProductDetails = useCallback((productId) => {
    window.location.href = `/product/${productId}`;
  }, []);

  // Add to cart - ONLY SHOW TOAST HERE
  const addToCart = useCallback(async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        showToast('error', 'Please login to add items to cart');
        return;
      }

      if (authAddToCart) {
        await authAddToCart(productId, 1);
        showToast('success', 'Added to cart successfully');
      } else {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId, quantity: 1 })
        });

        if (response.ok) {
          showToast('success', 'Added to cart successfully');
        } else {
          throw new Error('Failed to add to cart');
        }
      }
    } catch (error) {
      showToast('error', 'Failed to add to cart');
    }
  }, [authAddToCart, showToast]);

  const renderStars = useCallback((rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1.5 font-medium">({rating.toFixed(1)})</span>
      </div>
    );
  }, []);

  // Enhanced Search Component
  const EnhancedSearchWithSuggestions = () => (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(filters.search.length >= 2 || recentSearches.length > 0)}
          className="w-full pl-11 pr-11 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md text-sm"
          placeholder="Search products, brands, categories..."
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        {filters.search && (
          <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
        {searchLoading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500" size={18} />
        )}
      </form>
      
      {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
        <div ref={suggestionsRef} className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-2xl mt-2 shadow-2xl z-50 max-h-80 overflow-y-auto suggestions-dropdown">
          <div className="p-2">
            {searchSuggestions.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  <TrendingUp size={14} />
                  <span>Suggestions</span>
                </div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}
                    type="button"
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-xl transition-colors flex items-center space-x-3 text-sm group"
                  >
                    <Search size={14} className="text-gray-400 group-hover:text-blue-500" />
                    <span className="flex-1">{suggestion}</span>
                    <ArrowUpRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    <Clock size={14} />
                    <span>Recent</span>
                  </div>
                  <button onClick={() => { setRecentSearches([]); localStorage.removeItem('recentSearches'); }} type="button" className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={(e) => { e.preventDefault(); handleSuggestionClick(search); }}
                    type="button"
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors flex items-center space-x-3 text-sm group"
                  >
                    <Clock size={14} className="text-gray-400" />
                    <span className="flex-1 text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Filter Sidebar
  const FilterSidebar = () => (
    <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent' : 'hidden lg:block'} lg:w-80`}>
      <div className={`${showFilters ? 'fixed right-0 top-0 h-full w-80 transform transition-transform' : ''} bg-white h-full overflow-y-auto shadow-xl rounded-3xl lg:sticky lg:top-4`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Sliders className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
          </div>
          {showFilters && (
            <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 hover:bg-white rounded-full transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <Search size={18} />
              <h4>Search Products</h4>
            </div>
            <EnhancedSearchWithSuggestions />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <DollarSign size={18} />
              <h4>Price Range</h4>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block font-medium">Min ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block font-medium">Max ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    placeholder={priceRange.max}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <Tag size={18} />
              <h4>Categories</h4>
            </div>
            {filtersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center space-x-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      name="category"
                      value={cat}
                      checked={filters.category.includes(cat)}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <Package size={18} />
              <h4>Brands</h4>
            </div>
            {filtersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center space-x-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      name="brand"
                      value={brand}
                      checked={filters.brand.includes(brand)}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <RefreshCw size={18} />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-[9999] space-y-2 p-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Discover Products</h1>
              <p className="text-gray-600 mt-1">Explore our curated collection of premium products</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-3 shadow-md">
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-red-700 font-medium flex-1">{error}</span>
            <button onClick={fetchProducts} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Mobile Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center justify-center space-x-2 px-5 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <Filter size={20} />
            <span className="font-semibold">Filters</span>
            {(filters.category.length > 0 || filters.brand.length > 0 || filters.minPrice || filters.maxPrice || filters.search) && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {filters.category.length + filters.brand.length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.search ? 1 : 0)}
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white rounded-2xl shadow-md border-2 border-gray-200 focus:outline-none focus:border-blue-500 font-medium text-sm min-w-[180px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="flex bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <FilterSidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">Loading amazing products...</p>
                  <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl shadow-lg">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="text-gray-400" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-5 bg-white rounded-2xl shadow-md border-2 border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <p className="text-gray-700 font-medium">
                      Showing <span className="font-bold text-blue-600">{products.length}</span> of{' '}
                      <span className="font-bold text-blue-600">{totalProducts}</span> products
                    </p>
                    {(filters.category.length > 0 || filters.brand.length > 0 || filters.minPrice || filters.maxPrice || filters.search) && (
                      <div className="flex flex-wrap gap-2">
                        {filters.search && (
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold flex items-center space-x-1">
                            <Search size={12} />
                            <span>{filters.search}</span>
                          </span>
                        )}
                        {filters.category.map(cat => (
                          <span key={cat} className="px-3 py-1.5 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                            {cat}
                          </span>
                        ))}
                        {filters.brand.map(brand => (
                          <span key={brand} className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs rounded-full font-semibold">
                            {brand}
                          </span>
                        ))}
                        {(filters.minPrice || filters.maxPrice) && (
                          <span className="px-3 py-1.5 bg-orange-100 text-orange-800 text-xs rounded-full font-semibold">
                            ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-xl">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>

                {/* Product Grid/List */}
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className={`group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-gray-100 hover:border-blue-200 ${viewMode === 'list' ? 'flex items-center p-5' : ''}`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'w-full h-56'} overflow-hidden ${viewMode === 'grid' ? 'rounded-t-3xl' : 'rounded-2xl'} bg-gradient-to-br from-gray-50 to-gray-100`}>
                        <img
                          src={product.image || product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                        />
                        
                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className={`absolute z-10 top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                            isInWishlist(product._id)
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white shadow-md'
                          }`}
                        >
                          <Heart size={18} className={isInWishlist(product._id) ? 'fill-current' : ''} />
                        </button>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => viewProductDetails(product._id)}
                              className="p-3 bg-white rounded-xl text-gray-800 hover:bg-blue-600 hover:text-white transition-all shadow-lg transform hover:scale-110"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => addToCart(product._id)}
                              className="p-3 bg-white rounded-xl text-gray-800 hover:bg-green-600 hover:text-white transition-all shadow-lg transform hover:scale-110"
                              title="Add to Cart"
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Stock Badges */}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-xl font-bold shadow-lg flex items-center space-x-1">
                            <Zap size={12} />
                            <span>Only {product.stock} left</span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-xl font-bold shadow-lg">
                            Out of Stock
                          </div>
                        )}
                       
                      </div>

                      <div className={`${viewMode === 'list' ? 'ml-5 flex-1' : 'p-5'}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2.5 py-1 rounded-lg font-bold whitespace-nowrap">
                              {product.brand}
                            </span>
                          )}
                        </div>

                        {product.category && (
                          <span className="inline-block text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-lg font-medium mb-2">
                            {product.category}
                          </span>
                        )}

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {product.description || 'Premium quality product with excellent features'}
                        </p>

                        {product.rating && (
                          <div className="mb-3">
                            {renderStars(product.rating)}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ${product.price}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <>
                                  <span className="text-sm text-gray-400 line-through">
                                    ${product.originalPrice}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1 font-medium">
                              Stock: {product.stock} units
                            </span>
                          </div>
                        </div>

                        {/* List View Action Buttons */}
                        {viewMode === 'list' && (
                          <div className="flex items-center space-x-3 mt-4">
                            <button
                              onClick={() => viewProductDetails(product._id)}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => addToCart(product._id)}
                              disabled={product.stock === 0}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                              <ShoppingCart size={16} />
                              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center">
                    <div className="flex items-center space-x-2 bg-white rounded-2xl shadow-xl p-3 border-2 border-gray-100">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 rounded-xl font-semibold transition-all text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            1
                          </button>
                          {currentPage > 4 && <span className="px-2 text-gray-400 font-bold">...</span>}
                        </>
                      )}

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isInRange = pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2;
                        if (!isInRange) return null;
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                              currentPage === pageNumber
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <span className="px-2 text-gray-400 font-bold">...</span>}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 rounded-xl font-semibold transition-all text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Count Summary */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 font-medium bg-white px-6 py-3 rounded-2xl shadow-md inline-block">
                    Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalProducts)} of {totalProducts} total products
                  </p>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Enhanced Quick Stats */}
        {!loading && products.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <Package size={32} className="opacity-80" />
                <Award size={24} className="opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">{totalProducts}</div>
              <div className="text-blue-100 text-sm font-medium">Total Products</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <Tag size={32} className="opacity-80" />
                <Zap size={24} className="opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">{categories.length}</div>
              <div className="text-green-100 text-sm font-medium">Categories</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <Award size={32} className="opacity-80" />
                <Star size={24} className="opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">{brands.length}</div>
              <div className="text-purple-100 text-sm font-medium">Brands</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <Heart size={32} className="opacity-80" />
                <Star size={24} className="opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">{wishlist.length}</div>
              <div className="text-pink-100 text-sm font-medium">Favorites</div>
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-110 z-40 animate-bounce-slow"
            title="Back to Top"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .group {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .suggestions-dropdown {
          animation: slideDown 0.2s ease-out;
        }

        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .toast-slide-in {
          animation: toast-slide-in 0.3s ease-out;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
      `}</style>
    </div>
  );
};

export default ProductList;