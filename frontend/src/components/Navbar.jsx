import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Trash2, 
  ShoppingCart,
  Crown,
  UserCircle,
  ChevronDown,
  Store,
  Settings,
  Package,
  Home,
  LayoutDashboard
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartSidebar from "./Cart/CartSidebar";

const Navbar = () => {
  const { user, logoutUser, wishlist, removeFromWishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const wishlistRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setWishlistOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setWishlistOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWishlistItemClick = () => {
    setWishlistOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-200' 
          : 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className={`flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold tracking-wide transition-all duration-300 hover:scale-105 group ${
                scrolled ? 'text-gray-800' : 'text-white'
              }`}>
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MyShop
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {!user ? (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}>
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700">
                      Register
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Navigation Links */}
                  <Link to="/">
                    <button className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActivePath('/') 
                        ? scrolled 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-white/20 text-white'
                        : scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}>
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>
                  </Link>

                  <Link to="/trackmyorder">
                    <button className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      isActivePath('/trackmyorder') 
                        ? scrolled 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-white/20 text-white'
                        : scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}>
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>
                  </Link>

                  {/* Wishlist Button */}
                  <div className="relative" ref={wishlistRef}>
                    <button
                      onClick={() => setWishlistOpen(!wishlistOpen)}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="relative">
                        <Heart className="w-5 h-5 text-red-500" />
                        {wishlist?.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                            {wishlist.length}
                          </span>
                        )}
                      </div>
                      <span>Wishlist</span>
                    </button>

                    {/* Wishlist Dropdown */}
                    {wishlistOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Heart className="text-red-500 w-5 h-5" />
                            Your Wishlist
                          </h3>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {wishlist?.length > 0 ? (
                            <div className="p-2">
                              {wishlist.map((item) => (
                                <div key={item._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                                  <Link
                                    to={`/product/${item._id}`} 
                                    onClick={handleWishlistItemClick}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                  >
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-12 h-12 rounded-lg object-cover shadow-md" 
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                      <p className="text-sm text-gray-500">${item.price}</p>
                                    </div>
                                  </Link>
                                  <button 
                                    onClick={() => removeFromWishlist(item._id)} 
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                              <p className="text-sm text-gray-400 mt-1">Add items you love!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cart Component */}
                  <CartSidebar />

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="relative">
                        <UserCircle className="w-6 h-6" />
                        {user?.role === "admin" && (
                          <Crown className="absolute -top-1 -right-1 text-yellow-400 w-4 h-4" />
                        )}
                      </div>
                      <span className="max-w-[100px] truncate">{user?.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          {user?.role === "admin" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                              <Crown className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        
                        <Link to="/trackmyorder" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>

                        <Link to="/update-profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        
                        {user?.role === "admin" && (
                          <>
                            <hr className="my-2" />
                            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                              <Crown className="w-4 h-4 text-yellow-500" />
                              Admin Dashboard
                            </Link>
                            <Link to="/OrderDashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-blue-500" />
                              Order Dashboard
                            </Link>
                            <Link to="/UserActivityDashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                              <User className="w-4 h-4 text-green-500" />
                              User Activity
                            </Link>
                          </>
                        )}
                        
                        <hr className="my-2" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button & Icons */}
            <div className="flex items-center gap-2 lg:hidden">
              {user && (
                <>
                  {/* Mobile Cart Icon */}
                  <CartSidebar />
                  
                  {/* Mobile Wishlist Icon */}
                  <button
                    onClick={() => setWishlistOpen(!wishlistOpen)}
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      scrolled ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    <Heart className="w-6 h-6 text-red-500" />
                    {wishlist?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                </>
              )}
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className={`p-2 rounded-lg transition-all duration-300 ${
                  scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {!user ? (
                <>
                  <Link to="/login">
                    <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-center shadow-lg">
                      Register
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="relative">
                      <UserCircle className="w-10 h-10 text-gray-600" />
                      {user?.role === "admin" && (
                        <Crown className="absolute -top-1 -right-1 text-yellow-400 w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {user?.role === "admin" && (
                        <span className="inline-block text-xs text-yellow-600 font-medium mt-1">Admin Account</span>
                      )}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link to="/">
                    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <Home className="w-5 h-5" />
                      Home
                    </button>
                  </Link>

                  <Link to="/profile">
                    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/profile') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <User className="w-5 h-5" />
                      My Profile
                    </button>
                  </Link>

                  <Link to="/trackmyorder">
                    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                      isActivePath('/trackmyorder') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <Package className="w-5 h-5" />
                      My Orders
                    </button>
                  </Link>

                  <Link to="/update-profile">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                  </Link>

                  {/* Admin Links */}
                  {user?.role === "admin" && (
                    <>
                      <div className="my-2 border-t border-gray-200"></div>
                      <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Admin Panel</p>
                      
                      <Link to="/admin/dashboard">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <Crown className="w-5 h-5 text-yellow-500" />
                          Admin Dashboard
                        </button>
                      </Link>

                      <Link to="/OrderDashboard">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <LayoutDashboard className="w-5 h-5 text-blue-500" />
                          Order Dashboard
                        </button>
                      </Link>

                      <Link to="/UserActivityDashboard">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <User className="w-5 h-5 text-green-500" />
                          User Activity
                        </button>
                      </Link>
                    </>
                  )}

                  <div className="my-2 border-t border-gray-200"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile Wishlist Dropdown */}
        {wishlistOpen && user && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Heart className="text-red-500 w-5 h-5" />
                Your Wishlist
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {wishlist?.length > 0 ? (
                  wishlist.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Link 
                        to={`/product/${item._id}`} 
                        onClick={handleWishlistItemClick}
                        className="flex items-center gap-3 flex-1"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>
                      </Link>
                      <button 
                        onClick={() => removeFromWishlist(item._id)} 
                        className="p-2 text-red-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;