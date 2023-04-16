const sentToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.status(statusCode).json({
    success: true,
    token,
  });
};

module.exports = sentToken;
