const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    firstName,
    lastName,
    email,
    mobile,
    password,
  });

  await newUser.save();

  const userObject = newUser.toObject();

  delete userObject.password;

  res.json(userObject);
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const currentUser = await User.findOne({ email });

  if (currentUser && (await currentUser.isPasswordMatched(password))) {
    const token = generateToken(currentUser._id);
    return res.json({
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email,
      mobile: currentUser?.mobile,
      authToken: token,
    });
  } else {
    throw new Error('Invalid Credentials');
  }
});

// get all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await User.findByIdAndDelete(id);
    res.json(`User deleted successfully`);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { firstName, lastName, password, email, mobile } = req.body;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error(`User not found`);
    }
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          firstName,
          lastName,
          password,
          email,
          mobile,
        },
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});
module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
};
