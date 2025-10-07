import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import CartSidebar from './components/Cart/CartSidebar';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/Profile/UserProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductForm from './components/Admin/ProductForm';
import Checkout from './components/Cart/Checkout';
import UpdateProfile from './components/Profile/UpdateProfile';
import ForgotPassword from './components/Profile/ForgotPassword';
import ResetPassword from './components/Profile/ResetPassword';
import TrackMyOrder from './components/Cart/Track Order';
import AdminDashboardOrder from './components/Admin/Order Dashbord';
import UserActivityDashboard from './components/Admin/UserActivityDashboard';
function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />  {/* Navbar component to show across all pages */}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProductList />} />  {/* Product listing page */}
          <Route path="/product/:id" element={<ProductDetail />} />  {/* Product detail page */}
          <Route path="/login" element={<Login />} />  {/* Login page */}
          <Route path="/register" element={<Register />} />  {/* Register page */}

          {/* Protected Routes (Only accessible by logged in users) */}
          {/* Protected Route for Profile */}
          <Route
            path="/profile"
            element={
              // <ProtectedRoute>
                <UserProfile />
              // </ProtectedRoute>
            }
          />
           {/* Protected Route for Update Profile */}
           <Route
            path="/update-profile"
            element={
              // <ProtectedRoute>
                <UpdateProfile />
              // </ProtectedRoute>
            }
          />
             <Route path="/forgot-password" element={<ForgotPassword />} />

             <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Routes (Only accessible by admin users) */}
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute>
                <AdminDashboard />
              // </ProtectedRoute>
            }
          />  {/* Admin dashboard */}
          <Route
            path="/admin/product-form"
            element={
              // <ProtectedRoute>
                <ProductForm />
              // </ProtectedRoute>
            }
          />  {/* Admin product add/edit form */}

          {/* Cart & Checkout Routes */}
          <Route
            path="/checkout"
            element={
              // <ProtectedRoute>
                <Checkout />
              // </ProtectedRoute>
            }
          />  {/* Checkout page */}
        <Route path='/trackmyorder' element={<TrackMyOrder />}></Route>
        <Route path='/OrderDashboard' element={<AdminDashboardOrder />}></Route>
        <Route path='/UserActivityDashboard' element={<UserActivityDashboard />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
