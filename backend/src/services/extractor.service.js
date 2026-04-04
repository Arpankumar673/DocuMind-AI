const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const mammoth = require("mammoth");
const config = require("../config");

// Pull text from different file types
async function extractTextFromBuffer(file) {
  const { mimetype, buffer } = file;
  let text = "";

  try {
    if (mimetype === "application/pdf") {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (mimetype.startsWith("image/")) {
      const { data: { text: ocrResult } } = await Tesseract.recognize(buffer, "eng");
      text = ocrResult;
    } else if (mimetype.startsWith("audio/")) {
      text = "Simulated Transcript: [Thank you for joining the DocuMind analysis session. This file appears to contain professional audio content related to document verification and validation. Our system suggests a neutral to positive tone throughout the recording.]";
    }
    
    // Clean whitespace and clip text to avoid overwhelming the AI
    return text.replace(/\s+/g, " ").trim().slice(0, config.textLimit);
  } catch (error) {
    console.error("Text extraction failed:", error.message);
    throw new Error("Failed to extract text from document.");
  }
}

module.exports = { extractTextFromBuffer };
