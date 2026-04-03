const axios = require("axios");

/**
 * Analyzes the extracted text using OpenRouter API with automatic model fallback.
 * 
 * @param {string} text - The extracted text to analyze.
 * @returns {Promise<Object>} - A structured analysis result object.
 */
async function analyzeDocument(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  // FALLBACK: Required response structure if any failure occurs
  const FALLBACK_RESPONSE = {
    summary: "Could not analyze document",
    entities: {
      names: [],
      dates: [],
      amounts: []
    },
    sentiment: "neutral"
  };

  if (!apiKey) {
    console.error("Missing OpenRouter API key.");
    return FALLBACK_RESPONSE;
  }

  // List of models to try in order (Primary -> Fallbacks)
  const models = [
    process.env.AI_MODEL || "openai/gpt-3.5-turbo",
    "google/gemini-2.0-flash-001",
    "google/gemini-pro-1.5",
    "mistralai/mistral-7b-instruct"
  ];

  // AI Prompt strategy: Strict JSON Enforcement
  const prompt = `
    You are a JSON generator. Return ONLY valid JSON. No explanation. No markers.
    Analyze the provided document text and extract the required information.
    
    JSON STRUCTURE (STRICT):
    {
      "summary": "Concise summary (max 150-200 words)",
      "entities": {
        "names": [],
        "dates": [],
        "amounts": []
      },
      "sentiment": "positive | negative | neutral"
    }

    DOCUMENT TEXT (SAMPLED):
    ${text.slice(0, 3000)} // Requirement 8: Limit text to 3000 chars
  `;

  for (const model of models) {
    try {
      console.log(`AI Attempt with: ${model}`);
      
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: [
            {
              role: "system",
              content: "You are a JSON generator. Always return valid JSON without extra text or markdown."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://documind-ai.vercel.app", 
            "X-Title": "DocuMind AI"
          },
          timeout: 10000 // 10s timeout
        }
      );

      const messageContent = response.data.choices[0].message.content;
      
      // CRITICAL: Clean and Parse JSON (Requirement 6)
      let cleanedContent = messageContent.replace(/```json|```/g, "").trim();
      
      try {
        const result = JSON.parse(cleanedContent);
        
        // Ensure final object has exactly the required fields (Requirement 4)
        return {
          summary: result.summary || "Could not generate summary",
          entities: {
            names: Array.isArray(result.entities?.names) ? result.entities.names : [],
            dates: Array.isArray(result.entities?.dates) ? result.entities.dates : [],
            amounts: Array.isArray(result.entities?.amounts) ? result.entities.amounts : []
          },
          sentiment: ["positive", "negative", "neutral"].includes(result.sentiment?.toLowerCase()) 
            ? result.sentiment.toLowerCase() 
            : "neutral"
        };
      } catch (parseError) {
        console.warn(`JSON Parse failed for model ${model}: ${parseError.message}`);
        // Continue to fallback model if JSON is garbage
      }

    } catch (error) {
      console.warn(`Model ${model} failed with error: ${error.message}`);
    }
  }

  // All attempts failed
  console.error("All AI models failed. Returning hackathon fallback JSON.");
  return FALLBACK_RESPONSE;
}

module.exports = { analyzeDocument };
