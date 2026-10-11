// updated [backend/middleware/auth.js]
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.warn('[AUTH] No token provided');
      return next(new ErrorHandler('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log('[AUTH] Token verified, userId set to:', req.userId);
    next();
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token expired', 401));
    }
    next(new ErrorHandler('Invalid token', 401));
  }
};

module.exports = auth;
