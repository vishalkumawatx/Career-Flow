const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile, changePassword, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.post('/logout', auth, logout);

module.exports = router;
