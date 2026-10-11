// updated [backend/middleware/errorHandler.js]
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  err.details = err.details || [];

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.details = Object.values(err.errors).map((val) => val.message);
    err.message = 'Validation Error';
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'Invalid ID format';
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 400;
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(err.details.length > 0 && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
