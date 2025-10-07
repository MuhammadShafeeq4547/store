import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Calendar, MapPin, User, CreditCard, X, RefreshCw, ShoppingBag } from 'lucide-react';

const TrackMyOrder = () => {
  const [searchInput, setSearchInput] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [cancelLoading, setCancelLoading] = useState('');

  // Get token from localStorage or your auth context
  const getAuthToken = () => {
    let user = JSON.parse(localStorage.getItem("user"))
    return user?.token
  };

  // API call to get user's orders
  const getUserOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Orders response:', data); // Debug log
      setUserOrders(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // API call to get specific order by ID
  const getOrderById = async (orderId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Order details response:', data); // Debug log
      setSelectedOrder(data.data || data.order || data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details');
    }
  };

  // API call to cancel order
  const cancelOrder = async (orderId, reason = 'Cancelled by customer') => {
    setCancelLoading(orderId);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the order in the list
      setUserOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
      ));

      // Update selected order if it's the cancelled one
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled' });
      }

      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancelLoading('');
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Rs. 0';
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = order.trackingNumber?.toLowerCase().includes(searchInput.toLowerCase()) ||
                         order._id?.toLowerCase().includes(searchInput.toLowerCase()) ||
                         order.orderItems?.some(item => item.name?.toLowerCase().includes(searchInput.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && order.orderStatus?.toLowerCase() === activeTab;
  });

  const canCancelOrder = (orderStatus) => {
    const cancelableStatuses = ['pending', 'confirmed'];
    return cancelableStatuses.includes(orderStatus?.toLowerCase());
  };

  const OrderModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600">#{order.trackingNumber || order._id}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Status */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Status</h3>
              <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                <span className="font-medium capitalize">{order.orderStatus}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Delivery Status</p>
                <p className={`font-medium ${order.isDelivered ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Shipping Method</p>
                <p className="font-medium">{order.shippingMethod?.name || 'N/A'}</p>
                <p className="text-xs text-gray-500">{order.shippingMethod?.estimatedDays || ''}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <ShoppingBag className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.address}</p>
                <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
                <p>{order.shippingInfo.country}</p>
                {order.shippingInfo.phone && (
                  <p className="mt-2 text-sm text-gray-600">Phone: {order.shippingInfo.phone}</p>
                )}
                {order.shippingInfo.email && (
                  <p className="text-sm text-gray-600">Email: {order.shippingInfo.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.orderSummary?.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(order.orderSummary?.shippingCost)}</span>
              </div>
              {order.orderSummary?.tax > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.orderSummary?.tax)}</span>
                </div>
              )}
              {order.orderSummary?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.orderSummary?.discount)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.orderSummary?.totalAmount)}</span>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Payment Method:</span>
                <span className="capitalize">{order.paymentMethod?.type?.replace('_', ' ') || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {order.notes && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Order Notes:</h4>
              <p className="text-yellow-700">{order.notes}</p>
            </div>
          )}

          {/* Promo Code */}
          {order.promoCode && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Promo Code Applied:</h4>
              <p className="text-green-700 font-mono">{order.promoCode}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {canCancelOrder(order.orderStatus) && (
              <button 
                onClick={() => cancelOrder(order._id)}
                disabled={cancelLoading === order._id}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {cancelLoading === order._id ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{cancelLoading === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track My Orders</h1>
          <p className="text-gray-600">Monitor your order status and delivery progress</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number or product name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={getUserOrders}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mt-4 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600">
                  {searchInput ? 'No orders match your search criteria.' : 'You haven\'t placed any orders yet.'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold">#{order.trackingNumber || order._id}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>{formatPrice(order.orderSummary?.totalAmount)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>{order.orderItems?.length || 0} item(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        onClick={() => getOrderById(order._id)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      
                      {canCancelOrder(order.orderStatus) && (
                        <button 
                          onClick={() => cancelOrder(order._id)}
                          disabled={cancelLoading === order._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                        >
                          {cancelLoading === order._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span>{cancelLoading === order._id ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default TrackMyOrder;