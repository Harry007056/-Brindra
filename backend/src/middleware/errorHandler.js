export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Unexpected server error';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ message });
}
