const User = require('../models/User');
const { generateToken } = require('../utils/tokenGenerator');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { name, email, password, sourceApp } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 400);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      sourceApp: sourceApp || 'da-admin',
      authProvider: 'local'
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
          sourceApp: savedUser.sourceApp,
          authProvider: savedUser.authProvider,
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
 * Register/Login user with Google OAuth
 */
const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar, sourceApp } = req.body;

    if (!sourceApp) {
      return sendError(res, 'Source app is required', 400);
    }

    // Check if user already exists with this email
    let user = await User.findByEmail(email);
    
    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (avatar) user.avatar = avatar;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Just update last login
        user.lastLogin = new Date();
        await user.save();
      }
    } else {
      // Create new user with Google OAuth
      user = new User({
        name,
        email,
        googleId,
        avatar,
        sourceApp,
        authProvider: 'google',
        lastLogin: new Date()
      });
      
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          sourceApp: user.sourceApp,
          authProvider: user.authProvider,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      },
      user.createdAt === user.updatedAt ? 'User registered successfully with Google' : 'Login successful',
      user.createdAt === user.updatedAt ? 201 : 200
    );

  } catch (error) {
    console.error('Google OAuth error:', error);
    sendError(res, 'Server error during Google authentication');
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
  googleAuth,
  getCurrentUser,
  logout
};
