const { extractTextFromBuffer } = require("../services/extractor.service");
const config = require("../config");

/**
 * Rule-based Analysis for Hackathon (Dynamic & Reliable)
 * Instead of relying solely on flaky AI, we'll extract real data manually.
 */
function runManualAnalysis(text) {
  // 1. Generate Summary (first 2-3 meaningful lines/sentences)
  const lines = text.split(/[.!?\n]/).filter(l => l.trim().length > 10).map(l => l.trim());
  const summary = lines.slice(0, 3).join(". ") + (lines.length > 3 ? "..." : ".");

  // 2. Extract Entities
  // Names: Simple capitalized words (filtering out common words)
  const names = [...new Set(text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [])].slice(0, 5);
  
  // Dates: Standard patterns
  const dates = [...new Set(text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/gi) || [])].slice(0, 5);
  
  // Amounts: Currency symbols + numbers
  const amounts = [...new Set(text.match(/(?:\$|£|€|₹|Rs\.?)\s?\d+(?:,\d{3})*(?:\.\d{2})?\b|\b\d+(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|EUR|GBP|INR|CAD|AUD)\b/gi) || [])].slice(0, 5);

  // 3. Sentiment Analysis (Keyword based)
  let sentiment = "neutral";
  const positiveWords = ["success", "paid", "approved", "completed", "positive", "won", "great", "excellent"];
  const negativeWords = ["error", "failed", "rejected", "overdue", "negative", "loss", "bad", "problem"];
  
  const lowerText = text.toLowerCase();
  const posCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negCount = negativeWords.filter(w => lowerText.includes(w)).length;

  if (posCount > negCount) sentiment = "positive";
  else if (negCount > posCount) sentiment = "negative";

  return {
    summary: summary || "No clear summary could be generated.",
    entities: { names, dates, amounts },
    sentiment
  };
}

// Main handler for the /analyze-document route
const analyzeDocumentController = async (req, res) => {
  // REQUIREMENT 6: Console logs to debug incoming request
  console.log("\n[DEBUG] --- New Analysis Request ---");
  console.log("[DEBUG] Content-Type:", req.headers["content-type"]);
  console.log("[DEBUG] req.file:", req.file ? `Found (${req.file.originalname})` : "Missing");
  console.log("[DEBUG] req.files:", (req.files && req.files.length > 0) ? `Found ${req.files.length} file(s)` : "Missing");
  console.log("[DEBUG] req.body keys:", Object.keys(req.body));

  try {
    // REQUIREMENT 1: Properly extract file from various sources
    let fileResource = null;

    if (req.file) {
      fileResource = req.file;
    } else if (req.files && req.files.length > 0) {
      // Pick the first file if multiple were sent
      fileResource = req.files[0];
    } else if (req.body && typeof req.body === "object") {
      // Some testers might send raw data in body fields depending on the test suite
      const firstBodyFileKey = Object.keys(req.body).find(k => req.body[k] && req.body[k].buffer);
      if (firstBodyFileKey) fileResource = req.body[firstBodyFileKey];
    }

    // REQUIREMENT 4: If file missing, THEN return fallback
    if (!fileResource) {
      console.warn("[WARN] No file found in request. Returning fallback.");
      return res.json({
        fileName: "unknown",
        summary: "No document provided for analysis.",
        entities: { names: [], dates: [], amounts: [] },
        sentiment: "neutral"
      });
    }

    const fileName = fileResource.originalname || "unnamed_document";
    console.log(`[PROCESS] Analyzing: ${fileName} (${fileResource.mimetype})`);

    // REQUIREMENT 2 & 3: Extract & Generate dynamic response
    const text = await extractTextFromBuffer(fileResource);
    
    if (!text || text.trim().length < 5) {
      console.warn(`[WARN] Extracted text for ${fileName} is empty or too short.`);
      return res.json({
        fileName: fileName,
        summary: "Document appears to be empty or unreadable.",
        entities: { names: [], dates: [], amounts: [] },
        sentiment: "neutral"
      });
    }

    const analysis = runManualAnalysis(text);
    
    // REQUIREMENT 5: Return EXACT JSON format
    const response = {
      fileName: fileName,
      summary: analysis.summary,
      entities: {
        names: analysis.entities.names,
        dates: analysis.entities.dates,
        amounts: analysis.entities.amounts
      },
      sentiment: analysis.sentiment
    };

    console.log("[SUCCESS] Analysis complete for:", fileName);
    res.json(response);

  } catch (error) {
    console.error(`[ERROR] Document processing failure: ${error.message}`);
    res.json({
      fileName: "error",
      summary: "An internal error occurred during analysis.",
      entities: { names: [], dates: [], amounts: [] },
      sentiment: "neutral"
    });
  }
};

module.exports = { analyzeDocumentController };
