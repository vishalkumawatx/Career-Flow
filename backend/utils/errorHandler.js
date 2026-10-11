// updated [backend/utils/errorHandler.js]
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.details = [];

    Error.captureStackTrace(this, this.constructor);
  }

  addDetail(detail) {
    this.details.push(detail);
    return this;
  }
}

module.exports = ErrorHandler;
