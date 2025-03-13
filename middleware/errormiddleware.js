const errorHandler = (err, req, res, next) => {
  const statuseCode = res.statuseCode ? res.statuseCode : 500;
  res.status(statuseCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;
