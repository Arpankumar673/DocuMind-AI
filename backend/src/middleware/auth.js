/**
 * Authentication Middleware: Hackathon Resilience Edition
 * Supports:
 * 1. x-api-key: <token>
 * 2. Authorization: Bearer <token>
 */
const authenticateToken = (req, res, next) => {
  // Extract token from multiple possible sources
  const apiKey = req.headers["x-api-key"];
  const bearerToken = req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null;

  const providedToken = apiKey || bearerToken;

  // Comparison logic
  if (!providedToken) {
    return res.status(401).json({
      error: "Authentication Required",
      message: "Please provide an API Key or Bearer Token.",
      hint: "Add header 'x-api-key' or 'Authorization: Bearer <token>' to your request.",
      status_code: 401
    });
  }

  if (providedToken !== process.env.AUTH_SECRET) {
    return res.status(403).json({
      error: "Forbidden",
      message: "The provided authentication token is invalid.",
      hint: "Check your .env AUTH_SECRET or your request headers.",
      status_code: 403
    });
  }

  // Success: Proceed to controller
  next();
};

module.exports = authenticateToken;
