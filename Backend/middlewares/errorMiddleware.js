const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

module.exports = errorMiddleware;