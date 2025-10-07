import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-md" />
      <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
      <p>{product.description}</p>
      <p className="text-xl font-bold mt-4">${product.price}</p>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4">Add to Cart</button>
    </div>
  );
};

export default ProductDetail;
