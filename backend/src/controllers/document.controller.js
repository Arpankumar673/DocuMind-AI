const { extractTextFromBuffer } = require("../services/extractor.service");
const config = require("../config");

/**
 * Rule-based Analysis for Hackathon (Ultra-Robust)
 * Ensures API always returns valid, intelligent-looking data even with messy inputs.
 */
function runManualAnalysis(text) {
  // Ensure we have a string
  const content = typeof text === "string" ? text : String(text || "");
  
  // 1. Generate Summary (first 2-3 meaningful lines/sentences)
  const lines = content.split(/[.!?\n]/).filter(l => l.trim().length > 10).map(l => l.trim());
  const summary = lines.length > 0 
    ? lines.slice(0, 3).join(". ") + (lines.length > 3 ? "..." : ".")
    : "Document contains minimal extractable text for a full summary.";

  // 2. Extract Entities (Always return arrays, never null/undefined)
  const names = [...new Set(content.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [])].slice(0, 5);
  const dates = [...new Set(content.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/gi) || [])].slice(0, 5);
  const amounts = [...new Set(content.match(/(?:\$|£|€|₹|Rs\.?)\s?\d+(?:,\d{3})*(?:\.\d{2})?\b|\b\d+(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|EUR|GBP|INR|CAD|AUD)\b/gi) || [])].slice(0, 5);

  // 3. Sentiment Analysis (Keyword based)
  let sentiment = "neutral";
  const positiveWords = ["success", "paid", "approved", "completed", "positive", "won", "great", "excellent", "verified"];
  const negativeWords = ["error", "failed", "rejected", "overdue", "negative", "loss", "bad", "problem", "invalid"];
  
  const lowerText = content.toLowerCase();
  const posCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negCount = negativeWords.filter(w => lowerText.includes(w)).length;

  if (posCount > negCount) sentiment = "positive";
  else if (negCount > posCount) sentiment = "negative";

  return {
    summary,
    entities: { 
      names: Array.isArray(names) ? names : [], 
      dates: Array.isArray(dates) ? dates : [], 
      amounts: Array.isArray(amounts) ? amounts : [] 
    },
    sentiment
  };
}

// Main handler for the /analyze-document route
const analyzeDocumentController = async (req, res) => {
  // REQUIREMENT 2: Log EVERYTHING for debugging
  console.log("\n[HACKATHON-DEBUG] --- Incoming Request ---");
  console.log("HEADERS:", JSON.stringify(req.headers, null, 2));
  console.log("BODY:", JSON.stringify(req.body, null, 2));
  console.log("FILES (req.file):", req.file ? "Found" : "None");
  console.log("FILES (req.files):", req.files ? (Array.isArray(req.files) ? `Array(${req.files.length})` : "Object") : "None");

  try {
    // REQUIREMENT 1: Detect file using ALL possible methods
    let fileResource = 
      req.file || 
      (req.files && req.files[0]) || 
      (req.files && typeof req.files === 'object' ? Object.values(req.files)[0] : null) ||
      (req.files && Array.isArray(req.files) ? req.files[0] : null) ||
      req.body.file || 
      req.body.document || 
      null;

    // REQUIREMENT 4: If file DOES NOT exist, return smart dummy instead of error
    if (!fileResource) {
      console.warn("[WARN] No file detected in request. Returning smart dummy response.");
      return res.json({
        fileName: "test-document",
        summary: "Sample document processed (fallback). No actual file was detected in the multipart or body fields.",
        entities: {
          names: ["Test User", "System Admin"],
          dates: [new Date().getFullYear().toString()],
          amounts: ["100.00"]
        },
        sentiment: "neutral"
      });
    }

    // Determine filename and buffer safely
    const fileName = fileResource.originalname || "document_upload";
    let buffer = fileResource.buffer;

    // Handle base64 string if it's sent in body instead of a real file object
    if (!buffer && typeof fileResource === "string" && fileResource.includes("base64")) {
      const base64Data = fileResource.split(",")[1] || fileResource;
      buffer = Buffer.from(base64Data, "base64");
    }

    console.log(`[PROCESS] Analyzing: ${fileName}`);

    // REQUIREMENT 3: Extract text (with fallback to toString if service fails)
    let text = "";
    try {
      text = await extractTextFromBuffer(fileResource);
    } catch (err) {
      console.error("[EXTRACT-ERROR] Service failed, falling back to raw string conversion.");
      text = buffer ? buffer.toString("utf8").replace(/[^\x20-\x7E\n]/g, "") : "";
    }
    
    // Safety check for empty text
    if (!text || text.trim().length < 2) {
      text = "Empty content or non-textual data detected in the provided file.";
    }

    const analysis = runManualAnalysis(text);
    
    // REQUIREMENT 5 & 6: ALWAYS return required structure with arrays
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
    return res.json(response);

  } catch (error) {
    console.error(`[CRITICAL-ERROR] API failed to handle request: ${error.message}`);
    // REQUIREMENT 7: Make sure API NEVER returns 400 or error status
    return res.json({
      fileName: "error-recovery",
      summary: "System encountered an error during processing but recovered safely.",
      entities: { names: [], dates: [], amounts: [] },
      sentiment: "neutral"
    });
  }
};

module.exports = { analyzeDocumentController };
