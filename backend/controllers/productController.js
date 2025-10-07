const Product = require("../models/Product");
const User = require("../models/User");

const createProduct = async (req, res) => {
  const { name, description, price, image, images, brand, category, stock } = req.body;

  try {
    const formattedImages = images?.map((url) => ({ url })) || [];

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      brand,
      stock,
      images: formattedImages,
    });

    const createdProduct = await newProduct.save();
    console.log("Product created:", createdProduct);
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

const getProducts = async (req, res) => {
  const { category, brand, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;

  try {
    const query = {};

    // Category filter
    if (category) {
      if (Array.isArray(category)) {
        query.category = { $in: category };
      } else {
        query.category = category;
      }
    }

    // Brand filter
    if (brand) {
      if (Array.isArray(brand)) {
        query.brand = { $in: brand };
      } else {
        query.brand = brand;
      }
    }

    // Price filter - Fixed logic
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      
      if (minPrice !== undefined && minPrice !== '' && Number(minPrice) >= 0) {
        query.price.$gte = Number(minPrice);
      }
      
      if (maxPrice !== undefined && maxPrice !== '' && Number(maxPrice) > 0) {
        query.price.$lte = Number(maxPrice);
      }

      // If maxPrice is 0 or less than minPrice, don't apply maxPrice filter
      if (maxPrice !== undefined && Number(maxPrice) <= 0) {
        delete query.price.$lte;
      }

      // If both minPrice and maxPrice are provided, ensure maxPrice >= minPrice
      if (minPrice !== undefined && maxPrice !== undefined && 
          Number(maxPrice) > 0 && Number(minPrice) > Number(maxPrice)) {
        // Swap values if maxPrice < minPrice
        query.price = {
          $gte: Number(maxPrice),
          $lte: Number(minPrice)
        };
      }

      // If no valid price constraints, remove price filter
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    // Search filter - Improved to search in name, description, brand, and category
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      totalProducts: total,
      hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
      hasPrevPage: Number(page) > 1
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// New endpoint for search suggestions
const getSearchSuggestions = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchRegex = { $regex: q.trim(), $options: 'i' };
    
    // Get product name suggestions
    const productSuggestions = await Product.find({
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex }
      ]
    })
    .select('name brand category')
    .limit(10);

    // Create unique suggestions
    const suggestions = new Set();
    
    productSuggestions.forEach(product => {
      // Add product name if it matches
      if (product.name.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(product.name);
      }
      // Add brand if it matches
      if (product.brand && product.brand.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(product.brand);
      }
      // Add category if it matches
      if (product.category && product.category.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add(product.category);
      }
    });

    res.json({
      suggestions: Array.from(suggestions).slice(0, 8)
    });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
  }
};

const getFilters = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    
    // Get price range
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    const minPrice = priceRange.length > 0 ? priceRange[0].minPrice : 0;
    const maxPrice = priceRange.length > 0 ? priceRange[0].maxPrice : 5000;

    res.json({ 
      categories: categories.filter(cat => cat), // Remove null/undefined
      brands: brands.filter(brand => brand), // Remove null/undefined
      priceRange: { min: minPrice, max: maxPrice }
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ message: 'Error fetching filters', error: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("reviews.user", "name email");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update Product (Admin)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, stock, category, brand } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete Product (Admin)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Add Review to Product (Authenticated Users)
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: Please login to add a review.' });
  }

  const userId = req.user.id;

  try {
    const product = await Product.findById(productId)
      .populate({
        path: 'reviews.user',
        select: 'name email',
      });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user._id.toString() === userId);
    if (alreadyReviewed) return res.status(400).json({ message: 'You have already reviewed this product' });

    product.reviews.push({ user: userId, rating, comment });
    product.calculateRating(); // Update the product's rating
    await product.save();

    res.status(201).json({ message: 'Review added successfully', reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  getFilters,
  getSearchSuggestions
};