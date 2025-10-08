import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa"; // Heart and Cart icons

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isReviewing, setIsReviewing] = useState(false);
  const [message, setMessage] = useState("");
  const { user, wishlist, addToWishlist, removeFromWishlist, addToCart } = useAuth();
  const { id } = useParams();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product details
  const fetchProduct = async () => {
    try {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Product Detail Error:", error.response?.data?.message || error);
    }
  };

  // Check if product is in wishlist
  useEffect(() => {
    setIsInWishlist(wishlist.some((item) => item._id === id));
    fetchProduct();
  }, [wishlist, id]);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      setMessage("Please login to add to wishlist.");
      return;
    }

    if (isInWishlist) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  // Handle review submission
  const handleAddReview = async () => {
    if (!user) {
      setMessage("Please login to add a review.");
      return;
    }

    try {
      const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/products/${id}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      
      setMessage("Review added successfully!");
      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: [
          ...prevProduct.reviews,
          { user: { name: user.name }, rating, comment },
        ],
      }));
      setIsReviewing(false);
      setComment("");
      setRating(1);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding review");
    }
  };

  // Handle add to cart with quantity
  const handleAddToCart = async () => {
    if (!user) {
      setMessage("Please login to add to cart.");
      return;
    }

    try {
      await addToCart(product._id, quantity);
      setMessage("Product added to cart successfully!");
    } catch (error) {
      setMessage("Failed to add product to cart.");
    }
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 4000);
    }
  }, [message]);

  if (!product) {
    return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Product Images Gallery */}
        <div className="md:w-1/2">
          <div className="flex gap-4 mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-1/4 h-auto object-cover rounded-xl shadow-lg cursor-pointer"
            />
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Additional image ${index + 1}`}
                className="w-1/4 h-auto object-cover rounded-xl shadow-lg cursor-pointer"
              />
            ))}
          </div>
          <img
            src={product.image}
            alt={product.name}
            className="w-80 m-auto h-auto object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
          <p className="text-lg text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4 flex items-center">
            {product.discountedPrice > 0 ? (
              <>
                <p className="text-2xl font-bold text-green-600 mr-4">${product.discountedPrice}</p>
                <p className="text-lg line-through text-gray-500">${product.price}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-green-600">${product.price}</p>
            )}
          </div>

          <div className="flex items-center mt-3">
            <span className="text-xl text-gray-700">{product.rating} ⭐</span>
            <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
          </div>

          <div className="mt-3">
            <p className="text-gray-700 font-medium">Brand: <span className="text-gray-600">{product.brand}</span></p>
            <p className="text-gray-700 font-medium">Category: <span className="text-gray-600">{product.category}</span></p>
            <p className="text-gray-700 font-medium">In Stock: <span className="text-green-600">{product.stock} items</span></p>
          </div>

          {/* Quantity Input */}
          <div className="mt-6">
            <label className="block font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-24 mt-2"
            />
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex items-center mt-6 space-x-6">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <FaShoppingCart className="inline-block mr-2" />
              Add to Cart
            </button>
            <button onClick={handleWishlistToggle} className="p-2">
              {isInWishlist ? (
                <FaHeart className="text-red-500 text-3xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-3xl" />
              )}
            </button>
          </div>

          {message && <p className="mt-4 text-red-500 font-semibold">{message}</p>}
        </div>
      </div>

      {/* Add Review Section */}
      {user && (
        <button
          onClick={() => setIsReviewing(!isReviewing)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          {isReviewing ? "Cancel" : "Add Review"}
        </button>
      )}

      {isReviewing && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800">Add Review</h3>
          <div className="mt-4">
            <label className="block font-medium text-gray-700">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full mt-2"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block font-medium text-gray-700">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full mt-2"
            />
          </div>
          <button
            onClick={handleAddReview}
            className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Submit Review
          </button>
          {message && <p className="mt-4 text-red-500 font-semibold">{message}</p>}
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Customer Reviews</h3>
        {product.reviews?.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {product.reviews.map((review, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                <strong className="text-blue-600">{review.user?.name || "Anonymous"}</strong>
                <span className="text-yellow-500 ml-2">Rating: {review.rating} ⭐</span>
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
