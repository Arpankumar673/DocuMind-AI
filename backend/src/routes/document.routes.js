const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/upload");
const controller = require("../controllers/document.controller");

/**
 * Route: POST /analyze-document
 * Handlers: Authentication, Multer Upload, Document Analysis
 */
router.post(
  "/analyze-document",
  upload.any(),
  controller.analyzeDocumentController
);

module.exports = router;
