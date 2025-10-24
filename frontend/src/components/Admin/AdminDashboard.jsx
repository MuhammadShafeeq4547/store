import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Package, TrendingUp, DollarSign, 
  Edit, Trash2, Plus, X, Search, 
  ChevronLeft, ChevronRight, Filter,
  Eye, EyeOff, CheckCircle, XCircle,
  ShoppingBag, Box, AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    lowStock: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchData();
  }, [user, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchProducts()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(response.data);
      setStats(prev => ({ ...prev, totalUsers: response.data.length }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      
      const lowStockCount = (response.data.products || []).filter(p => p.stock < 10).length;
      setStats(prev => ({ 
        ...prev, 
        totalProducts: response.data.products?.length || 0,
        lowStock: lowStockCount
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(prevUsers => prevUsers.filter((user) => user._id !== id));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image) {
      alert('Please fill in all required fields!');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, newProduct, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(prevProducts => [...prevProducts, response.data]);
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
      setShowAddForm(false);
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${editingProduct._id}`, 
        editingProduct, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProducts(prevProducts =>
        prevProducts.map((p) => (p._id === editingProduct._id ? response.data : p))
      );
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(prevProducts => prevProducts.filter((p) => p._id !== id));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your store efficiently</p>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
                <span className="text-white font-semibold hidden sm:inline">MyShop Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Users</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Products</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">$0</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.lowStock}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Low Stock</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 lg:mb-8">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            {['overview', 'products', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                User Management
              </h2>
              <p className="text-blue-100 mt-1 text-xs sm:text-sm">View and manage registered users</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{u.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => deleteUser(u._id)} 
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Search & Add Button */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span className="hidden sm:inline">{showAddForm ? 'Cancel' : 'Add Product'}</span>
                </button>
              </div>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingProduct) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  {editingProduct ? <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /> : <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name *"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, name: e.target.value })
                      : setNewProduct({ ...newProduct, name: e.target.value })}
                    className="col-span-1 sm:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  
                  <input
                    type="number"
                    placeholder="Price *"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, price: e.target.value })
                      : setNewProduct({ ...newProduct, price: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct ? editingProduct.stock : newProduct.stock}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, stock: e.target.value })
                      : setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  
                  <input
                    type="text"
                    placeholder="Category"
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, category: e.target.value })
                      : setNewProduct({ ...newProduct, category: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  
                  <input
                    type="text"
                    placeholder="Brand"
                    value={editingProduct ? editingProduct.brand : newProduct.brand}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, brand: e.target.value })
                      : setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  
                  <textarea
                    placeholder="Description *"
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, description: e.target.value })
                      : setNewProduct({ ...newProduct, description: e.target.value })}
                    className="col-span-1 sm:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 text-sm sm:text-base"
                  />
                  
                  <input
                    type="text"
                    placeholder="Image URL *"
                    value={editingProduct ? editingProduct.image : newProduct.image}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, image: e.target.value })
                      : setNewProduct({ ...newProduct, image: e.target.value })}
                    className="col-span-1 sm:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={editingProduct ? updateProduct : addProduct}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  
                  {editingProduct && (
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  <Box className="w-5 h-5 sm:w-6 sm:h-6" />
                  Product Catalog
                </h2>
                <p className="text-purple-100 mt-1 text-xs sm:text-sm">{filteredProducts.length} products found</p>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-square bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                        {product.stock < 10 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Low Stock
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl sm:text-2xl font-bold text-green-600">${product.price}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Stock: {product.stock || 0}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingProduct(product)} 
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button 
                            onClick={() => deleteProduct(product._id)} 
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 px-4 py-6 bg-gray-50">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === i + 1
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Dashboard Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Users</span>
                      <span className="font-bold text-blue-600">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Products</span>
                      <span className="font-bold text-purple-600">{stats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Low Stock Items</span>
                      <span className="font-bold text-red-600">{stats.lowStock}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">System running smoothly</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{stats.totalProducts} products active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-700">{stats.totalUsers} registered users</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Navigate to different tabs to manage users and products efficiently. Keep track of low stock items to ensure smooth operations.
                </p>
              </div>
            </div>

            {/* Recent Products Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-600" />
                Recent Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <div key={product._id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-green-600 font-bold text-lg">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Recent Users
              </h2>
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.name}</p>
                        <p className="text-sm text-gray-600">{u.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;