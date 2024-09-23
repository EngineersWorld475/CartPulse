const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const mongodbValidateId = require('../utils/mongodbValidateId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

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
    const refreshToken = await generateRefreshToken(currentUser._id);
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $set: {
          refreshToken: refreshToken,
        },
      },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    mongodbValidateId(id);
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    mongodbValidateId(id);
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
    mongodbValidateId(_id);
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

const blockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    mongodbValidateId(id);
    await User.findByIdAndUpdate(id, {
      $set: {
        isBlocked: true,
      },
    });
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    mongodbValidateId(id);
    await User.findByIdAndUpdate(id, {
      $set: {
        isBlocked: false,
      },
    });
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {}
});

const getRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No refresh token present in db or not matched');
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('There is something wrong with the refresh token');
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    $set: {
      refreshToken: '',
    },
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //forbidden
});

// change password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  mongodbValidateId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  getRefreshToken,
  logout,
  updatePassword,
};
