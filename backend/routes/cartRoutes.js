
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/', protect, addToCart); // Add to cart
router.get('/', protect, getCart); // Get cart
router.delete('/:productId', protect, removeFromCart); // Remove from cart

module.exports = router;
