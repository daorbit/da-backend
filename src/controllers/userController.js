const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Get all users with pagination and filtering
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const role = req.query.role;

    // Build query
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get role counts for dashboard
    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const roleStats = roleCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    sendSuccess(res, {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        total,
        ...roleStats
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    sendError(res, 'Error fetching users');
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, user);
  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, 'Server error fetching user');
  }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Prevent user from changing their own role
    if (id === req.user.id) {
      return sendError(res, 'You cannot change your own role', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, user, 'User role updated successfully');

  } catch (error) {
    console.error('❌ Error updating user role:', error);
    sendError(res, 'Error updating user role');
  }
};

/**
 * Toggle user active status
 */
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent user from deactivating themselves
    if (id === req.user.id && !isActive) {
      return sendError(res, 'You cannot deactivate your own account', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(
      res, 
      user, 
      `User ${isActive ? 'activated' : 'deactivated'} successfully`
    );

  } catch (error) {
    console.error('❌ Error updating user status:', error);
    sendError(res, 'Error updating user status');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus
};
