import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', { name, description, price });
    } catch (error) {
      console.error('Product Form Error:', error.response?.data?.message || error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border" />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border"></textarea>
        </div>
        <div>
          <label>Price</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border" />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
