import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login'); // Redirect after sign out
  };

  return (
    <nav className="flex justify-between items-center bg-blue-500 p-4">
      <Link to="/" className="text-white text-2xl font-bold">
        Your Logo
      </Link>

      <div>
        {user ? (
          user.role === 'admin' ? (
            <Link to="/admin" className="text-white mx-4">Admin Panel</Link>
          ) : (
            <span className="text-white mx-4">{user.name}</span>
          )
        ) : (
          <>
            <Link to="/login" className="text-white mx-4">Sign In</Link>
            <Link to="/register" className="text-white mx-4">Register</Link>
          </>
        )}
        
        {user && (
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
