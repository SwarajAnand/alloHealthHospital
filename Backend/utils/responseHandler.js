exports.sendSuccess = (res, data, message = "Success") => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};
