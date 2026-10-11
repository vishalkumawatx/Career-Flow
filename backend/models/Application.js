// updated [backend/models/Application.js]
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide a job role'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied',
      required: true,
    },
    appliedDate: {
      type: Date,
      required: [true, 'Please provide an application date'],
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    url: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
  },
  { timestamps: true }
);

// Index for better query performance
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
