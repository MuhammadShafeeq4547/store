import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Key, 
  Shield, 
  Settings,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  Package,
  Heart,
  ShoppingBag,
  Award,
  Clock,
  Bell,
  Save,
  X,
  ArrowLeft,
  LogOut,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    cartItems: 0,
    totalSpent: 0,
    memberSince: '2023'
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    promotions: false
  });

  const { user, wishlist, cart, logout } = useAuth();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const totalItems = cart?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.token) {
        setError('Please login to view your profile');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      setUserProfile(userData);
      setEditedProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
      
      await fetchUserStats();
      
      setLoading(false);
    } catch (error) {
      console.error('Profile Error:', error);
      setError(error.message || 'Failed to load profile. Please try again.');
      setLoading(false);
      
      if (error.message.includes('Session expired')) {
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const ordersResponse = await fetch(`${API_URL}/api/orders/my-orders`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        
        const completedOrders = ordersData.data?.filter(order => 
          order.orderStatus === 'delivered'
        ) || [];
        
        const totalSpent = completedOrders.reduce((sum, order) => 
          sum + (order.orderSummary?.totalAmount || 0), 0
        );

        setStats({
          totalOrders: ordersData.data?.length || 0,
          totalSpent: totalSpent,
          wishlistItems: wishlist?.length || 0,
          cartItems: totalItems,
          memberSince: userProfile?.createdAt ? new Date(userProfile.createdAt).getFullYear() : new Date().getFullYear()
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.token]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      wishlistItems: wishlist?.length || 0,
      cartItems: totalItems
    }));
  }, [wishlist?.length, totalItems]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setSaveLoading(true);
      
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editedProfile.name,
          email: editedProfile.email,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setUserProfile(prev => ({
        ...prev,
        name: updatedData.name,
        email: updatedData.email,
      }));
      
      setIsEditMode(false);
      setSaveLoading(false);
      
      // Success notification
      alert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Update Error:', error);
      alert('❌ ' + error.message);
      setSaveLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleAvatarChange = () => {
    alert('Avatar upload feature coming soon!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedProfile({
      name: userProfile.name || '',
      email: userProfile.email || '',
      phone: userProfile.phone || '',
      address: userProfile.address || ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center max-w-sm w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-base sm:text-lg text-center">Loading your profile...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => fetchProfile()} 
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-sm w-full">
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg mb-4">No profile data available</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-8">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
          {/* Cover Photo */}
          <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 text-white">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">My Profile</h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">Manage your account settings and preferences</p>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative group mx-auto md:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                  <img 
                    src={userProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=3b82f6&color=ffffff&size=96`} 
                    alt={userProfile.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=3b82f6&color=ffffff&size=96`;
                    }}
                  />
                </div>
                <button 
                  onClick={handleAvatarChange}
                  className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 group-hover:scale-110"
                  title="Change avatar"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left w-full md:w-auto">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{userProfile.name || 'User'}</h2>
                  {userProfile.isEmailVerified && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium" title="Verified Account">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  {userProfile.role === "admin" && (
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                      Admin
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 text-gray-600 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="break-all">{userProfile.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Member since {userProfile.createdAt ? new Date(userProfile.createdAt).getFullYear() : new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saveLoading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saveLoading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <Key className="w-4 h-4" />
                      <span className="hidden sm:inline">Change Password</span>
                      <span className="sm:hidden">Password</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Wishlist</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.wishlistItems}</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Cart Items</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.cartItems}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Spent</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">Rs. {stats.totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max">
              {[
                { id: 'profile', label: 'Profile Details', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'preferences', label: 'Preferences', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 mb-2 block">Full Name</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter your name"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-800 font-medium break-all">{userProfile.name || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 mb-2 block">Email Address</label>
                      {isEditMode ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-800 font-medium break-all">{userProfile.email || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 mb-2 block">Phone Number</label>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-800 font-medium">{userProfile.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 mb-2 block">Address</label>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-800 font-medium">{userProfile.address || 'Not provided'}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 mb-2 block">Join Date</label>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-800 font-medium">
                          {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Not available'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 mb-2 block">Last Login</label>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-800 font-medium">
                          {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Not available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Type Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Account Type: <span className="text-blue-600">{userProfile.role === 'admin' ? 'Administrator' : 'User'}</span></p>
                      <p className="text-sm text-gray-600 mt-1">
                        {userProfile.role === 'admin' 
                          ? 'You have full access to all features and settings' 
                          : 'Standard user account with shopping privileges'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Security Settings</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Email Verification Status */}
                  <div className={`border rounded-lg p-3 sm:p-4 ${userProfile.isEmailVerified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                      <div className="flex items-start gap-3">
                        {userProfile.isEmailVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium text-sm sm:text-base ${userProfile.isEmailVerified ? 'text-green-800' : 'text-yellow-800'}`}>
                            {userProfile.isEmailVerified ? 'Email Verified ✓' : 'Email Not Verified'}
                          </p>
                          <p className={`text-xs sm:text-sm mt-1 ${userProfile.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                            {userProfile.isEmailVerified 
                              ? 'Your email address has been verified and is secure' 
                              : 'Please verify your email address for better security'}
                          </p>
                        </div>
                      </div>
                      {!userProfile.isEmailVerified && (
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium w-full sm:w-auto">
                          Verify Email
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className={`border rounded-lg p-3 sm:p-4 ${userProfile.isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${userProfile.isActive ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <p className={`font-medium text-sm sm:text-base ${userProfile.isActive ? 'text-green-800' : 'text-red-800'}`}>
                          Account Status: {userProfile.isActive ? 'Active' : 'Inactive'}
                        </p>
                        <p className={`text-xs sm:text-sm mt-1 ${userProfile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {userProfile.isActive 
                            ? 'Your account is currently active and in good standing' 
                            : 'Your account has been deactivated'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                      <div className="flex items-start gap-3">
                        <Key className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">Password</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Last updated: Recently</p>
                          <p className="text-xs text-gray-500 mt-1">Update your password regularly for better security</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleForgotPassword}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium w-full sm:w-auto"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two Factor Authentication (Coming Soon) */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 opacity-60">
                    <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">Two-Factor Authentication</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Account Preferences</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Email Notifications */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">Email Notifications</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive updates about your orders and account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifications.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Order Updates */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">Order Updates</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Get notified about order status changes and delivery updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.orderUpdates}
                          onChange={() => handleNotificationChange('orderUpdates')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Marketing Emails */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">Marketing Emails</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive promotional offers and updates about new products</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.marketingEmails}
                          onChange={() => handleNotificationChange('marketingEmails')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Promotions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">Special Promotions</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Get exclusive deals, flash sales, and special discounts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.promotions}
                          onChange={() => handleNotificationChange('promotions')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Save Preferences Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => alert('Preferences saved successfully!')}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 sm:mt-8">
          <button
            onClick={() => navigate('/trackmyorder')}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-4 group"
          >
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">My Orders</h3>
              <p className="text-xs sm:text-sm text-gray-600">View order history & track shipments</p>
            </div>
          </button>

          <button
            // onClick={() => navigate('/wishlist')}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-4 group"
          >
            <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Wishlist</h3>
              <p className="text-xs sm:text-sm text-gray-600">{stats.wishlistItems} items saved for later</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/checkout')}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-4 group"
          >
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Shopping Cart</h3>
              <p className="text-xs sm:text-sm text-gray-600">{stats.cartItems} items ready to checkout</p>
            </div>
          </button>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed by contacting support.')) {
                  alert('Account deactivation feature coming soon!');
                }
              }}
              className="flex-1 px-6 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              Deactivate Account
            </button>
            <button
              onClick={() => {
                if (window.confirm('⚠️ Are you sure you want to delete your account? This action CANNOT be undone and all your data will be permanently deleted.')) {
                  alert('Account deletion feature coming soon! Please contact support for now.');
                }
              }}
              className="flex-1 px-6 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Need help? Contact our support team at support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;