const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { getWishlist } = require('../controllers/whishListController');


const router = express.Router();

// Public Routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (authentication required)
router.get('/profile', protect,  getUserProfile);
router.put('/profile', protect,  updateUserProfile);
router.get('/wishlist', protect,  getWishlist);

// Admin Routes (authentication + admin role required)
router.get('/', protect, admin,  getAllUsers);
router.delete('/:id', protect, admin,  deleteUser);

module.exports = router;