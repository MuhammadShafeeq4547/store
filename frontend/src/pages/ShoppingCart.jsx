import React, { useState, useEffect } from 'react';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    alert('Proceeding to Checkout!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map(item => (
          <div key={item._id} className="flex justify-between items-center mt-4">
            <div>{item.name}</div>
            <div>
              <button
                onClick={() => handleRemoveFromCart(item._id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
      <div className="mt-4">
        <button onClick={handleCheckout} className="bg-blue-500 text-white py-2 rounded-lg w-full">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
