// Request Logging Middleware

const requestLogger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] 📥 Request: ${method} ${url}`);
  next();
};

module.exports = requestLogger;
