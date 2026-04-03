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
  if (err instanceof multer.MulterError) {
    console.warn(`File upload error: ${err.message}`);
    return res.status(400).json({ error: "Upload error", message: err.message });
  } else if (err.message === "Unsupported file format (PDF, JPG, PNG & DOCX only).") {
    console.warn(`Bad file format: ${err.message}`);
    return res.status(400).json({ error: "Bad Request", message: err.message });
  }

  console.error(`System error: ${err.stack}`);
  
  // Give back fallback JSON to keep UI simple
  res.json(config.fallback);
});

module.exports = app;
