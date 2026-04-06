// // Centralized Express error handler middleware

export const errorHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    return res.status(status).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  return res.status(status).json({ success: false, message });
};
