const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    const err = new ErrorHandler('Validation failed', 400);

    if (!name || !email || !password || !confirmPassword) {
      err.addDetail('All fields are required');
      return next(err);
    }

    if (password !== confirmPassword) {
      err.addDetail('Passwords do not match');
      return next(err);
    }

    if (password.length < 6) {
      err.addDetail('Password must be at least 6 characters');
      return next(err);
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      err.addDetail('Password must contain at least one letter and one number');
      return next(err);
    }

    if (err.details.length > 0) {
      return next(err);
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      err.addDetail('Email already registered');
      err.statusCode = 400;
      return next(err);
    }

    // Create new user
    user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const err = new ErrorHandler('Please provide email and password', 400);
      err.addDetail('Email and password are required');
      return next(err);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const err = new ErrorHandler('Invalid credentials', 401);
      err.addDetail('Email not found');
      return next(err);
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      const err = new ErrorHandler('Invalid credentials', 401);
      err.addDetail('Incorrect password');
      return next(err);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, theme, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, theme, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const err = new ErrorHandler('Validation failed', 400);

    if (!oldPassword || !newPassword || !confirmPassword) {
      err.addDetail('All fields are required');
      return next(err);
    }

    if (newPassword !== confirmPassword) {
      err.addDetail('New passwords do not match');
      return next(err);
    }

    if (newPassword.length < 6) {
      err.addDetail('Password must be at least 6 characters');
      return next(err);
    }

    const user = await User.findById(req.userId).select('+password');
    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
      err.addDetail('Old password is incorrect');
      return next(err);
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
