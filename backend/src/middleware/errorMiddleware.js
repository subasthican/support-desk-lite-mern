const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    data: null,
    error:
      process.env.NODE_ENV === "production"
        ? "Server Error"
        : err.message
  });
};

module.exports = { errorHandler };