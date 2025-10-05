const User = require('../models/User');
const { generateToken } = require('../utils/tokenGenerator');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 400);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate JWT token
    const token = generateToken(savedUser._id);

    sendSuccess(
      res,
      {
        token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          createdAt: savedUser.createdAt
        }
      },
      'User registered successfully',
      201
    );

  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, 'Server error during registration');
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password for comparison
    const user = await User.findByEmail(email).select('+password');
    
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return sendError(res, 'Account is deactivated. Please contact support.', 401);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    sendSuccess(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Server error during login');
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res) => {
  try {
    sendSuccess(res, { user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Server error fetching profile');
  }
};

/**
 * Logout user (client-side token removal)
 */
const logout = (req, res) => {
  sendSuccess(res, null, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
