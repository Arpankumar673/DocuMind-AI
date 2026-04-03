// Simple auth check using a secret key
const authenticateToken = (req, res, next) => {
  // Priority: x-api-key, fallback: Authorization Bearer
  const token = req.headers["x-api-key"] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token || token !== process.env.AUTH_SECRET) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Missing or invalid token." 
    });
  }

  next();
};

module.exports = authenticateToken;
