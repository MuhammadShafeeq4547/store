const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const Product = require('../models/Product');

//  Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email.trim().toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = new User({
    name,
    email: email.trim().toLowerCase(),
    password,
  });

  await user.save();
   

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});
// //log in
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // console.log("Received Email:", email);
    // console.log("Received Password:", password);
  
    const user = await User.findOne({ email });
  
    // console.log("Found User:", user);
  
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role:user.role
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  });
  
//  Get User Profile (Protected)
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//  Update User Profile (Protected)
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // Will be hashed in schema
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
      role:user.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


//  Get All Users (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//  Delete User (Admin Only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Delete user reviews from all products
    await Product.updateMany(
      { "reviews.user": req.params.id }, // Find products with this user in reviews
      { 
        $pull: { 
          reviews: { user: req.params.id } // Remove the user's review completely
        }
      }
    );

    // Now delete the user
    await user.deleteOne();
    res.json({ message: 'User and their reviews have been removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
