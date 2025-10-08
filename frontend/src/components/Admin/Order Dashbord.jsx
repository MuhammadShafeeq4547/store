import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Package, Users, DollarSign, TrendingUp, AlertTriangle, 
  Search, Filter, Download, Edit, Eye, CheckCircle, 
  XCircle, Clock, Truck, RefreshCw, FileText, Mail,
  Phone, MapPin, Calendar, Star, ShoppingBag, Settings,
  ChevronDown, ChevronRight, Bell, LogOut, Home, Plus,
  MoreVertical, ExternalLink, Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [pagination, setPagination] = useState({});

  const API_BASE = `${process.env.REACT_APP_API_URL}/api/admin`;
  

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
    'Content-Type': 'application/json'
  });

  // Enhanced error handler
  const handleApiError = (error, context) => {
    console.error(`${context} error:`, error);
    let errorMessage = `Failed to ${context.toLowerCase()}. `;
    
    if (error.response?.status === 401) {
      errorMessage += 'Authentication failed.';
    } else if (error.response?.status === 403) {
      errorMessage += 'Access denied.';
    } else if (error.response?.status === 404) {
      errorMessage += 'Resource not found.';
    } else {
      errorMessage += 'Please try again.';
    }
    
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/dashboard`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        // Transform backend data to frontend format
        const data = result.data;
        setDashboardData({
          totalOrders: data.totalCounts?.orders || 0,
          totalRevenue: data.monthlyStats?.revenue || 0,
          totalCustomers: data.totalCounts?.users || 0,
          conversionRate: 2.5, // Calculate or get from backend
          ordersGrowth: 12, // Calculate or get from backend
          revenueGrowth: 8, // Calculate or get from backend
          customersGrowth: 15, // Calculate or get from backend
          conversionGrowth: 5, // Calculate or get from backend
          avgOrderValue: data.monthlyStats?.revenue / (data.totalCounts?.orders || 1),
          newCustomers: data.weeklyStats?.orders || 0
        });
      }
    } catch (error) {
      handleApiError(error, 'Load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Order Statistics
  const fetchOrderStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE}/statistics`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        // Transform order status data for pie chart
        const ordersByStatus = result.data?.orderStatusStats?.map(item => ({
          name: item._id,
          count: item.count,
          value: item.count
        })) || [];
        
        setOrderStats({ ordersByStatus });
      }
    } catch (error) {
      handleApiError(error, 'Load order statistics');
    }
  };

  // Fetch Orders with Filters
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Date filter mapping
      const dateMapping = {
        '7days': { days: 7 },
        '30days': { days: 30 },
        '90days': { days: 90 },
        '1year': { days: 365 }
      };
      
      if (dateFilter && dateMapping[dateFilter]) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - dateMapping[dateFilter].days);
        params.append('dateFrom', fromDate.toISOString());
      }
      
      const response = await fetch(`${API_BASE}/orders?${params}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const transformedOrders = result.data.map(order => ({
          _id: order._id,
          status: order.orderStatus,
          totalAmount: order.orderSummary?.totalAmount || 0,
          createdAt: order.createdAt,
          user: order.user,
          shippingAddress: {
            fullName: order.shippingInfo?.fullName,
            phone: order.shippingInfo?.phone,
            address: order.shippingInfo?.address,
            city: order.shippingInfo?.city,
            state: order.shippingInfo?.state,
            zipCode: order.shippingInfo?.postalCode,
            country: order.shippingInfo?.country
          },
          orderItems: order.orderItems?.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item.image
          })) || [],
          shippingPrice: order.orderSummary?.shippingCost || 0,
          taxPrice: order.orderSummary?.tax || 0,
          paymentMethod: order.paymentMethod?.type,
          trackingNumber: order.trackingNumber
        }));
        
        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
        setPagination(result.pagination || {});
      }
    } catch (error) {
      handleApiError(error, 'Load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Single Order
  const fetchSingleOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const order = result.data;
        setSelectedOrder({
          _id: order._id,
          status: order.orderStatus,
          totalAmount: order.orderSummary?.totalAmount || 0,
          createdAt: order.createdAt,
          user: order.user,
          shippingAddress: {
            fullName: order.shippingInfo?.fullName,
            phone: order.shippingInfo?.phone,
            address: order.shippingInfo?.address,
            city: order.shippingInfo?.city,
            state: order.shippingInfo?.state,
            zipCode: order.shippingInfo?.postalCode,
            country: order.shippingInfo?.country
          },
          orderItems: order.orderItems?.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item.image
          })) || [],
          shippingPrice: order.orderSummary?.shippingCost || 0,
          taxPrice: order.orderSummary?.tax || 0,
          paymentMethod: order.paymentMethod?.type,
          trackingNumber: order.trackingNumber
        });
      }
    } catch (error) {
      handleApiError(error, 'Load order details');
    }
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/analytics/revenue?period=month&year=${new Date().getFullYear()}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const revenueData = result.data.revenueData?.map(item => ({
          date: monthNames[item._id - 1] || item._id,
          revenue: item.totalRevenue || 0
        })) || [];
        
        const ordersData = result.data.revenueData?.map(item => ({
          date: monthNames[item._id - 1] || item._id,
          orders: item.totalOrders || 0
        })) || [];
        
        setAnalytics({
          revenueData,
          ordersData,
          monthlyRevenue: revenueData
        });
      }
    } catch (error) {
      handleApiError(error, 'Load analytics');
    }
  };

  // Fetch Sales Report
  const fetchSalesReport = async () => {
    try {
      const response = await fetch(`${API_BASE}/reports/sales`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setSalesReport({
          totalSales: result.data.summary?.totalRevenue || 0,
          averageOrderValue: result.data.summary?.averageOrderValue || 0,
          totalOrders: result.data.summary?.totalOrders || 0,
          topProducts: result.data.topProducts?.map(product => ({
            name: product.productName,
            totalSold: product.totalSold,
            revenue: product.totalRevenue,
            trend: Math.floor(Math.random() * 20) - 10, // Random trend for demo
            sku: `SKU-${product._id?.slice(-6)}`,
            image: '/api/placeholder/40/40'
          })) || []
        });
      }
    } catch (error) {
      handleApiError(error, 'Load sales report');
    }
  };

  // Fetch Inventory Alerts
  const fetchInventoryAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory-alerts`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const alerts = [
          ...(result.data.lowStockProducts?.map(product => ({
            productName: product.name,
            currentStock: product.stock,
            minStock: 5,
            type: 'low_stock'
          })) || []),
          ...(result.data.outOfStockProducts?.map(product => ({
            productName: product.name,
            currentStock: 0,
            minStock: 1,
            type: 'out_of_stock'
          })) || [])
        ];
        
        setInventoryAlerts(alerts);
      }
    } catch (error) {
      handleApiError(error, 'Load inventory alerts');
    }
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status } : order
        ));
        setFilteredOrders(filteredOrders.map(order => 
          order._id === orderId ? { ...order, status } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        
        alert('Order status updated successfully!');
      }
    } catch (error) {
      handleApiError(error, 'Update order status');
    }
  };

  // Bulk Update Orders
  const bulkUpdateStatus = async (status) => {
    if (bulkSelected.length === 0) {
      alert('Please select orders to update');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/orders/bulk-update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          orderIds: bulkSelected,
          status 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setBulkSelected([]);
        fetchOrders();
        alert(`${result.data?.updated || bulkSelected.length} orders updated successfully!`);
      }
    } catch (error) {
      handleApiError(error, 'Bulk update orders');
    }
  };

  // Export Orders
  const exportOrders = async (format = 'csv') => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`${API_BASE}/export/orders?${params}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        // Convert to CSV and download
        const csvContent = convertToCSV(result.data);
        downloadCSV(csvContent, `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        alert('Orders exported successfully!');
      }
    } catch (error) {
      handleApiError(error, 'Export orders');
    }
  };

  // Utility functions
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Initial data load
  useEffect(() => {
    fetchDashboardData();
    fetchOrderStatistics();
    fetchOrders();
    fetchAnalytics();
    fetchInventoryAlerts();
    fetchSalesReport();
  }, []);

  // Refetch orders when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, dateFilter, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter, searchTerm, currentPage]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      processing: <RefreshCw className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status?.toLowerCase()] || <Package className="w-4 h-4" />;
  };

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {dashboardData?.totalOrders?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{dashboardData?.ordersGrowth || 0}% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${dashboardData?.totalRevenue?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{dashboardData?.revenueGrowth || 0}% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {dashboardData?.totalCustomers?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{dashboardData?.customersGrowth || 0}% from last month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${dashboardData?.avgOrderValue?.toFixed(2) || '0'}
              </p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{dashboardData?.conversionGrowth || 0}% from last month
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <button 
              onClick={fetchAnalytics}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.revenueData || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
            <button 
              onClick={fetchOrderStatistics}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStats?.ordersByStatus || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(orderStats?.ordersByStatus || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('orders')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-900">Manage Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
            
            <button 
              onClick={() => exportOrders('csv')}
              className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center">
                <Download className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-green-900">Export Data</span>
              </div>
              <ChevronRight className="w-4 h-4 text-green-600" />
            </button>
            
            <button 
              onClick={() => setActiveTab('analytics')}
              className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center">
                <BarChart className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-purple-900">View Analytics</span>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="lg:col-span-2">
          {inventoryAlerts.length > 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
                </div>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {inventoryAlerts.length} alerts
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {inventoryAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.productName}</p>
                      <p className="text-sm text-gray-600">
                        Current stock: <span className="font-medium text-orange-600">{alert.currentStock}</span>
                        {' • '}Minimum required: <span className="font-medium">{alert.minStock}</span>
                      </p>
                    </div>
                    <button className="ml-4 px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">All Good!</h3>
                <p className="text-gray-600">No inventory alerts at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ExternalLink className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id?.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => fetchSingleOrder(order._id)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Orders Management Component
  const OrdersManagement = () => (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>

          <div className="flex gap-2">
            {/* Bulk Actions */}
            {bulkSelected.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => bulkUpdateStatus('confirmed')}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  Confirm ({bulkSelected.length})
                </button>
                <button
                  onClick={() => bulkUpdateStatus('processing')}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                >
                  Process ({bulkSelected.length})
                </button>
                <button
                  onClick={() => bulkUpdateStatus('shipped')}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                >
                  Ship ({bulkSelected.length})
                </button>
              </div>
            )}

            {/* Export */}
            <button
              onClick={() => exportOrders('csv')}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Refresh */}
            <button
              onClick={fetchOrders}
              className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkSelected(filteredOrders.map(order => order._id));
                      } else {
                        setBulkSelected([]);
                      }
                    }}
                    checked={bulkSelected.length === filteredOrders.length && filteredOrders.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      checked={bulkSelected.includes(order._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelected([...bulkSelected, order._id]);
                        } else {
                          setBulkSelected(bulkSelected.filter(id => id !== order._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id?.slice(-8) || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="capitalize">{order.paymentMethod || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchSingleOrder(order._id)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin" />
            <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, pagination.totalOrders || 0)} of {pagination.totalOrders || 0} orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage >= pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Order Detail Modal
  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500">Order #{selectedOrder._id?.slice(-8)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 text-gray-900">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{selectedOrder._id?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-medium">{selectedOrder.trackingNumber || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">${selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 text-gray-900">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.shippingAddress?.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedOrder.shippingAddress?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 text-gray-900">Shipping Address</h3>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Order Items</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <img 
                        src={item.image || '/api/placeholder/60/60'} 
                        alt={item.name}
                        className="w-15 h-15 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                        <p className="text-sm text-gray-600">${item.price?.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${(item.price * item.qty)?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${(selectedOrder.totalAmount - (selectedOrder.shippingPrice || 0) - (selectedOrder.taxPrice || 0))?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${selectedOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${selectedOrder.taxPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  updateOrderStatus(selectedOrder._id, e.target.value);
                  setSelectedOrder({...selectedOrder, status: e.target.value});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button 
                onClick={() => alert('Email functionality coming soon!')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Send Update Email
              </button>
              
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Print Invoice
              </button>

              <button 
                onClick={() => {
                  const trackingNumber = prompt('Enter tracking number:');
                  if (trackingNumber) {
                    updateTrackingInfo(selectedOrder._id, { trackingNumber });
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
              >
                <Truck className="w-4 h-4" />
                Add Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update Tracking Info
  const updateTrackingInfo = async (orderId, trackingInfo) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          courierTrackingNumber: trackingInfo.trackingNumber,
          courierService: 'TCS' // Default courier service
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        alert('Tracking information updated successfully!');
        fetchSingleOrder(orderId); // Refresh order details
      }
    } catch (error) {
      handleApiError(error, 'Update tracking information');
    }
  };

  // Analytics Component
  const AnalyticsView = () => (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            <p className="text-gray-600">Track your business performance and insights</p>
          </div>
          <button
            onClick={() => {
              fetchAnalytics();
              fetchSalesReport();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
           <select 
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Orders</h3>
            <span className="text-sm text-gray-500">Orders per month</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.ordersData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
              />
              <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Report */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
          <button 
            onClick={() => exportOrders('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesReport?.topProducts?.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg border border-gray-200" src={product.image} alt={product.name} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{product.totalSold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${product.revenue?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                      product.trend > 0 ? 'text-green-600' : product.trend < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {product.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                      {Math.abs(product.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Customer Detail Modal
  const CustomerDetailModal = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            {/* Customer details content would go here */}
            <p className="text-gray-600">Customer detail view coming soon...</p>
          </div>
        </div>
      </div>
    );
  };

  // Main Navigation
  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {inventoryAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {inventoryAlerts.length}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Main App
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="p-6">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Modals */}
      <OrderDetailModal />
      <CustomerDetailModal />
    </div>
  );
};

export default AdminDashboard;