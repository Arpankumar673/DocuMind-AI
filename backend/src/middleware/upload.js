const multer = require("multer");
const config = require("../config");

// Multer setup using memory storage for ease
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (config.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format (PDF, JPG, PNG & DOCX only)."), false);
  }
};

const upload = multer({
  storage
});

module.exports = upload;
