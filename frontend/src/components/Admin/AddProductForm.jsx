import React, { useState } from 'react';

const AddProductForm = ({ onAddProduct, onClose }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    image: '',
    images: [],
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image) {
      alert('Please fill in all required fields!');
      return;
    }
    console.log(newProduct);
    
    onAddProduct(newProduct);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
      image: '',
      images: [],
    });
    onClose();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h3 className="font-semibold text-xl mb-4">Add Product</h3>
      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <textarea
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Category"
        value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Brand"
        value={newProduct.brand}
        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <input
        type="number"
        placeholder="Stock"
        value={newProduct.stock}
        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Main Image URL"
        value={newProduct.image}
        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        className="border p-2 m-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Additional Image URL (comma separated)"
        value={newProduct.images.join(', ')}
        onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value.split(', ') })}
        className="border p-2 m-2 w-full rounded"
      />
      <div className="mt-4">
        <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Add Product</button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default AddProductForm;
