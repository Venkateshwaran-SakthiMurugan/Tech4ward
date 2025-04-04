const errorHandler = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error(`Error: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // If MongoDB connection error, provide a specific message
  if (err.name === 'MongooseError' || err.name === 'MongoError' || err.name === 'MongoServerError') {
    res.status(503);
    return res.json({
      message: 'Database service unavailable. Please try again later.',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }

  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };