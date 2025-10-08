import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
          <h3 className="text-xl font-bold mt-2">{product.name}</h3>
          <p>{product.description}</p>
          <Link to={`/product/${product._id}`} className="text-blue-500">View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
