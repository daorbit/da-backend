const Lead = require('../models/Lead');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Create a new lead (public endpoint)
 */
const createLead = async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    // Get client IP and user agent for tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const userAgent = req.get('User-Agent');

    // Create new lead
    const lead = new Lead({
      name,
      email,
      company: company || '',
      message,
      ipAddress,
      userAgent
    });

    await lead.save();

    console.log('✅ New lead submitted:', { name, email, company });

    sendSuccess(
      res,
      {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        createdAt: lead.createdAt
      },
      'Thank you for your message! We will get back to you soon.',
      201
    );

  } catch (error) {
    console.error('❌ Error creating lead:', error);
    sendError(res, 'An error occurred while submitting your message. Please try again.');
  }
};

/**
 * Get all leads with pagination and filtering (admin only)
 */
const getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Get leads with pagination
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const total = await Lead.countDocuments(query);

    // Get status counts for dashboard
    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusStats = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    sendSuccess(res, {
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        total,
        ...statusStats
      }
    });

  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    sendError(res, 'Error fetching leads');
  }
};

/**
 * Update lead status (admin only)
 */
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return sendError(res, 'Lead not found', 404);
    }

    sendSuccess(res, lead, 'Lead status updated successfully');

  } catch (error) {
    console.error('❌ Error updating lead status:', error);
    sendError(res, 'Error updating lead status');
  }
};

module.exports = {
  createLead,
  getAllLeads,
  updateLeadStatus
};
