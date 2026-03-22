const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getApplications,
  getStats,
  getUpcomingDeadlines,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  exportCSV,
} = require('../controllers/applicationController');

// All routes are private
router.use(auth);

// Statistics
router.get('/stats', getStats);
router.get('/upcoming-deadlines', getUpcomingDeadlines);

// CRUD operations
router.get('/', getApplications);
router.post('/', createApplication);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

// Export
router.get('/export/csv', exportCSV);

module.exports = router;
