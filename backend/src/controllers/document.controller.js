const { extractTextFromBuffer } = require("../services/extractor.service");
const { analyzeDocument } = require("../services/ai.service");
const config = require("../config");

// Main handler for the /analyze-document route
const analyzeDocumentController = async (req, res) => {
  try {
    const file = req.file;

    // Check if the file uploaded at all
    if (!file || file.size === 0) {
      return res.status(400).json({ 
        error: "Bad Request", 
        message: "No document provided for analysis." 
      });
    }

    console.log(`Processing: ${file.originalname}`);

    // Get the text from the file
    const text = await extractTextFromBuffer(file);
    
    // Check if the file is empty or readable
    if (!text || text.length < 5) {
      console.warn(`Extraction result for ${file.originalname} is empty or too short.`);
      return res.json(config.fallback);
    }

    // Call the AI services for analysis
    const analysis = await analyzeDocument(text);
    
    // Give the final results back to the frontend
    res.json(analysis);

  } catch (error) {
    console.error(`Document processing error: ${error.message}`);
    
    // Always give something back so the frontend doesn't crash
    res.json(config.fallback);
  }
};

module.exports = { analyzeDocumentController };
