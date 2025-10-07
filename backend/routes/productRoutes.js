const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/whishListController');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, addReview, getFilters, addImageToProduct, removeImageFromProduct, getSearchSuggestions } = require('../controllers/productController');


const router = express.Router();

// Public Routes (no authentication required)
router.get('/filters', getFilters);
router.get('/suggestions', getSearchSuggestions);
router.get('/',  getProducts);

// Admin Routes (authentication + admin role required)
router.post('/', protect, admin,  createProduct);
router.put('/:id', protect, admin,  updateProduct);
router.delete('/:id', protect, admin,  deleteProduct);

// Protected Routes (authentication required)
router.post('/:id/reviews', protect,  addReview);

// Wishlist Routes (authentication required)
router.get('/wishlist', protect,  getWishlist);
router.post('/:id/wishlist', protect,   addToWishlist);
router.delete('/:id/wishlist', protect,   removeFromWishlist);

// Product Detail Route (public but tracks activity) - should be last to avoid conflicts
router.get('/:id',  getProductById);

module.exports = router;