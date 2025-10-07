const mongoose = require("mongoose");
const User = require("../models/User");

// Add Product to Wishlist
const addToWishlist = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 
    
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }
    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // console.log(user,"id");
        if (user.wishlist.includes(id)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        
        user.wishlist.push(id); 
        
        await user.save();
        // console.log( user.wishlist);
        
            res.status(200).json({ message: "Product added to wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Error adding to wishlist", error: error.message });
    }
};

// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    
    const userId = req.user.id;
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }
    
    try {
            const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });
    
        user.wishlist = user.wishlist.filter(item => item.toString() !== id);
        // console.log(user,"id");
        await user.save();

        res.status(200).json({ message: "Product removed from wishlist" });
} catch (error) {
        res.status(500).json({ message: "Error removing from wishlist", error: error.message });
    }
};

// Get User's Wishlist
const getWishlist = async (req, res) => {
    const userId = req.user.id;
    

    try {
        const user = await User.findById(userId).populate({
            path: "wishlist",
            select: "name image price",
        });
        
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Error fetching wishlist", error: error.message });
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
