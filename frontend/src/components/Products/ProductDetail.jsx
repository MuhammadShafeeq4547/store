import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";

// Icon Components
const HeartIcon = ({ filled, className }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
  </svg>
);

const StarIcon = ({ filled, className }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ExclamationIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.464 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const LoadingSpinner = ({ size = "w-6 h-6" }) => (
  <div className={`animate-spin rounded-full border-2 border-transparent border-t-current ${size}`}></div>
);

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <ExclamationIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationIcon className="w-5 h-5 text-amber-500" />;
      default:
        return <CheckIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-x-0 ${getToastStyles()}`}>
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isReviewing, setIsReviewing] = useState(false);
  const [toast, setToast] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState({
    page: true,
    wishlist: false,
    cart: false,
    review: false
  });
  const [imageLoading, setImageLoading] = useState(true);
  const { id } = useParams();

  const { user, wishlist, addToWishlist, removeFromWishlist, addToCart } = useAuth();

  // Show toast notification
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Close toast
  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Product Detail Error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to load product details';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  }, [id, showToast]);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && id) {
      setIsInWishlist(wishlist.some((item) => item._id === id));
    }
    fetchProduct();
  }, [wishlist, id, fetchProduct]);

  // Calculate discount percentage with proper validation
  const discountInfo = useMemo(() => {
    if (!product || !product.price) return null;
    
    const originalPrice = parseFloat(product.price);
    const discountedPrice = parseFloat(product.discountedPrice);
    
    // Only show discount if discountedPrice exists, is valid, and is less than original price
    if (discountedPrice && discountedPrice > 0 && discountedPrice < originalPrice) {
      const discountAmount = originalPrice - discountedPrice;
      const discountPercentage = Math.round((discountAmount / originalPrice) * 100);
      
      return {
        hasDiscount: true,
        originalPrice,
        discountedPrice,
        discountAmount,
        discountPercentage,
        finalPrice: discountedPrice
      };
    }
    
    return {
      hasDiscount: false,
      originalPrice,
      finalPrice: originalPrice
    };
  }, [product]);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(async () => {
    if (!user) {
      showToast("Please login to manage your wishlist", 'warning');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, wishlist: true }));
      
      if (isInWishlist) {
        await removeFromWishlist(id);
        showToast("Removed from wishlist", 'success');
      } else {
        await addToWishlist(id);
        showToast("Added to wishlist", 'success');
      }
      
      setIsInWishlist(prev => !prev);
    } catch (error) {
      console.error("Wishlist error:", error);
      showToast("Failed to update wishlist. Please try again.", 'error');
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }));
    }
  }, [user, isInWishlist, id, addToWishlist, removeFromWishlist, showToast]);

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (!user) {
      showToast("Please login to add items to your cart", 'warning');
      return;
    }

    if (!product || product.stock === 0) {
      showToast("This product is currently out of stock", 'error');
      return;
    }

    if (quantity > product.stock) {
      showToast(`Only ${product.stock} items available in stock`, 'error');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, cart: true }));
      
      await addToCart(product._id, quantity);
      showToast(`${quantity} item(s) added to cart successfully!`, 'success');
    } catch (error) {
      console.error("Add to cart error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to add product to cart';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  }, [user, quantity, product, addToCart, showToast]);

  // Handle review submission


  
  const handleAddReview = useCallback(async () => {
    if (!user) {
      showToast("Please login to write a review", 'warning');
      return;
    }

    if (!comment.trim()) {
      showToast("Please enter a comment for your review", 'error');
      return;
    }

    if (rating < 1 || rating > 5) {
      showToast("Please select a valid rating between 1-5 stars", 'error');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, review: true }));
      
      const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/products/${id}/reviews`,
        { rating, comment: comment.trim() },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // response.data

      // Update product with new review
      const newReview = {
        user: { name: user.name },
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };

      setProduct(prev => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])],
        numReviews: (prev.numReviews || 0) + 1,
        rating: (((prev.rating || 0) * (prev.numReviews || 0) + rating) / ((prev.numReviews || 0) + 1)).toFixed(1)
      }));

      showToast("Review added successfully!", 'success');
      setIsReviewing(false);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Review error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to add review';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(prev => ({ ...prev, review: false }));
    }
  }, [comment, rating, user, id, showToast]);

  // Render star rating
  const renderStars = useCallback((rating, interactive = false, onRate = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        filled={i < Math.floor(rating)}
        className={`w-5 h-5 transition-colors ${
          interactive 
            ? 'cursor-pointer hover:text-yellow-400' 
            : ''
        } ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        onClick={interactive ? () => onRate(i + 1) : undefined}
      />
    ));
  }, []);

  // Loading state
  if (loading.page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="w-12 h-12" />
          <p className="mt-4 text-slate-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <ExclamationIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Breadcrumb */}
        <nav className="text-sm text-slate-600 mb-8 flex items-center space-x-2">
          <span className="hover:text-slate-800 cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="hover:text-slate-800 cursor-pointer transition-colors capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Enhanced Image Gallery */}
            <div className="space-y-6">
              {/* Main Image with enhanced styling */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="w-8 h-8" />
                  </div>
                )}
                <img
                  src={selectedImage === 0 ? product.image : product.images?.[selectedImage - 1]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
                {discountInfo?.hasDiscount && (
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    -{discountInfo.discountPercentage}% OFF
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Enhanced Thumbnail Gallery */}
              {(product.images?.length > 0) && (
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300 ${
                      selectedImage === 0 ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(0)}
                  >
                    <img src={product.image} alt="Main" className="w-full h-full object-cover" />
                  </div>
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-3 transition-all duration-300 ${
                        selectedImage === index + 1 ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedImage(index + 1)}
                    >
                      <img src={img.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>
                <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Enhanced Rating Section */}
              <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {renderStars(Number(product.rating) || 0)}
                  </div>
                  <span className="text-slate-700 font-semibold text-lg">{Number(product.rating).toFixed(1)}</span>
                </div>
                <div className="h-6 w-px bg-slate-300"></div>
                <span className="text-slate-600 font-medium">
                  {product.numReviews} {product.numReviews === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>

              {/* Enhanced Price Section */}
              <div className="space-y-3">
                {discountInfo?.hasDiscount ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-4">
                      <span className="text-5xl font-bold text-emerald-600">
                        ${discountInfo.finalPrice.toFixed(2)}
                      </span>
                      <span className="text-2xl text-slate-500 line-through">
                        ${discountInfo.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold">
                        Save ${discountInfo.discountAmount.toFixed(2)}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">
                        {discountInfo.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-5xl font-bold text-emerald-600">
                    ${discountInfo?.finalPrice?.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Enhanced Product Details Grid */}
              <div className="grid grid-cols-2 gap-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Category', value: product.category },
                  { 
                    label: 'Stock', 
                    value: product.stock > 0 ? `${product.stock} items` : 'Out of Stock',
                    className: product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600',
                  
                  },
                  { 
                    label: 'Status', 
                    value: product.stock > 0 ? 'In Stock' : 'Unavailable',
                    className: product.stock > 0 ? 'text-emerald-600' : 'text-red-600',
                    icon: product.stock > 0 ? '✔' : '❌'
                  }
                ].map((detail, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{detail.icon}</span>
                      <span className="text-slate-600 font-medium">{detail.label}</span>
                    </div>
                    <p className={`font-bold text-lg ${detail.className || 'text-slate-900'}`}>
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Enhanced Quantity Selector */}
              <div className="space-y-3">
                <label className="block text-slate-700 font-semibold text-lg">Quantity:</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                      className="w-20 h-12 text-center border-0 bg-transparent focus:ring-0 font-bold text-lg"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-slate-600 font-medium">
                    ({product.stock} available)
                  </span>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={loading.cart || product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-xl"
                >
                  {loading.cart ? (
                    <LoadingSpinner size="w-5 h-5" />
                  ) : (
                    <>
                      <CartIcon className="w-6 h-6" />
                      <span className="text-lg">Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={loading.wishlist}
                  className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isInWishlist
                      ? 'bg-red-50 text-red-500 hover:bg-red-100 border-2 border-red-200'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-slate-200'
                  }`}
                >
                  {loading.wishlist ? (
                    <LoadingSpinner size="w-6 h-6" />
                  ) : (
                    <HeartIcon filled={isInWishlist} className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Reviews Section */}
          <div className="border-t border-slate-200 p-8 lg:p-12 bg-slate-50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-slate-900">Customer Reviews</h3>
              {user && !isReviewing && (
                <button
                  onClick={() => setIsReviewing(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Enhanced Review Form */}
            {isReviewing && (
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-slate-200">
                <h4 className="text-2xl font-bold text-slate-900 mb-6">Write Your Review</h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 text-lg">Rating:</label>
                    <div className="flex space-x-1">
                      {renderStars(rating, true, setRating)}
                      <span className="ml-3 text-slate-600 font-medium">({rating} star{rating !== 1 ? 's' : ''})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 text-lg">Your Review:</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors text-lg"
                      rows="5"
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-slate-500 mt-2">
                      {comment.length}/500 characters
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddReview}
                      disabled={loading.review || !comment.trim()}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 font-semibold shadow-lg"
                    >
                      {loading.review ? (
                        <LoadingSpinner size="w-4 h-4" />
                      ) : (
                        <span>Submit Review</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsReviewing(false);
                        setComment("");
                        setRating(5);
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-xl transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Reviews List */}
            {product.reviews?.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {(review.user?.name || "Anonymous").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-lg">{review.user?.name || "Anonymous"}</h5>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex space-x-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-slate-500 text-sm font-medium">
                              {new Date(review.createdAt || review.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {review.rating}/5
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-lg bg-slate-50 p-4 rounded-xl">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-slate-300 mb-6">
                  <StarIcon className="w-20 h-20 mx-auto opacity-30" />
                </div>
                <h4 className="text-2xl font-bold text-slate-600 mb-2">No reviews yet</h4>
                <p className="text-slate-500 text-lg mb-6">Be the first to share your experience with this product!</p>
                {user && !isReviewing && (
                  <button
                    onClick={() => setIsReviewing(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Write First Review
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Specifications Section */}
          <div className="border-t border-slate-200 p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-8">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Product Name</span>
                  <span className="text-slate-900 font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Brand</span>
                  <span className="text-slate-900 font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Category</span>
                  <span className="text-slate-900 font-medium capitalize">{product.category}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Availability</span>
                  <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Stock Quantity</span>
                  <span className="text-slate-900 font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Customer Rating</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderStars(Number(product.rating) || 0)}
                    </div>
                    <span className="text-slate-900 font-medium">
                      {Number(product.rating).toFixed(1)} ({product.numReviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Placeholder */}
          <div className="border-t border-slate-200 p-8 lg:p-12 bg-slate-50">
            <h3 className="text-3xl font-bold text-slate-900 mb-8">You Might Also Like</h3>
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Related products will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Free Shipping</h4>
            <p className="text-slate-600">Free shipping on orders over $50</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Secure Payment</h4>
            <p className="text-slate-600">Your payment information is safe</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">↩️</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Easy Returns</h4>
            <p className="text-slate-600">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;