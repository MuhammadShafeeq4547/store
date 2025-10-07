import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Fetching product data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get('/api/products'); // Get all products
        const userResponse = await axios.get('/api/users'); // Get all users
        setProducts(productResponse.data);
        setUsers(userResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-panel">
      <h1 className="text-3xl font-bold text-center my-4">Admin Panel</h1>
      
      {/* Product Management */}
      <div className="my-4">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <div className="my-2">
          <Link to="/admin/add-product" className="bg-green-500 text-white px-4 py-2 rounded-md">
            Add Product
          </Link>
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td className="px-4 py-2 border">{product._id}</td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">${product.price}</td>
                <td className="px-4 py-2 border">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md mx-1">Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md mx-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Management */}
      <div className="my-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="px-4 py-2 border">{user._id}</td>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md mx-1">Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md mx-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
