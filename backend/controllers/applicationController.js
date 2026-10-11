// updated [backend/controllers/applicationController.js]
const Application = require('../models/Application');
const ErrorHandler = require('../utils/errorHandler');

// @route   GET /api/applications
// @desc    Get all applications for user
// @access  Private
exports.getApplications = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { userId: req.userId };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const applications = await Application.find(filter)
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.userId);
    console.log('[STATS] Fetching stats for userId:', userId);
    
    const stats = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    console.log('[STATS] Aggregation result:', stats);

    const statusMap = {
      Applied: 0,
      Interview: 0,
      Rejected: 0,
      Selected: 0,
    };

    stats.forEach((stat) => {
      statusMap[stat._id] = stat.count;
    });

    const total = Object.values(statusMap).reduce((a, b) => a + b, 0);

    console.log('[STATS] Final stats:', { statusMap, total });

    res.status(200).json({
      success: true,
      stats: statusMap,
      total,
    });
  } catch (error) {
    console.error('[STATS] Error:', error);
    next(error);
  }
};

// @route   GET /api/applications/upcoming-deadlines
// @desc    Get upcoming deadlines
// @access  Private
exports.getUpcomingDeadlines = async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const applications = await Application.find({
      userId: req.userId,
      deadline: { $gte: now, $lte: sevenDaysLater },
      status: { $in: ['Applied', 'Interview'] },
    }).sort({ deadline: 1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/applications
// @desc    Create a new application
// @access  Private
exports.createApplication = async (req, res, next) => {
  try {
    const { companyName, role, status, appliedDate, deadline, notes, url, salary, location, jobType } = req.body;

    const err = new ErrorHandler('Validation failed', 400);

    if (!companyName || !role || !deadline || !appliedDate) {
      err.addDetail('Company name, role, applied date, and deadline are required');
      return next(err);
    }

    const application = await Application.create({
      userId: req.userId,
      companyName,
      role,
      status: status || 'Applied',
      appliedDate,
      deadline,
      notes,
      url,
      salary,
      location,
      jobType,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return next(new ErrorHandler('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
exports.updateApplication = async (req, res, next) => {
  try {
    let application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return next(new ErrorHandler('Application not found', 404));
    }

    application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return next(new ErrorHandler('Application not found', 404));
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/applications/export/csv
// @desc    Export applications as CSV
// @access  Private
exports.exportCSV = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({ appliedDate: -1 });

    let csv = 'Company Name,Role,Status,Applied Date,Deadline,Job Type,Location,Salary,Notes\n';

    applications.forEach((app) => {
      const row = [
        app.companyName,
        app.role,
        app.status,
        new Date(app.appliedDate).toLocaleDateString(),
        new Date(app.deadline).toLocaleDateString(),
        app.jobType || '',
        app.location || '',
        app.salary || '',
        app.notes ? `"${app.notes.replace(/"/g, '""')}"` : '',
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
