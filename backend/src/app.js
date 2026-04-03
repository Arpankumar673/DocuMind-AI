const express = require("express");
const cors = require("cors");
const multer = require("multer");
const documentRoutes = require("./routes/document.routes");
const config = require("./config");

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Routes registry
app.use("/", documentRoutes);

// Generic error catch-all for Multer or anything else
app.use((err, req, res, next) => {
  // REQUIREMENT 6/7: Always return the expected JSON format, even on error
  console.warn(`Captured background error: ${err.message}`);
  
  // Return the standard fallback structure as-is (status 200)
  return res.json(config.fallback);
});

module.exports = app;
