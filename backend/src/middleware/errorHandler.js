// A small custom error class so controllers can throw with a specific
// HTTP status instead of always defaulting to 500.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Must be registered last, after all routes.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: isServerError && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

module.exports = { ApiError, notFound, errorHandler };
