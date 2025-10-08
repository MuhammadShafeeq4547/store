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
  SortAsc,
  SortDesc,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Toast Component
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-[9999] p-4 border rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out ${getToastStyles()}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
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

  return {
    toasts,
    showToast,
    removeToast
  };
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
  
  // Enhanced search suggestions state
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  let { addToWishlist, removeFromWishlist, wishlist, addToCart: authAddToCart } = useAuth();
  
  // Toast functionality
  const { toasts, showToast, removeToast } = useToast();

  // API Base URL
  const API_BASE = `${process.env.REACT_APP_API_URL}/api/products`;

  // Custom debounce hook with proper cleanup
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item._id === productId || item.product === productId);
  }, [wishlist]);

  // Load search history from localStorage
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const savedRecentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setSearchHistory(savedSearches);
    setRecentSearches(savedRecentSearches);
    
    // Set some popular searches
    setPopularSearches([
      'iPhone', 'Samsung Galaxy', 'MacBook', 'Gaming Laptop', 
      'Wireless Headphones', 'Smart Watch', 'Nike Shoes', 'Adidas'
    ]);
  }, []);

  // Save search to history
  const saveSearchToHistory = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const updatedHistory = [searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 10);
    const updatedRecent = [searchTerm, ...recentSearches.filter(term => term !== searchTerm)].slice(0, 5);
    
    setSearchHistory(updatedHistory);
    setRecentSearches(updatedRecent);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
  }, [searchHistory, recentSearches]);

  // Serialize filters for API call
  const serializeFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.category.length > 0) {
      filters.category.forEach(cat => params.append('category', cat));
    }
    if (filters.brand.length > 0) {
      filters.brand.forEach(brand => params.append('brand', brand));
    }
    
    if (filters.minPrice && filters.minPrice !== '' && Number(filters.minPrice) >= 0) {
      params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice && filters.maxPrice !== '' && Number(filters.maxPrice) > 0) {
      params.append('maxPrice', filters.maxPrice);
    }
    
    if (filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    
    params.append('sort', sortBy);
    params.append('page', currentPage);
    params.append('limit', 12);
    
    return params.toString();
  }, [filters, sortBy, currentPage]);

  // Enhanced fetch search suggestions with debouncing
  const fetchSearchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchLoading(true);
    
    // Add debouncing for API calls
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          
          // Combine API suggestions with local history matches
          const apiSuggestions = data.suggestions || [];
          const historyMatches = searchHistory.filter(term => 
            term.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 3);
          
          // Remove duplicates and limit results
          const allSuggestions = [...new Set([...apiSuggestions, ...historyMatches])].slice(0, 8);
          
          setSearchSuggestions(allSuggestions);
          setShowSuggestions(allSuggestions.length > 0 || recentSearches.length > 0);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // 300ms debounce for API calls
  }, [searchHistory, recentSearches]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = serializeFilters();
      const response = await fetch(`${API_BASE}?${query}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
      showToast('error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [serializeFilters, showToast]);

  // Fetch filter options from API
  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/filters`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setCategories(data.categories || []);
      setBrands(data.brands || []);
      setPriceRange(data.priceRange || { min: 0, max: 5000 });
      
    } catch (error) {
      console.error('Error fetching filters:', error);
      setCategories([]);
      setBrands([]);
      showToast('error', 'Failed to load filter options.');
    } finally {
      setFiltersLoading(false);
    }
  }, [showToast]);

  // Click outside handler for search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        suggestionsRef.current &&
        !searchRef.current.contains(event.target) &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effects with proper dependencies
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  // Fixed debounced search effect - prevent infinite loops
  useEffect(() => {
    if (debouncedSearchTerm !== undefined && debouncedSearchTerm !== filters.search) {
      setFilters(prev => ({ ...prev, search: debouncedSearchTerm }));
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchSearchSuggestions(filters.search);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters.search, fetchSearchSuggestions]);

  // Event handlers
  const handleCheckboxChange = useCallback((e) => {
    const { name, value, checked } = e.target;
    setFilters(prev => {
      const updated = checked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value);
      return { ...prev, [name]: updated };
    });
    setCurrentPage(1);
    showToast('info', `Filter ${checked ? 'added' : 'removed'}: ${value}`);
  }, [showToast]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    
    // Don't trigger suggestions for empty or very short queries
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else if (value.length === 0 && (recentSearches.length > 0 || popularSearches.length > 0)) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [recentSearches.length, popularSearches.length]);

  const handleSuggestionClick = useCallback((suggestion) => {
    // Prevent page refresh by not triggering form submit
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
    saveSearchToHistory(suggestion);
    setCurrentPage(1);
    
    // Keep focus on search input
    if (searchRef.current && searchRef.current.querySelector('input')) {
      setTimeout(() => {
        searchRef.current.querySelector('input').focus();
      }, 100);
    }
    
    showToast('info', `Searching for: ${suggestion}`);
  }, [saveSearchToHistory, showToast]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (filters.search.trim()) {
      saveSearchToHistory(filters.search.trim());
      setShowSuggestions(false);
      showToast('info', `Searching for: ${filters.search.trim()}`);
      fetchProducts();
    }
  }, [filters.search, saveSearchToHistory, fetchProducts, showToast]);

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
    setShowSuggestions(false);
    showToast('info', 'Search cleared');
  }, [showToast]);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    setRecentSearches([]);
    localStorage.removeItem('searchHistory');
    localStorage.removeItem('recentSearches');
    showToast('info', 'Search history cleared');
  }, [showToast]);

  const handlePriceChange = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setCurrentPage(1);
    showToast('info', `Price filter updated`);
  }, [showToast]);

  const resetFilters = useCallback(() => {
    setFilters({ 
      category: [], 
      brand: [], 
      minPrice: '', 
      maxPrice: '', 
      search: '' 
    });
    setCurrentPage(1);
    showToast('success', 'All filters cleared');
  }, [showToast]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('info', `Page ${page} loaded`);
  }, [showToast]);

  // Fixed wishlist toggle function
  const toggleWishlist = useCallback(async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        showToast('error', 'Please login to manage your wishlist');
        return;
      }

      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        showToast('success', 'Product removed from wishlist');
      } else {
        await addToWishlist(productId);
        showToast('success', 'Product added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('error', 'Failed to update wishlist. Please try again.');
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist, showToast]);

  const viewProductDetails = useCallback((productId) => {
    showToast('info', 'Redirecting to product details...');
    window.location.href = `/product/${productId}`;
  }, [showToast]);

  // Fixed add to cart function
  const addToCart = useCallback(async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        showToast('error', 'Please login to add items to cart');
        return;
      }

      // Use the context's addToCart function if available
      if (authAddToCart) {
        await authAddToCart(productId, 1);
        showToast('success', 'Product added to cart successfully!');
      } else {
        // Fallback to direct API call
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
          showToast('success', 'Product added to cart successfully!');
        } else {
          throw new Error('Failed to add to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('error', 'Failed to add to cart. Please try again.');
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
            className={`${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i < rating
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  }, []);

  const EnhancedSearchWithSuggestions = () => (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          onFocus={() => {
            if (filters.search.length >= 2 && searchSuggestions.length > 0) {
              setShowSuggestions(true);
            } else if (recentSearches.length > 0 || popularSearches.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
          placeholder="Search products, brands, categories..."
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        
        {filters.search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
        
        {searchLoading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500" size={18} />
        )}
      </form>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-3">
            {/* Search Suggestions from API */}
            {searchSuggestions.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 px-2 py-2 text-xs text-gray-500 font-medium">
                  <TrendingUp size={14} />
                  <span>Suggestions</span>
                </div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionClick(suggestion);
                    }}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-3 text-sm group"
                  >
                    <Search size={14} className="text-gray-400 group-hover:text-blue-500" />
                    <span className="flex-1">{suggestion}</span>
                    <ArrowUpRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                    <Clock size={14} />
                    <span>Recent</span>
                  </div>
                  <button
                    onClick={clearSearchHistory}
                    type="button"
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionClick(search);
                    }}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3 text-sm group"
                  >
                    <Clock size={14} className="text-gray-400" />
                    <span className="flex-1 text-gray-600">{search}</span>
                    <ArrowUpRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {filters.search.length < 2 && popularSearches.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 px-2 py-2 text-xs text-gray-500 font-medium">
                  <TrendingUp size={14} />
                  <span>Popular</span>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {popularSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={`popular-${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSuggestionClick(search);
                      }}
                      type="button"
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No suggestions message */}
            {filters.search.length >= 2 && searchSuggestions.length === 0 && !searchLoading && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                <Search size={24} className="mx-auto mb-2 text-gray-300" />
                <p>No suggestions found for "{filters.search}"</p>
                <p className="text-xs text-gray-400 mt-1">Try searching for something else</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const FilterSidebar = () => (
    <aside className={`
      ${showFilters ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent' : 'hidden lg:block'}
      lg:w-80
    `}>
      <div className={`
        ${showFilters ? 'fixed right-0 top-0 h-full w-80 transform transition-transform' : ''}
        bg-white h-full overflow-y-auto shadow-xl lg:shadow-lg rounded-2xl lg:sticky lg:top-4
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
          </div>
          {showFilters && (
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Enhanced Search */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Search className="text-gray-600" size={18} />
              <h4 className="font-semibold text-gray-800">Search Products</h4>
            </div>
            <EnhancedSearchWithSuggestions />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-600" size={18} />
              <h4 className="font-semibold text-gray-800">Price Range</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Min Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Max Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={priceRange.max}
                  />
                </div>
              </div>
              {(filters.minPrice || filters.maxPrice) && (
                <div className="text-sm text-gray-600 text-center bg-blue-50 py-2 rounded-lg">
                  ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="text-gray-600" size={18} />
              <h4 className="font-semibold text-gray-800">Categories</h4>
            </div>
            {filtersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="category"
                      value={cat}
                      checked={filters.category.includes(cat)}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="text-gray-600" size={18} />
              <h4 className="font-semibold text-gray-800">Brands</h4>
            </div>
            {filtersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="brand"
                      value={brand}
                      checked={filters.brand.includes(brand)}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-[9999] space-y-2 p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Products</h1>
          <p className="text-gray-600">Find exactly what you're looking for from our curated collection</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchProducts}
              className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Mobile Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <Filter size={20} />
            <span className="font-medium">Filters</span>
            {(filters.category.length > 0 || filters.brand.length > 0 || filters.minPrice || filters.maxPrice || filters.search) && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filters.category.length + filters.brand.length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.search ? 1 : 0)}
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                showToast('info', `Sorted by: ${e.target.options[e.target.selectedIndex].text}`);
              }}
              className="px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => {
                  setViewMode('grid');
                  showToast('info', 'Grid view enabled');
                }}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => {
                  setViewMode('list');
                  showToast('info', 'List view enabled');
                }}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <FilterSidebar />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                  <p className="text-gray-600 font-medium">Loading amazing products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Package className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">
                      Showing <span className="font-semibold text-gray-800">{products.length}</span> of{' '}
                      <span className="font-semibold text-gray-800">{totalProducts}</span> products
                    </p>
                    {(filters.category.length > 0 || filters.brand.length > 0 || filters.minPrice || filters.maxPrice || filters.search) && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        <div className="flex flex-wrap gap-1">
                          {filters.search && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Search: {filters.search}
                            </span>
                          )}
                          {filters.category.map(cat => (
                            <span key={cat} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {cat}
                            </span>
                          ))}
                          {filters.brand.map(brand => (
                            <span key={brand} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {brand}
                            </span>
                          ))}
                          {(filters.minPrice || filters.maxPrice) && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>

                {/* Product Grid */}
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-4'
                  }
                `}>
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className={`
                        group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden
                        ${viewMode === 'list' ? 'flex items-center p-4' : 'p-0'}
                      `}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48'} overflow-hidden ${viewMode === 'grid' ? 'rounded-t-2xl' : 'rounded-xl'}`}>
                        <img
                          src={product.image || product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className={`absolute z-50 top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                            isInWishlist(product._id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <Heart size={16} className={isInWishlist(product._id) ? 'fill-current' : ''} />
                        </button>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => viewProductDetails(product._id)}
                              className="p-2 bg-white rounded-full text-gray-800 hover:bg-blue-600 hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => addToCart(product._id)}
                              className="p-2 bg-white rounded-full text-gray-800 hover:bg-green-600 hover:text-white transition-colors"
                              title="Add to Cart"
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                            Only {product.stock} left
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            Out of Stock
                          </div>
                        )}
                      </div>

                      <div className={`${viewMode === 'list' ? 'ml-4 flex-1' : 'p-4'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                              {product.brand}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          {product.rating && renderStars(product.rating)}
                          {product.category && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {product.category}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-600">
                              ${product.price}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Stock: {product.stock}
                          </div>
                        </div>

                        {/* Action Buttons for List View */}
                        {viewMode === 'list' && (
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              onClick={() => viewProductDetails(product._id)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => addToCart(product._id)}
                              disabled={product.stock === 0}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center">
                    <div className="flex items-center space-x-2 bg-white rounded-2xl shadow-lg p-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 rounded-xl font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100"
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                        </>
                      )}

                      {/* Page numbers around current page */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isInRange = pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2;
                        
                        if (!isInRange) return null;
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 rounded-xl font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Count Summary */}
                <div className="mt-8 text-center text-sm text-gray-500">
                  {totalProducts > 0 && (
                    <p>
                      Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalProducts)} of {totalProducts} total products
                    </p>
                  )}
                </div>
              </>
            )}
          </main>
        </div>

        {/* Quick Stats */}
        {!loading && products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalProducts}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{brands.length}</div>
              <div className="text-gray-600">Brands</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{wishlist.length}</div>
              <div className="text-gray-600">Favorites</div>
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast('info', 'Scrolled to top');
          }}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 z-40"
          title="Back to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
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
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Animation for product cards */
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

        /* Hover effects */
        .group:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        /* Loading animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Search suggestions animation */
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

        /* Toast animation */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        
        .toast-enter {
          animation: slideInRight 0.3s ease-out;
        }
        
        .toast-exit {
          animation: slideOutRight 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default ProductList;