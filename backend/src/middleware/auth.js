const config = require("../config");

// Simple auth check using a secret key
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || token !== config.authSecret) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Missing or invalid token." 
    });
  }

  next();
};

module.exports = authenticateToken;
