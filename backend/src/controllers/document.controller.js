const { extractTextFromBuffer } = require("../services/extractor.service");
const { analyzeDocument } = require("../services/ai.service");
const config = require("../config");

// Main handler for the /analyze-document route
const analyzeDocumentController = async (req, res) => {
  // REQUIREMENT 9: Console logs for debugging
  console.log("DEBUG: Testing req.file:", req.file ? "Found" : "Missing");
  console.log("DEBUG: Testing req.files:", (req.files && req.files.length > 0) ? `Found ${req.files.length} file(s)` : "Missing");
  console.log("DEBUG: Testing req.body:", req.body);

  try {
    // REQUIREMENT 2: Accept file from different potential sources
    let fileResource = null;

    // Standard multer single file key 'file'
    if (req.file) {
      fileResource = req.file;
    } 
    // Any field names (req.files is an array with upload.any())
    else if (req.files && req.files.length > 0) {
      fileResource = req.files[0];
    }
    // Fallback if file is in body (some testers send it like this)
    else if (req.body && req.body.file) {
      fileResource = req.body.file;
    }

    // REQUIREMENT 7: If file is missing, return fallback structure instead of error
    if (!fileResource) {
      console.warn("No valid document object found in request.");
      return res.json(config.fallback);
    }

    const fileName = fileResource.originalname || "document";
    console.log(`Processing: ${fileName}`);

    // REQUIREMENT 5: Ensure safe extraction (no crashes)
    const text = await extractTextFromBuffer(fileResource);
    
    if (!text || text.length < 5) {
      console.warn(`Extraction result for ${fileName} is too short.`);
      return res.json({
        ...config.fallback,
        fileName
      });
    }

    // Call the AI services for analysis
    const analysis = await analyzeDocument(text);
    
    // REQUIREMENT 6: ALWAYS return all fields (Document and Call Compliance)
    res.json({
      ...config.fallback,
      fileName: fileName,
      summary: analysis.summary || config.fallback.summary,
      entities: analysis.entities || config.fallback.entities,
      sentiment: analysis.sentiment || config.fallback.sentiment
    });

  } catch (error) {
    console.error(`Document processing error: ${error.message}`);
    // Always return fallback structure on catch
    res.json(config.fallback);
  }
};

module.exports = { analyzeDocumentController };
