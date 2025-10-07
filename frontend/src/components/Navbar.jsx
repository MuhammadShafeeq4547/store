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
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartSidebar from "./Cart/CartSidebar";

const Navbar = () => {
  // Replace with your actual useAuth hook
  const { user, logoutUser, wishlist, removeFromWishlist } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  const wishlistRef = useRef(null);
  const userMenuRef = useRef(null);
  const cartRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setWishlistOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
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
    setCartOpen(false);
  };

  const handleNavigation = (path) => {
    // Add your navigation logic here
    // For React Router: navigate(path);
    console.log(`Navigating to: ${path}`);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200' 
          : 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
                <>
            <Link to={"/"}>
            <button 
              className={`flex items-center gap-3 text-2xl font-bold tracking-wide transition-all duration-300 hover:scale-105 group ${
                scrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Store className="text-white text-xl" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyShop
              </span>
            </button>
                </Link>
                </>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {!user ? (
                <>
                <div className="flex items-center gap-4">
                  <Link to={"/login"}>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    Login
                  </button>
                  </Link>
                  <Link to={"/register"}>
                  <button 
                    onClick={() => handleNavigation('/register')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
                  >
                    Register
                  </button>
                    </Link>
                </div>
                </>
              ) : (
                <div className="flex items-center gap-4">{/* Navigation Links for logged in users */}
                  <nav className="hidden lg:flex items-center gap-6">
                    <Link to={"/"}>
                    <button 
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                        scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                      }`}
                      >
                      Products
                    </button>
                      </Link>
                        <Link to={"/trackmyorder"}>
                    <button 
                      // onClick={() => handleNavigation('/orders')}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                        scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      My Orders
                    </button>
                      </Link>
                  </nav>
                  {/* User Menu Dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 group ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="relative">
                        <UserCircle className="text-2xl" />
                        {user.role === "admin" && (
                          <Crown className="absolute -top-1 -right-1 text-yellow-400 text-sm" />
                        )}
                      </div>
                      <span className="hidden lg:block">{user.name}</span>
                      <ChevronDown className={`text-sm transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.role === "admin" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                              <Crown className="text-yellow-600 w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <Link to={"/profile"}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                          <User className="text-gray-400 w-4 h-4" />
                          My Profile
                        </Link>
                        
                        <Link to={"/trackmyorder"}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                          <Package className="text-gray-400 w-4 h-4" />
                          My Orders
                        </Link>

                        <a
                          onClick={() => handleNavigation('/settings')}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                          <Settings className="text-gray-400 w-4 h-4" />
                          Settings
                        </a>
                        
                        {user.role === "admin" && (
                          <Link to={"/admin/dashboard"}
                            // onClick={() => handleNavigation('/admin/dashboard')}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                          >
                            <Crown className="text-yellow-500 w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <hr className="my-2" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="text-red-500 w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                  <CartSidebar />

                  {/* Cart Button
                  <div className="relative" ref={cartRef}>
                    <button
                      onClick={() => setCartOpen(!cartOpen)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 group 
                      ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="relative">
                        <ShoppingCart className="text-xl group-hover:text-blue-600 transition-colors duration-300" />
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                          3
                        </span>
                      </div>
                      <span className="hidden lg:block">Cart</span>
                    </button>
                  </div> */}

                  {/* Wishlist Button */}
                  <div className="relative" ref={wishlistRef}>
                    <button
                      onClick={() => setWishlistOpen(!wishlistOpen)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 group ${
                        scrolled 
                          ? 'text-gray-700 hover:bg-gray-100' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="relative">
                        <Heart className="text-xl text-red-500 group-hover:text-red-600 transition-colors duration-300" />
                        {wishlist.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                            {wishlist.length}
                          </span>
                        )}
                      </div>
                      <span className="hidden lg:block">Wishlist</span>
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
                          {wishlist.length > 0 ? (
                            <div className="p-2">
                              {wishlist.map((item) => (
                                <div key={item._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                                  <Link
                                    to={`/product/${item._id}`} 
                                    onClick={handleWishlistItemClick}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                  >
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-12 h-12 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200" 
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                      <p className="text-sm text-gray-500">${item.price}</p>
                                    </div>
                                  </Link>
                                  <button 
                                    onClick={() => removeFromWishlist(item._id)} 
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  >
                                    <Trash2 className="text-sm w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <Heart className="text-4xl text-gray-300 mx-auto mb-4 w-16 h-16" />
                              <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                              <p className="text-sm text-gray-400 mt-1">Add items you love to see them here</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className={`md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {menuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-3">
              {!user ? (
                <>
                <Link to={"/login"}>
                  <button 
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                    >
                    Login
                  </button>
                    </Link>
                    <Link to={"/register"}>
                  <button 
                    onClick={() => handleNavigation('/register')}
                    className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-center shadow-lg"
                  >
                    Register
                  </button>
                    </Link>
                </>
              ) : (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="relative">
                      <UserCircle className="text-2xl text-gray-600" />
                      {user.role === "admin" && (
                        <Crown className="absolute -top-1 -right-1 text-yellow-400 text-sm w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.role === "admin" && (
                        <span className="text-xs text-yellow-600 font-medium">Admin</span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleNavigation('/profile')}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <User className="text-gray-400 w-5 h-5" />
                    My Profile
                  </button>

                  <button 
                    onClick={() => handleNavigation('/products')}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Package className="text-gray-400 w-5 h-5" />
                    Products
                  </button>
                  <Link to={"/trackmyorder"}>
                  <button 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                    <Package className="text-gray-400 w-5 h-5" />
                    My Orders
                  </button>
                    </Link>

                  {user.role === "admin" && (
                    <button 
                      onClick={() => handleNavigation('/admin/dashboard')}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <Crown className="text-yellow-500 w-5 h-5" />
                      Admin Dashboard
                    </button>
                  )}

                  {/* Mobile Wishlist */}
                  <div className="px-4 py-3">
                    <button
                      onClick={() => setWishlistOpen(!wishlistOpen)}
                      className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="text-red-500 w-5 h-5" />
                        <span>Wishlist</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                          {wishlist.length}
                        </span>
                        <ChevronDown className={`text-sm transition-transform duration-300 w-4 h-4 ${wishlistOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {wishlistOpen && (
                      <div className="mt-3 space-y-2 bg-gray-50 rounded-lg p-3">
                        {wishlist.length > 0 ? (
                          wishlist.map((item) => (
                            <div key={item._id} className="flex items-center gap-3 p-2 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                              <a 
                                href={`#product-${item._id}`} 
                                onClick={handleWishlistItemClick}
                                className="flex items-center gap-3 flex-1"
                              >
                                <img 
                                  src={item.image || '/api/placeholder/40/40'} 
                                  alt={item.name} 
                                  className="w-10 h-10 rounded-lg object-cover shadow"
                                  onError={(e) => {
                                    e.target.src = '/api/placeholder/40/40';
                                  }}
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500">${item.price}</p>
                                </div>
                              </a>
                              <button 
                                onClick={() => removeFromWishlist(item._id)} 
                                className="p-2 text-red-400 hover:text-red-600 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="text-sm w-4 h-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-4 text-sm">No items in wishlist</p>
                        )}
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-200" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
      
    
    </>
  );
};

export default Navbar;