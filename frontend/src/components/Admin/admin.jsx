// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
// } from 'recharts';
// import { 
//   Package, Users, DollarSign, TrendingUp, AlertTriangle, 
//   Search, Filter, Download, Edit, Eye, CheckCircle, 
//   XCircle, Clock, Truck, RefreshCw, FileText, Mail,
//   Phone, MapPin, Calendar, Star, ShoppingBag, Settings,
//   ChevronDown, ChevronRight, Bell, LogOut, Home, Plus,
//   MoreVertical, ExternalLink
// } from 'lucide-react';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [dashboardData, setDashboardData] = useState(null);
//   const [orderStats, setOrderStats] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [inventoryAlerts, setInventoryAlerts] = useState([]);
//   const [salesReport, setSalesReport] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [bulkSelected, setBulkSelected] = useState([]);
//   const [error, setError] = useState(null);
  
//   // Filters
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('7days');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ordersPerPage] = useState(10);

//   // API Base URL - adjust according to your backend
//   const API_BASE = 'http://localhost:5000/api/admin';
  
//   // Get auth token from localStorage or your auth system
//   const getAuthHeaders = () => ({
//     'Authorization': `Bearer ${localStorage.getItem('token') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODlmODk4NjU4ZTZmYTE5MmUwMDFiYSIsImlhdCI6MTc1NDA1MzE1MCwiZXhwIjoxNzU2NjQ1MTUwfQ.WdIicvnvM0-wiaHzDTg3cGBB_D6wThrA8kYneu-pGmM"}`,
//     'Content-Type': 'application/json'
//   });

//   // Error handler
//   const handleApiError = (error, context) => {
//     console.error(`${context} error:`, error);
//     setError(`Failed to ${context.toLowerCase()}. Please try again.`);
//     setTimeout(() => setError(null), 5000);
//   };

//   // Analytics Component
//   const AnalyticsView = () => (
//     <div className="space-y-6">
//       {/* Analytics Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
//             <p className="text-gray-600">Track your business performance and insights</p>
//           </div>
//           <button
//             onClick={() => {
//               fetchAnalytics();
//               fetchSalesReport();
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh Data
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Analytics */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <TrendingUp className="w-8 h-8 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Average Order</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 PKR {salesReport?.averageOrderValue?.toFixed(2) || '0'}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <Package className="w-8 h-8 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {salesReport?.totalOrders?.toLocaleString() || '0'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Monthly Revenue Chart */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
//             <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//               <option>Last 12 months</option>
//               <option>Last 6 months</option>
//               <option>Last 3 months</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analytics?.monthlyRevenue || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
//               />
//               <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Orders Trend */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
//             <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//               <option>Last 12 months</option>
//               <option>Last 6 months</option>
//               <option>Last 3 months</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={analytics?.ordersData || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
//               />
//               <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Revenue Area Chart */}

//   // Dashboard Data Fetch
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE}/dashboard`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Dashboard data:', result);
      
//       if (result.success && result.data) {
//         // Map the backend response to frontend expected format
//         const mappedData = {
//           totalOrders: result.data.totalCounts?.orders || 0,
//           totalRevenue: result.data.monthlyStats?.revenue || 0,
//           totalCustomers: result.data.totalCounts?.users || 0,
//           ordersGrowth: 12, // You can calculate this from historical data
//           revenueGrowth: 8,
//           customersGrowth: 15,
//           conversionRate: 3.2,
//           conversionGrowth: 2.1,
//           newCustomers: result.data.weeklyStats?.orders || 0,
//           avgOrderValue: result.data.monthlyStats?.revenue && result.data.totalCounts?.orders 
//             ? (result.data.monthlyStats.revenue / result.data.totalCounts.orders).toFixed(2)
//             : 0
//         };
        
//         setDashboardData(mappedData);
        
//         // Set recent orders
//         if (result.data.recentOrders) {
//           setOrders(result.data.recentOrders);
//           setFilteredOrders(result.data.recentOrders);
//         }
        
//         // Set inventory alerts
//         if (result.data.lowStockProducts) {
//           const alerts = result.data.lowStockProducts.map(product => ({
//             productName: product.name,
//             currentStock: product.stock,
//             minStock: 10, // Default minimum stock
//             price: product.price
//           }));
//           setInventoryAlerts(alerts);
//         }
//       }
//     } catch (error) {
//       handleApiError(error, 'Load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Order Statistics Fetch
//   const fetchOrderStatistics = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/statistics`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Order statistics:', result);
      
//       if (result.success && result.data) {
//         // Map order status distribution
//         const ordersByStatus = result.data.statusCounts?.map(item => ({
//           name: item._id,
//           count: item.count,
//           value: item.count
//         })) || [];
        
//         setOrderStats({
//           ordersByStatus,
//           totalOrders: result.data.totalOrders || 0,
//           pendingOrders: result.data.pendingOrders || 0,
//           completedOrders: result.data.completedOrders || 0
//         });
//       }
//     } catch (error) {
//       handleApiError(error, 'Load order statistics');
//     }
//   };

//   // Orders Fetch with Filters
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams({
//         page: currentPage,
//         limit: ordersPerPage
//       });
      
//       if (statusFilter !== 'all') {
//         queryParams.append('status', statusFilter);
//       }
      
//       if (searchTerm) {
//         queryParams.append('search', searchTerm);
//       }
      
//       // Map date filter to actual dates
//       const now = new Date();
//       let dateFrom;
      
//       switch (dateFilter) {
//         case '7days':
//           dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//           break;
//         case '30days':
//           dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//           break;
//         case '90days':
//           dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//           break;
//         case '1year':
//           dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//           break;
//       }
      
//       if (dateFrom) {
//         queryParams.append('dateFrom', dateFrom.toISOString());
//       }
      
//       const response = await fetch(`${API_BASE}/orders?${queryParams}`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Orders data:', result);
      
//       if (result.success && result.data) {
//         // Map the orders to match frontend expected format
//         const mappedOrders = result.data.map(order => ({
//           _id: order._id,
//           trackingNumber: order.trackingNumber,
//           status: order.orderStatus,
//           totalAmount: order.orderSummary?.totalAmount || 0,
//           createdAt: order.createdAt,
//           user: order.user || {},
//           shippingAddress: {
//             fullName: order.shippingInfo?.fullName || 'N/A',
//             phone: order.shippingInfo?.phone || 'N/A',
//             address: order.shippingInfo?.address || 'N/A',
//             city: order.shippingInfo?.city || 'N/A',
//             state: order.shippingInfo?.state || 'N/A',
//             zipCode: order.shippingInfo?.postalCode || 'N/A',
//             country: order.shippingInfo?.country || 'N/A'
//           },
//           orderItems: order.orderItems || [],
//           paymentMethod: order.paymentMethod?.type || 'N/A',
//           shippingPrice: order.orderSummary?.shippingCost || 0,
//           taxPrice: order.orderSummary?.tax || 0
//         }));
        
//         setOrders(mappedOrders);
//         setFilteredOrders(mappedOrders);
//       }
//     } catch (error) {
//       handleApiError(error, 'Load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Single Order Fetch
//   const fetchSingleOrder = async (orderId) => {
//     try {
//       const response = await fetch(`${API_BASE}/orders/${orderId}`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Single order data:', result);
      
//       if (result.success && result.data) {
//         const order = result.data;
//         const mappedOrder = {
//           _id: order._id,
//           trackingNumber: order.trackingNumber,
//           status: order.orderStatus,
//           totalAmount: order.orderSummary?.totalAmount || 0,
//           createdAt: order.createdAt,
//           user: order.user || {},
//           shippingAddress: {
//             fullName: order.shippingInfo?.fullName || 'N/A',
//             phone: order.shippingInfo?.phone || 'N/A',
//             address: order.shippingInfo?.address || 'N/A',
//             city: order.shippingInfo?.city || 'N/A',
//             state: order.shippingInfo?.state || 'N/A',
//             zipCode: order.shippingInfo?.postalCode || 'N/A',
//             country: order.shippingInfo?.country || 'N/A'
//           },
//           orderItems: order.orderItems || [],
//           paymentMethod: order.paymentMethod?.type || 'N/A',
//           shippingPrice: order.orderSummary?.shippingCost || 0,
//           taxPrice: order.orderSummary?.tax || 0
//         };
        
//         setSelectedOrder(mappedOrder);
//       }
//     } catch (error) {
//       handleApiError(error, 'Load order details');
//     }
//   };

//   // Analytics Fetch
//   const fetchAnalytics = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/analytics/revenue`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Analytics data:', result);
      
//       if (result.success && result.data) {
//         // Map revenue data for charts
//         const revenueData = result.data.revenueData?.map(item => ({
//           date: `Month ${item._id}`,
//           revenue: item.totalRevenue || 0,
//           orders: item.totalOrders || 0
//         })) || [];
        
//         const monthlyRevenue = result.data.revenueData?.map(item => ({
//           month: `Month ${item._id}`,
//           revenue: item.totalRevenue || 0
//         })) || [];
        
//         const ordersData = result.data.revenueData?.map(item => ({
//           date: `Month ${item._id}`,
//           orders: item.totalOrders || 0
//         })) || [];
        
//         setAnalytics({
//           revenueData,
//           monthlyRevenue,
//           ordersData
//         });
//       }
//     } catch (error) {
//       handleApiError(error, 'Load analytics');
//     }
//   };

//   // Sales Report Fetch
//   const fetchSalesReport = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/reports/sales`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Sales report data:', result);
      
//       if (result.success && result.data) {
//         const report = {
//           totalSales: result.data.summary?.totalRevenue || 0,
//           totalOrders: result.data.summary?.totalOrders || 0,
//           averageOrderValue: result.data.summary?.averageOrderValue || 0,
//           topProducts: [] // This would need to be populated from a separate endpoint
//         };
        
//         setSalesReport(report);
//       }
//     } catch (error) {
//       handleApiError(error, 'Load sales report');
//     }
//   };

//   // Inventory Alerts Fetch
//   const fetchInventoryAlerts = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/inventory-alerts`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Inventory alerts data:', result);
      
//       if (result.success && result.data) {
//         const alerts = [];
        
//         // Low stock products
//         if (result.data.lowStockProducts) {
//           alerts.push(...result.data.lowStockProducts.map(product => ({
//             productName: product.name,
//             currentStock: product.stock,
//             minStock: 5,
//             type: 'low_stock'
//           })));
//         }
        
//         // Out of stock products
//         if (result.data.outOfStockProducts) {
//           alerts.push(...result.data.outOfStockProducts.map(product => ({
//             productName: product.name,
//             currentStock: product.stock,
//             minStock: 1,
//             type: 'out_of_stock'
//           })));
//         }
        
//         setInventoryAlerts(alerts);
//       }
//     } catch (error) {
//       handleApiError(error, 'Load inventory alerts');
//     }
//   };

//   // Update Order Status
//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ status: status })
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Update status result:', result);
      
//       if (result.success) {
//         // Update local state
//         setOrders(orders.map(order => 
//           order._id === orderId ? { ...order, status } : order
//         ));
//         setFilteredOrders(filteredOrders.map(order => 
//           order._id === orderId ? { ...order, status } : order
//         ));
        
//         // Update selected order if it's the same
//         if (selectedOrder && selectedOrder._id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status });
//         }
        
//         alert('Order status updated successfully!');
//       }
//     } catch (error) {
//       handleApiError(error, 'Update order status');
//     }
//   };

//   // Bulk Update Orders
//   const bulkUpdateStatus = async (status) => {
//     if (bulkSelected.length === 0) {
//       alert('Please select orders to update');
//       return;
//     }
    
//     try {
//       const response = await fetch(`${API_BASE}/orders/bulk-update`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ 
//           orderIds: bulkSelected,
//           status 
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         setBulkSelected([]);
//         fetchOrders();
//         alert(`${bulkSelected.length} orders updated successfully!`);
//       }
//     } catch (error) {
//       handleApiError(error, 'Bulk update orders');
//     }
//   };

//   // Export Orders
//   const exportOrders = async (format = 'csv') => {
//     try {
//       const response = await fetch(`${API_BASE}/export/orders?format=${format}`, {
//         headers: getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success && result.data) {
//         // Convert JSON data to CSV format
//         const csvContent = convertToCSV(result.data);
//         downloadCSV(csvContent, `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
//         alert('Orders exported successfully!');
//       }
//     } catch (error) {
//       handleApiError(error, 'Export orders');
//     }
//   };

//   // Helper function to convert JSON to CSV
//   const convertToCSV = (data) => {
//     if (!data || data.length === 0) return '';
    
//     const headers = Object.keys(data[0]);
//     const csvHeaders = headers.join(',');
    
//     const csvRows = data.map(row => 
//       headers.map(header => {
//         const value = row[header];
//         return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
//       }).join(',')
//     );
    
//     return [csvHeaders, ...csvRows].join('\n');
//   };

//   // Helper function to download CSV
//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Initial data load
//   useEffect(() => {
//     fetchDashboardData();
//     fetchOrderStatistics();
//     fetchAnalytics();
//     fetchInventoryAlerts();
//     fetchSalesReport();
//   }, []);

//   // Refetch orders when filters change
//   useEffect(() => {
//     if (activeTab === 'orders') {
//       fetchOrders();
//     }
//   }, [statusFilter, dateFilter, searchTerm, currentPage, activeTab]);

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
//       processing: 'bg-blue-100 text-blue-800 border-blue-200',
//       shipped: 'bg-purple-100 text-purple-800 border-purple-200',
//       delivered: 'bg-green-100 text-green-800 border-green-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       pending: <Clock className="w-4 h-4" />,
//       confirmed: <CheckCircle className="w-4 h-4" />,
//       processing: <RefreshCw className="w-4 h-4" />,
//       shipped: <Truck className="w-4 h-4" />,
//       delivered: <CheckCircle className="w-4 h-4" />,
//       cancelled: <XCircle className="w-4 h-4" />
//     };
//     return icons[status?.toLowerCase()] || <Package className="w-4 h-4" />;
//   };

//   // Dashboard Overview Component
//   const DashboardOverview = () => (
//     <div className="space-y-6">
//       {/* Error Alert */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex">
//             <AlertTriangle className="w-5 h-5 text-red-400" />
//             <div className="ml-3">
//               <p className="text-sm text-red-800">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Orders</p>
//               <p className="text-3xl font-bold text-gray-900 mt-1">
//                 {dashboardData?.totalOrders?.toLocaleString() || '0'}
//               </p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 +{dashboardData?.ordersGrowth || 0}% from last month
//               </p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <ShoppingBag className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Revenue</p>
//               <p className="text-3xl font-bold text-gray-900 mt-1">
//                 PKR {dashboardData?.totalRevenue?.toLocaleString() || '0'}
//               </p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 +{dashboardData?.revenueGrowth || 0}% from last month
//               </p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <DollarSign className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Customers</p>
//               <p className="text-3xl font-bold text-gray-900 mt-1">
//                 {dashboardData?.totalCustomers?.toLocaleString() || '0'}
//               </p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 +{dashboardData?.customersGrowth || 0}% from last month
//               </p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <Users className="w-8 h-8 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
//               <p className="text-3xl font-bold text-gray-900 mt-1">
//                 PKR {dashboardData?.avgOrderValue || 0}
//               </p>
//               <p className="text-xs text-green-600 mt-2 flex items-center">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 +{dashboardData?.conversionGrowth || 0}% from last month
//               </p>
//             </div>
//             <div className="bg-indigo-100 p-3 rounded-lg">
//               <TrendingUp className="w-8 h-8 text-indigo-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Chart */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
//             <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//               <option>Last 30 days</option>
//               <option>Last 7 days</option>
//               <option>Last 90 days</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={analytics?.ordersData || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
//               />
//               <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Order Status Distribution */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
//             <button 
//               onClick={() => setActiveTab('orders')}
//               className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//             >
//               View Details
//             </button>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={orderStats?.ordersByStatus || []}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="count"
//               >
//                 {(orderStats?.ordersByStatus || []).map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Orders & Inventory Alerts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
//               <button 
//                 onClick={() => setActiveTab('orders')}
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
//               >
//                 View All
//                 <ExternalLink className="w-4 h-4 ml-1" />
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {orders.slice(0, 5).map((order) => (
//                   <tr key={order._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{order.trackingNumber || order._id?.slice(-8)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
//                         </div>
//                         <div className="text-sm text-gray-500">{order.user?.email}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       PKR {order.totalAmount?.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
//                         {getStatusIcon(order.status)}
//                         {order.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Inventory Alerts */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
//                 <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
//               </div>
//               <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                 {inventoryAlerts.length} alerts
//               </span>
//             </div>
//           </div>
//           <div className="overflow-y-auto max-h-96">
//             {inventoryAlerts.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {inventoryAlerts.map((alert, index) => (
//                   <li key={index} className="p-4 hover:bg-gray-50">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-gray-900">{alert.productName}</p>
//                         <p className="text-sm text-gray-600">
//                           Stock: {alert.currentStock} (Min: {alert.minStock})
//                         </p>
//                       </div>
//                       <button className="px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors">
//                         Restock
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="text-center py-12">
//                 <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory alerts</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   All products are sufficiently stocked
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Orders Management Component
//   const OrdersManagement = () => (
//     <div className="space-y-6">
//       {/* Filters and Actions */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Status Filter */}
//             <select
//               className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>

//             {/* Date Filter */}
//             <select
//               className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//             >
//               <option value="7days">Last 7 days</option>
//               <option value="30days">Last 30 days</option>
//               <option value="90days">Last 90 days</option>
//               <option value="1year">Last year</option>
//             </select>
//           </div>

//           <div className="flex gap-2">
//             {/* Bulk Actions */}
//             {bulkSelected.length > 0 && (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => bulkUpdateStatus('processing')}
//                   className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
//                 >
//                   Mark Processing ({bulkSelected.length})
//                 </button>
//                 <button
//                   onClick={() => bulkUpdateStatus('shipped')}
//                   className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
//                 >
//                   Mark Shipped ({bulkSelected.length})
//                 </button>
//               </div>
//             )}

//             {/* Export */}
//             <button
//               onClick={() => exportOrders('csv')}
//               className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setBulkSelected(filteredOrders.map(order => order._id));
//                       } else {
//                         setBulkSelected([]);
//                       }
//                     }}
//                     checked={bulkSelected.length === filteredOrders.length && filteredOrders.length > 0}
//                   />
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                       checked={bulkSelected.includes(order._id)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setBulkSelected([...bulkSelected, order._id]);
//                         } else {
//                           setBulkSelected(bulkSelected.filter(id => id !== order._id));
//                         }
//                       }}
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     #{order.trackingNumber || order._id?.slice(-8) || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {order.user?.email || 'N/A'}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                     PKR {order.totalAmount?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
//                       {getStatusIcon(order.status)}
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => fetchSingleOrder(order._id)}
//                         className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
//                         title="View Details"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <select
//                         value={order.status}
//                         onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                         className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="confirmed">Confirmed</option>
//                         <option value="processing">Processing</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="delivered">Delivered</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {filteredOrders.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Try adjusting your search or filter criteria.
//             </p>
//           </div>
//         )}

//         {loading && (
//           <div className="text-center py-12">
//             <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin" />
//             <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredOrders.length > 0 && (
//         <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-2 text-sm font-medium text-gray-700">
//                 Page {currentPage}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={filteredOrders.length < ordersPerPage}
//                 className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Order Detail Modal
//   const OrderDetailModal = () => {
//     if (!selectedOrder) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//                 <p className="text-sm text-gray-500">Order #{selectedOrder.trackingNumber || selectedOrder._id?.slice(-8)}</p>
//               </div>
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <XCircle className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Order Info */}
//               <div className="space-y-4">
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <h3 className="font-semibold mb-3 text-gray-900">Order Information</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Order ID:</span>
//                       <span className="font-medium">#{selectedOrder.trackingNumber || selectedOrder._id?.slice(-8)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Date:</span>
//                       <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Status:</span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
//                         {selectedOrder.status}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Payment Method:</span>
//                       <span className="font-medium">{selectedOrder.paymentMethod}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Total Amount:</span>
//                       <span className="font-bold text-green-600">PKR {selectedOrder.totalAmount?.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Customer Info */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <h3 className="font-semibold mb-3 text-gray-900">Customer Information</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Name:</span>
//                       <span className="font-medium">{selectedOrder.shippingAddress?.fullName}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{selectedOrder.user?.email}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Phone:</span>
//                       <span className="font-medium">{selectedOrder.shippingAddress?.phone}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <h3 className="font-semibold mb-3 text-gray-900">Shipping Address</h3>
//                   <div className="text-sm text-gray-700">
//                     <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
//                     <p>{selectedOrder.shippingAddress?.address}</p>
//                     <p>
//                       {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
//                     </p>
//                     <p>{selectedOrder.shippingAddress?.country}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div>
//                 <h3 className="font-semibold mb-4 text-gray-900">Order Items</h3>
//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {selectedOrder.orderItems?.map((item, index) => (
//                     <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       <img 
//                         src={item.image || '/api/placeholder/60/60'} 
//                         alt={item.name}
//                         className="w-15 h-15 object-cover rounded border"
//                       />
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-900">{item.name}</p>
//                         <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                         <p className="text-sm text-gray-600">PKR {item.price?.toFixed(2)} each</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-gray-900">PKR {(item.price * item.quantity)?.toFixed(2)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Summary */}
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Subtotal:</span>
//                       <span>PKR {(selectedOrder.totalAmount - (selectedOrder.shippingPrice || 0) - (selectedOrder.taxPrice || 0))?.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Shipping:</span>
//                       <span>PKR {selectedOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Tax:</span>
//                       <span>PKR {selectedOrder.taxPrice?.toFixed(2) || '0.00'}</span>
//                     </div>
//                     <div className="border-t pt-2 flex justify-between font-bold">
//                       <span>Total:</span>
//                       <span>PKR {selectedOrder.totalAmount?.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-6 flex flex-wrap gap-3">
//               <select
//                 value={selectedOrder.status}
//                 onChange={(e) => {
//                   updateOrderStatus(selectedOrder._id, e.target.value);
//                   setSelectedOrder({...selectedOrder, status: e.target.value});
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
              
//               <button 
//                 onClick={() => alert('Email functionality will be implemented!')}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
//               >
//                 <Mail className="w-4 h-4" />
//                 Send Update Email
//               </button>
              
//               <button 
//                 onClick={() => alert('Print functionality will be implemented!')}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
//               >
//                 <FileText className="w-4 h-4" />
//                 Print Invoice
//               </button>

//               <button 
//                 onClick={() => {
//                   const trackingNumber = prompt('Enter tracking number:');
//                   if (trackingNumber) {
//                     alert('Tracking update functionality will be implemented!');
//                   }
//                 }}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
//               >
//                 <Truck className="w-4 h-4" />
//                 Add Tracking
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
//   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
//             <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//               <option>Last 12 months</option>
//               <option>Last 6 months</option>
//               <option>Last 3 months</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={analytics?.revenueData || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
//               <YAxis stroke="#64748b" fontSize={12} />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
//               />
//               <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} fill="#8B5CF6" fillOpacity={0.2} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Product Performance */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
//             <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//               <option>This month</option>
//               <option>Last 30 days</option>
//               <option>Last 90 days</option>
//             </select>
//           </div>
//           <div className="space-y-4">
//             {(salesReport?.topProducts || []).slice(0, 5).map((product, index) => (
//               <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <Package className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">{product.name}</p>
//                     <p className="text-sm text-gray-600">{product.sold} sold</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-gray-900">PKR {product.revenue?.toFixed(2)}</p>
//                   <p className="text-sm text-green-600">+{product.growth}%</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Performance Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 {((salesReport?.totalOrders / (dashboardData?.totalCustomers || 1)) * 100)?.toFixed(1) || '0'}%
//               </p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <TrendingUp className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">
//                 PKR {((salesReport?.totalSales || 0) / (dashboardData?.totalCustomers || 1))?.toFixed(0) || '0'}
//               </p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <Users className="w-8 h-8 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Return Rate</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">2.1%</p>
//             </div>
//             <div className="bg-red-100 p-3 rounded-lg">
//               <RefreshCw className="w-8 h-8 text-red-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Export Options */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => alert('Revenue report export will be implemented!')}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             Revenue Report
//           </button>
//           <button
//             onClick={() => alert('Sales report export will be implemented!')}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             Sales Report
//           </button>
//           <button
//             onClick={() => alert('Customer report export will be implemented!')}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             Customer Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Customers Management Component
//   const CustomersManagement = () => (
//     <div className="space-y-6">
//       {/* Customers Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
//             <p className="text-gray-600">Manage your store settings and preferences</p>
//           </div>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//             <Settings className="w-4 h-4" />
//             Save Changes
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Settings Navigation */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">Settings Menu</h3>
//           </div>
//           <nav className="p-6 space-y-2">
//             {[
//               { id: 'general', icon: Settings, label: 'General Settings' },
//               { id: 'payment', icon: DollarSign, label: 'Payment Methods' },
//               { id: 'shipping', icon: Truck, label: 'Shipping Options' },
//               { id: 'notifications', icon: Bell, label: 'Notifications' },
//               { id: 'security', icon: Settings, label: 'Security' },
//               { id: 'integrations', icon: Settings, label: 'Integrations' }
//             ].map((item) => (
//               <button
//                 key={item.id}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//               >
//                 <item.icon className="w-5 h-5" />
//                 {item.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Settings Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* General Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="My E-commerce Store"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="admin@store.com"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
//                 <textarea
//                   rows={3}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   defaultValue="Welcome to our online store where you can find amazing products at great prices."
//                 />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                   <input
//                     type="tel"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="+92 300 1234567"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//                   <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                     <option>PKR - Pakistani Rupee</option>
//                     <option>USD - US Dollar</option>
//                     <option>EUR - Euro</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
//             <div className="space-y-4">
//               {[
//                 { name: 'Cash on Delivery', enabled: true, description: 'Accept cash payments on delivery' },
//                 { name: 'Credit/Debit Cards', enabled: true, description: 'Accept card payments via Stripe' },
//                 { name: 'Bank Transfer', enabled: false, description: 'Direct bank transfer payments' },
//                 { name: 'JazzCash', enabled: true, description: 'Mobile wallet payments' },
//                 { name: 'EasyPaisa', enabled: true, description: 'Mobile wallet payments' }
//               ].map((method, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{method.name}</h4>
//                     <p className="text-sm text-gray-600">{method.description}</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked={method.enabled} />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Shipping Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Options</h3>
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
//                   <input
//                     type="number"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="5000"
//                     placeholder="Amount in PKR"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Cost</label>
//                   <input
//                     type="number"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="200"
//                     placeholder="Amount in PKR"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 {[
//                   { name: 'Standard Delivery', time: '3-5 days', cost: 200, enabled: true },
//                   { name: 'Express Delivery', time: '1-2 days', cost: 500, enabled: true },
//                   { name: 'Same Day Delivery', time: 'Same day', cost: 800, enabled: false }
//                 ].map((option, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div>
//                       <h4 className="font-medium text-gray-900">{option.name}</h4>
//                       <p className="text-sm text-gray-600">{option.time} - PKR {option.cost}</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" defaultChecked={option.enabled} />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Notification Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
//             <div className="space-y-4">
//               {[
//                 { name: 'New Order Notifications', description: 'Get notified when new orders are placed', enabled: true },
//                 { name: 'Low Stock Alerts', description: 'Get alerted when products are running low', enabled: true },
//                 { name: 'Daily Sales Reports', description: 'Receive daily sales summary via email', enabled: false },
//                 { name: 'Customer Reviews', description: 'Get notified about new customer reviews', enabled: true },
//                 { name: 'Marketing Updates', description: 'Receive marketing and promotional updates', enabled: false }
//               ].map((notification, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{notification.name}</h4>
//                     <p className="text-sm text-gray-600">{notification.description}</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Main Navigation
//   const navigationItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'orders', label: 'Orders', icon: ShoppingBag },
//     { id: 'customers', label: 'Customers', icon: Users },
//     { id: 'inventory', label: 'Inventory', icon: Package },
//     { id: 'analytics', label: 'Analytics', icon: TrendingUp },
//     { id: 'settings', label: 'Settings', icon: Settings }
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardOverview />;
//       case 'orders':
//         return <OrdersManagement />;
//       case 'customers':
//         return <CustomersManagement />;
//       case 'inventory':
//         return <InventoryManagement />;
//       case 'analytics':
//         return <AnalyticsView />;
//       case 'settings':
//         return <SettingsManagement />;
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className="flex items-center">
//                 <div className="bg-blue-600 p-2 rounded-lg">
//                   <ShoppingBag className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="ml-3">
//                   <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Notifications */}
//               <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bell className="w-6 h-6" />
//                 {inventoryAlerts.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {inventoryAlerts.length}
//                   </span>
//                 )}
//               </button>

//               {/* Profile */}
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                   <span className="text-blue-600 font-medium text-sm">A</span>
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="text-sm font-medium text-gray-900">Admin User</p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//                 <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-6">
//           {/* Sidebar */}
//           <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
//             <nav className="p-6 space-y-2">
//               {navigationItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveTab(item.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                     activeTab === item.id
//                       ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   {item.label}
//                   {item.id === 'orders' && bulkSelected.length > 0 && (
//                     <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
//                       {bulkSelected.length}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {renderContent()}
//           </div>
//         </div>
//       </div>

//       {/* Order Detail Modal */}
//       {selectedOrder && <OrderDetailModal />}

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-2xl">
//             <div className="flex items-center gap-3">
//               <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
//               <span className="text-lg font-medium text-gray-900">Loading...</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard; and view customer information</p>
//           </div>
//           <div className="flex gap-3">
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//               <Plus className="w-4 h-4" />
//               Add Customer
//             </button>
//             <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Customer Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Customers</p>
//               <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalCustomers?.toLocaleString() || '0'}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <TrendingUp className="w-8 h-8 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">New This Month</p>
//               <p className="text-2xl font-bold text-gray-900">{dashboardData?.newCustomers || '0'}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <Star className="w-8 h-8 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">VIP Customers</p>
//               <p className="text-2xl font-bold text-gray-900">156</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-indigo-100 rounded-lg">
//               <DollarSign className="w-8 h-8 text-indigo-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
//               <p className="text-2xl font-bold text-gray-900">PKR {dashboardData?.avgOrderValue || '0'}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Customer Filters */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search customers..."
//                 className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//               />
//             </div>
//             <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option>All Customers</option>
//               <option>Active</option>
//               <option>Inactive</option>
//               <option>VIP</option>
//             </select>
//             <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option>All Time</option>
//               <option>Last 30 days</option>
//               <option>Last 90 days</option>
//               <option>Last year</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Customers Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {/* Sample customer data - replace with actual data */}
//               {[
//                 { id: 1, name: 'Ahmad Ali', email: 'ahmad@example.com', orders: 12, totalSpent: 25000, lastOrder: '2024-01-15', status: 'Active' },
//                 { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', orders: 8, totalSpent: 18500, lastOrder: '2024-01-10', status: 'Active' },
//                 { id: 3, name: 'Hassan Sheikh', email: 'hassan@example.com', orders: 25, totalSpent: 45000, lastOrder: '2024-01-20', status: 'VIP' }
//               ].map((customer) => (
//                 <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-medium text-sm">
//                           {customer.name.split(' ').map(n => n[0]).join('')}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{customer.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {customer.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                     {customer.orders}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                     PKR {customer.totalSpent.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(customer.lastOrder).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
//                     }`}>
//                       {customer.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center gap-2">
//                       <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
//                         <Mail className="w-4 h-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   // Inventory Management Component
//   const InventoryManagement = () => (
//     <div className="space-y-6">
//       {/* Inventory Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
//             <p className="text-gray-600">Monitor stock levels and manage products</p>
//           </div>
//           <div className="flex gap-3">
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//               <Plus className="w-4 h-4" />
//               Add Product
//             </button>
//             <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors">
//               <Download className="w-4 h-4" />
//               Export Inventory
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Inventory Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Package className="w-8 h-8 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Products</p>
//               <p className="text-2xl font-bold text-gray-900">1,245</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-red-100 rounded-lg">
//               <AlertTriangle className="w-8 h-8 text-red-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Low Stock</p>
//               <p className="text-2xl font-bold text-gray-900">{inventoryAlerts.length}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-orange-100 rounded-lg">
//               <XCircle className="w-8 h-8 text-orange-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Out of Stock</p>
//               <p className="text-2xl font-bold text-gray-900">23</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <DollarSign className="w-8 h-8 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Value</p>
//               <p className="text-2xl font-bold text-gray-900">PKR 2.5M</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Low Stock Alerts */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
//             <h3 className="text-lg font-semibold text-gray-900">Urgent: Low Stock Alerts</h3>
//           </div>
//           <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//             {inventoryAlerts.length} items
//           </span>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {inventoryAlerts.slice(0, 6).map((alert, index) => (
//             <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-gray-900">{alert.productName}</p>
//                   <p className="text-sm text-red-600">Only {alert.currentStock} left!</p>
//                 </div>
//                 <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
//                   Restock
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Product Search and Filters */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//               />
//             </div>
//             <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option>All Categories</option>
//               <option>Electronics</option>
//               <option>Clothing</option>
//               <option>Books</option>
//               <option>Home & Garden</option>
//             </select>
//             <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option>All Stock Levels</option>
//               <option>In Stock</option>
//               <option>Low Stock</option>
//               <option>Out of Stock</option>
//             </select>
//           </div>
//           <div className="flex gap-2">
//             <button className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors">
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {/* Sample product data */}
//               {[
//                 { id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', stock: 45, price: 8999, status: 'In Stock' },
//                 { id: 2, name: 'Cotton T-Shirt', sku: 'CT-002', category: 'Clothing', stock: 3, price: 1999, status: 'Low Stock' },
//                 { id: 3, name: 'JavaScript Book', sku: 'JS-003', category: 'Books', stock: 0, price: 2499, status: 'Out of Stock' }
//               ].map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
//                         <Package className="w-6 h-6 text-gray-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {product.sku}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {product.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       product.stock === 0 ? 'bg-red-100 text-red-800' :
//                       product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {product.stock} units
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                     PKR {product.price.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
//                       product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {product.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center gap-2">
//                       <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
//                         <Plus className="w-4 h-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   // Settings Component
//   const SettingsManagement = () => (
//     <div className="space-y-6">
//       {/* Settings Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
//             {/* <p className="text-gray-600">Manage */}
//             </div>
//      </div>
//    </div>
//  );

//  // Analytics View Component
//  const AnalyticsView = () => (
//    <div className="space-y-6">
//      {/* Analytics Header */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <div className="flex items-center justify-between">
//          <div>
//            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
//            <p className="text-gray-600">Detailed insights into your business performance</p>
//          </div>
//          <div className="flex gap-3">
//            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
//              <option>Last 30 days</option>
//              <option>Last 90 days</option>
//              <option>Last 6 months</option>
//              <option>Last year</option>
//            </select>
//            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//              <Download className="w-4 h-4" />
//              Generate Report
//            </button>
//          </div>
//        </div>
//      </div>

//      {/* Key Metrics */}
//      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-blue-100 rounded-lg">
//              <DollarSign className="w-8 h-8 text-blue-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//              <p className="text-2xl font-bold text-gray-900">PKR {salesReport?.totalSales?.toLocaleString() || '0'}</p>
//              <p className="text-sm text-green-600">+12.5% from last month</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-green-100 rounded-lg">
//              <ShoppingBag className="w-8 h-8 text-green-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Orders</p>
//              <p className="text-2xl font-bold text-gray-900">{salesReport?.totalOrders?.toLocaleString() || '0'}</p>
//              <p className="text-sm text-green-600">+8.2% from last month</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-purple-100 rounded-lg">
//              <Users className="w-8 h-8 text-purple-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Customers</p>
//              <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalCustomers?.toLocaleString() || '0'}</p>
//              <p className="text-sm text-blue-600">+15.3% from last month</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-orange-100 rounded-lg">
//              <TrendingUp className="w-8 h-8 text-orange-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
//              <p className="text-2xl font-bold text-gray-900">24.8%</p>
//              <p className="text-sm text-green-600">+3.1% from last month</p>
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Charts Section */}
//      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//        {/* Revenue Growth Chart */}
//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center justify-between mb-6">
//            <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
//            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//              <option>Last 12 months</option>
//              <option>Last 6 months</option>
//              <option>Last 3 months</option>
//            </select>
//          </div>
//          <ResponsiveContainer width="100%" height={300}>
//            <AreaChart data={analytics?.revenueData || []}>
//              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
//              <YAxis stroke="#64748b" fontSize={12} />
//              <Tooltip 
//                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
//              />
//              <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} fill="#8B5CF6" fillOpacity={0.2} />
//            </AreaChart>
//          </ResponsiveContainer>
//        </div>

//        {/* Product Performance */}
//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center justify-between mb-6">
//            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
//            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
//              <option>This month</option>
//              <option>Last 30 days</option>
//              <option>Last 90 days</option>
//            </select>
//          </div>
//          <div className="space-y-4">
//            {(salesReport?.topProducts || []).slice(0, 5).map((product, index) => (
//              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                <div className="flex items-center gap-3">
//                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                    <Package className="w-5 h-5 text-blue-600" />
//                  </div>
//                  <div>
//                    <p className="font-medium text-gray-900">{product.name}</p>
//                    <p className="text-sm text-gray-600">{product.sold} sold</p>
//                  </div>
//                </div>
//                <div className="text-right">
//                  <p className="font-bold text-gray-900">PKR {product.revenue?.toFixed(2)}</p>
//                  <p className="text-sm text-green-600">+{product.growth}%</p>
//                </div>
//              </div>
//            ))}
//          </div>
//        </div>
//      </div>

//      {/* Performance Metrics */}
//      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
//              <p className="text-2xl font-bold text-gray-900 mt-1">
//                {((salesReport?.totalOrders / (dashboardData?.totalCustomers || 1)) * 100)?.toFixed(1) || '0'}%
//              </p>
//            </div>
//            <div className="bg-green-100 p-3 rounded-lg">
//              <TrendingUp className="w-8 h-8 text-green-600" />
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
//              <p className="text-2xl font-bold text-gray-900 mt-1">
//                PKR {((salesReport?.totalSales || 0) / (dashboardData?.totalCustomers || 1))?.toFixed(0) || '0'}
//              </p>
//            </div>
//            <div className="bg-purple-100 p-3 rounded-lg">
//              <Users className="w-8 h-8 text-purple-600" />
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center justify-between">
//            <div>
//              <p className="text-sm font-medium text-gray-600">Return Rate</p>
//              <p className="text-2xl font-bold text-gray-900 mt-1">2.1%</p>
//            </div>
//            <div className="bg-red-100 p-3 rounded-lg">
//              <RefreshCw className="w-8 h-8 text-red-600" />
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Export Options */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
//        <div className="flex flex-wrap gap-3">
//          <button
//            onClick={() => alert('Revenue report export will be implemented!')}
//            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
//          >
//            <Download className="w-4 h-4" />
//            Revenue Report
//          </button>
//          <button
//            onClick={() => alert('Sales report export will be implemented!')}
//            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
//          >
//            <Download className="w-4 h-4" />
//            Sales Report
//          </button>
//          <button
//            onClick={() => alert('Customer report export will be implemented!')}
//            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
//          >
//            <Download className="w-4 h-4" />
//            Customer Report
//          </button>
//        </div>
//      </div>
//    </div>
//  );

//  // Customers Management Component
//  const CustomersManagement = () => (
//    <div className="space-y-6">
//      {/* Customers Header */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <div className="flex items-center justify-between">
//          <div>
//            <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
//            <p className="text-gray-600">Manage customers and view customer information</p>
//          </div>
//          <div className="flex gap-3">
//            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//              <Plus className="w-4 h-4" />
//              Add Customer
//            </button>
//            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors">
//              <Download className="w-4 h-4" />
//              Export
//            </button>
//          </div>
//        </div>
//      </div>

//      {/* Customer Stats */}
//      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-blue-100 rounded-lg">
//              <Users className="w-8 h-8 text-blue-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Total Customers</p>
//              <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalCustomers?.toLocaleString() || '0'}</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-green-100 rounded-lg">
//              <TrendingUp className="w-8 h-8 text-green-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">New This Month</p>
//              <p className="text-2xl font-bold text-gray-900">{dashboardData?.newCustomers || '0'}</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-purple-100 rounded-lg">
//              <Star className="w-8 h-8 text-purple-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">VIP Customers</p>
//              <p className="text-2xl font-bold text-gray-900">156</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-indigo-100 rounded-lg">
//              <DollarSign className="w-8 h-8 text-indigo-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
//              <p className="text-2xl font-bold text-gray-900">PKR {dashboardData?.avgOrderValue || '0'}</p>
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Customer Filters */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//          <div className="flex flex-col sm:flex-row gap-4">
//            <div className="relative">
//              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//              <input
//                type="text"
//                placeholder="Search customers..."
//                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//              />
//            </div>
//            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//              <option>All Customers</option>
//              <option>Active</option>
//              <option>Inactive</option>
//              <option>VIP</option>
//            </select>
//            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//              <option>All Time</option>
//              <option>Last 30 days</option>
//              <option>Last 90 days</option>
//              <option>Last year</option>
//            </select>
//          </div>
//        </div>
//      </div>

//      {/* Customers Table */}
//      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//        <div className="overflow-x-auto">
//          <table className="min-w-full divide-y divide-gray-200">
//            <thead className="bg-gray-50">
//              <tr>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//              </tr>
//            </thead>
//            <tbody className="bg-white divide-y divide-gray-200">
//              {/* Sample customer data - replace with actual data */}
//              {[
//                { id: 1, name: 'Ahmad Ali', email: 'ahmad@example.com', orders: 12, totalSpent: 25000, lastOrder: '2024-01-15', status: 'Active' },
//                { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', orders: 8, totalSpent: 18500, lastOrder: '2024-01-10', status: 'Active' },
//                { id: 3, name: 'Hassan Sheikh', email: 'hassan@example.com', orders: 25, totalSpent: 45000, lastOrder: '2024-01-20', status: 'VIP' }
//              ].map((customer) => (
//                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
//                  <td className="px-6 py-4 whitespace-nowrap">
//                    <div className="flex items-center">
//                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                        <span className="text-blue-600 font-medium text-sm">
//                          {customer.name.split(' ').map(n => n[0]).join('')}
//                        </span>
//                      </div>
//                      <div className="ml-4">
//                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
//                      </div>
//                    </div>
//                  </td>
//                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                    {customer.email}
//                  </td>
//                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                    {customer.orders}
//                  </td>
//                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                    PKR {customer.totalSpent.toLocaleString()}
//                  </td>
//                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                    {new Date(customer.lastOrder).toLocaleDateString()}
//                  </td>
//                  <td className="px-6 py-4 whitespace-nowrap">
//                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                      customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
//                    }`}>
//                      {customer.status}
//                    </span>
//                  </td>
//                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                    <div className="flex items-center gap-2">
//                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
//                        <Eye className="w-4 h-4" />
//                      </button>
//                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
//                        <Mail className="w-4 h-4" />
//                      </button>
//                      <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
//                        <MoreVertical className="w-4 h-4" />
//                      </button>
//                    </div>
//                  </td>
//                </tr>
//              ))}
//            </tbody>
//          </table>
//        </div>
//      </div>
//    </div>
//  );

//  // Inventory Management Component
//  const InventoryManagement = () => (
//    <div className="space-y-6">
//      {/* Inventory Header */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <div className="flex items-center justify-between">
//          <div>
//            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
//            <p className="text-gray-600">Monitor stock levels and manage products</p>
//          </div>
//          <div className="flex gap-3">
//            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//              <Plus className="w-4 h-4" />
//              Add Product
//            </button>
//            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors">
//              <Download className="w-4 h-4" />
//              Export Inventory
//            </button>
//          </div>
//        </div>
//      </div>

//      {/* Inventory Stats */}
//      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-blue-100 rounded-lg">
//              <Package className="w-8 h-8 text-blue-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Total Products</p>
//              <p className="text-2xl font-bold text-gray-900">1,245</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-red-100 rounded-lg">
//              <AlertTriangle className="w-8 h-8 text-red-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Low Stock</p>
//              <p className="text-2xl font-bold text-gray-900">{inventoryAlerts.length}</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-orange-100 rounded-lg">
//              <XCircle className="w-8 h-8 text-orange-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
//              <p className="text-2xl font-bold text-gray-900">23</p>
//            </div>
//          </div>
//        </div>

//        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//          <div className="flex items-center">
//            <div className="p-3 bg-green-100 rounded-lg">
//              <DollarSign className="w-8 h-8 text-green-600" />
//            </div>
//            <div className="ml-4">
//              <p className="text-sm font-medium text-gray-600">Total Value</p>
//              <p className="text-2xl font-bold text-gray-900">PKR 2.5M</p>
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Low Stock Alerts */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <div className="flex items-center justify-between mb-4">
//          <div className="flex items-center">
//            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
//            <h3 className="text-lg font-semibold text-gray-900">Urgent: Low Stock Alerts</h3>
//          </div>
//          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//            {inventoryAlerts.length} items
//          </span>
//        </div>
//        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//          {inventoryAlerts.slice(0, 6).map((alert, index) => (
//            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
//              <div className="flex items-center justify-between">
//                <div>
//                  <p className="font-medium text-gray-900">{alert.productName}</p>
//                  <p className="text-sm text-red-600">Only {alert.currentStock} left!</p>
//                </div>
//                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
//                  Restock
//                </button>
//              </div>
//            </div>
//          ))}
//        </div>
//      </div>

//      {/* Product Search and Filters */}
//      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//          <div className="flex flex-col sm:flex-row gap-4">
//            <div className="relative">
//              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//              <input
//                type="text"
//                placeholder="Search products..."
//                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//              />
//            </div>
//            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//              <option>All Categories</option>
//              <option>Electronics</option>
//              <option>Clothing</option>
//              <option>Books</option>
//              <option>Home & Garden</option>
//            </select>
//            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//              <option>All Stock Levels</option>
//              <option>In Stock</option>
//              <option>Low Stock</option>
//              <option>Out of Stock</option>
//            </select>
//          </div>
//          <div className="flex gap-2">
//            <button className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors">
//              <Filter className="w-4 h-4" />
//              Filters
//            </button>
//          </div>
//        </div>
//      </div>

//      {/* Products Table */}
//      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//        <div className="overflow-x-auto">
//          <table className="min-w-full divide-y divide-gray-200">
//            <thead className="bg-gray-50">
//              <tr>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//              </tr>
//            </thead>
//            <tbody className="bg-white divide-y divide-gray-200">
//              {/* Sample product data */}
//              {[
//                { id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', stock: 45, price: 8999, status: 'In Stock' },
//             //    { id: 2, name: 'Cotton T-Shirt',
//             { id: 2, name: 'Cotton T-Shirt', sku: 'CT-002', category: 'Clothing', stock: 3, price: 1999, status: 'Low Stock' },
//                 { id: 3, name: 'JavaScript Book', sku: 'JS-003', category: 'Books', stock: 0, price: 2499, status: 'Out of Stock' }
//               ].map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
//                         <Package className="w-6 h-6 text-gray-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {product.sku}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {product.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       product.stock === 0 ? 'bg-red-100 text-red-800' :
//                       product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {product.stock} units
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                     PKR {product.price.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
//                       product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {product.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center gap-2">
//                       <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
//                         <Plus className="w-4 h-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors">
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   // Settings Component
//   const SettingsManagement = () => (
//     <div className="space-y-6">
//       {/* Settings Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
//             <p className="text-gray-600">Manage your store settings and preferences</p>
//           </div>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
//             <Settings className="w-4 h-4" />
//             Save Changes
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Settings Navigation */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">Settings Menu</h3>
//           </div>
//           <nav className="p-6 space-y-2">
//             {[
//               { id: 'general', icon: Settings, label: 'General Settings' },
//               { id: 'payment', icon: DollarSign, label: 'Payment Methods' },
//               { id: 'shipping', icon: Truck, label: 'Shipping Options' },
//               { id: 'notifications', icon: Bell, label: 'Notifications' },
//               { id: 'security', icon: Settings, label: 'Security' },
//               { id: 'integrations', icon: Settings, label: 'Integrations' }
//             ].map((item) => (
//               <button
//                 key={item.id}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//               >
//                 <item.icon className="w-5 h-5" />
//                 {item.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Settings Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* General Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="My E-commerce Store"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="admin@store.com"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
//                 <textarea
//                   rows={3}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   defaultValue="Welcome to our online store where you can find amazing products at great prices."
//                 />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                   <input
//                     type="tel"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="+92 300 1234567"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//                   <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                     <option>PKR - Pakistani Rupee</option>
//                     <option>USD - US Dollar</option>
//                     <option>EUR - Euro</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
//             <div className="space-y-4">
//               {[
//                 { name: 'Cash on Delivery', enabled: true, description: 'Accept cash payments on delivery' },
//                 { name: 'Credit/Debit Cards', enabled: true, description: 'Accept card payments via Stripe' },
//                 { name: 'Bank Transfer', enabled: false, description: 'Direct bank transfer payments' },
//                 { name: 'JazzCash', enabled: true, description: 'Mobile wallet payments' },
//                 { name: 'EasyPaisa', enabled: true, description: 'Mobile wallet payments' }
//               ].map((method, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{method.name}</h4>
//                     <p className="text-sm text-gray-600">{method.description}</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked={method.enabled} />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Shipping Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Options</h3>
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
//                   <input
//                     type="number"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="5000"
//                     placeholder="Amount in PKR"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Cost</label>
//                   <input
//                     type="number"
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     defaultValue="200"
//                     placeholder="Amount in PKR"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 {[
//                   { name: 'Standard Delivery', time: '3-5 days', cost: 200, enabled: true },
//                   { name: 'Express Delivery', time: '1-2 days', cost: 500, enabled: true },
//                   { name: 'Same Day Delivery', time: 'Same day', cost: 800, enabled: false }
//                 ].map((option, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div>
//                       <h4 className="font-medium text-gray-900">{option.name}</h4>
//                       <p className="text-sm text-gray-600">{option.time} - PKR {option.cost}</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" defaultChecked={option.enabled} />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Notification Settings */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
//             <div className="space-y-4">
//               {[
//                 { name: 'New Order Notifications', description: 'Get notified when new orders are placed', enabled: true },
//                 { name: 'Low Stock Alerts', description: 'Get alerted when products are running low', enabled: true },
//                 { name: 'Daily Sales Reports', description: 'Receive daily sales summary via email', enabled: false },
//                 { name: 'Customer Reviews', description: 'Get notified about new customer reviews', enabled: true },
//                 { name: 'Marketing Updates', description: 'Receive marketing and promotional updates', enabled: false }
//               ].map((notification, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{notification.name}</h4>
//                     <p className="text-sm text-gray-600">{notification.description}</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Main Navigation
//   const navigationItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'orders', label: 'Orders', icon: ShoppingBag },
//     { id: 'customers', label: 'Customers', icon: Users },
//     { id: 'inventory', label: 'Inventory', icon: Package },
//     { id: 'analytics', label: 'Analytics', icon: TrendingUp },
//     { id: 'settings', label: 'Settings', icon: Settings }
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardOverview />;
//       case 'orders':
//         return <OrdersManagement />;
//       case 'customers':
//         return <CustomersManagement />;
//       case 'inventory':
//         return <InventoryManagement />;
//       case 'analytics':
//         return <AnalyticsView />;
//       case 'settings':
//         return <SettingsManagement />;
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className="flex items-center">
//                 <div className="bg-blue-600 p-2 rounded-lg">
//                   <ShoppingBag className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="ml-3">
//                   <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Notifications */}
//               <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bell className="w-6 h-6" />
//                 {inventoryAlerts.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {inventoryAlerts.length}
//                   </span>
//                 )}
//               </button>

//               {/* Profile */}
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                   <span className="text-blue-600 font-medium text-sm">A</span>
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="text-sm font-medium text-gray-900">Admin User</p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//                 <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-6">
//           {/* Sidebar */}
//           <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
//             <nav className="p-6 space-y-2">
//               {navigationItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveTab(item.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
//                     activeTab === item.id
//                       ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   {item.label}
//                   {item.id === 'orders' && bulkSelected.length > 0 && (
//                     <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
//                       {bulkSelected.length}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {renderContent()}
//           </div>
//         </div>
//       </div>

//       {/* Order Detail Modal */}
//       {selectedOrder && <OrderDetailModal />}

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-2xl">
//             <div className="flex items-center gap-3">
//               <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
//               <span className="text-lg font-medium text-gray-900">Loading...</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;