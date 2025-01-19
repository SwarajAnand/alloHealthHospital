const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      const error = new Error("Authorization token is missing.");
      error.status = 401;
      throw error;
    }

    const userToken = authHeader.split(" ")[1];

    if (!userToken) {
      const error = new Error("Bearer token is missing.");
      error.status = 401;
      throw error;
    }

    const data = await jwt.verify(userToken, process.env.SECRET_TOKEN_KEY);
    req.user = data;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.message = "Invalid or malformed token.";
      error.status = 401;
    } else if (error.name === "TokenExpiredError") {
      error.message = "Token has expired.";
      error.status = 401;
    }

    next(error);
  }
};

module.exports = authMiddleware;
