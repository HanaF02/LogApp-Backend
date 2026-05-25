export const errorHandler = (err, req, res, next) => {
  // MongoDB duplicate key error — fires when unique index is violated
  // e.g. registering with an email or username that already exists
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    return res.status(400).json({ message: `${label} already in use` });
  }
  // Mongoose validation error — fires when schema rules are broken
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)[0].message;
    return res.status(400).json({ message });
  }
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
