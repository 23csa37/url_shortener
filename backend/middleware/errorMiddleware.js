// Centralized Error Handling Middleware

// Custom App Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log Error with Timestamp, Message, and Stack Trace
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ Error: ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // Handle specific message conditions to match user requirements exactly
  let responseMessage = message;

  // Map known errors to the specific text requested by user
  if (message.toLowerCase().includes('database operation failed')) {
    return res.status(500).json({ success: false, message: 'Database operation failed' });
  }

  res.status(statusCode).json({
    success: false,
    message: responseMessage
  });
};

module.exports = {
  AppError,
  errorMiddleware
};
