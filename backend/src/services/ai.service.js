const axios = require("axios");
const config = require("../config");

// Send text to AI and get structured JSON back
async function analyzeDocument(text) {
  const apiKey = config.openRouterKey;
  
  if (!apiKey) {
    console.error("No API key set.");
    return config.fallback;
  }

  // Tell the AI exactly what we want to find
  const prompt = `
    Analyze this document and pull out:
    1. A short summary (under 150 words)
    2. Key names, dates, and amounts
    3. Sentiment (positive, negative, or neutral)

    Only return valid JSON in this format:
    {
      "summary": "",
      "entities": { "names": [], "dates": [], "amounts": [] },
      "sentiment": ""
    }

    Document Text:
    ${text}
  `;

  // Try different models if one fails
  for (const model of config.models) {
    try {
      console.log(`Trying analysis with ${model}...`);
      
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: [
            { 
              role: "system", 
              content: "You are a helpful analyst that always returns clean JSON." 
            },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          timeout: 12000 // 12 seconds wait
        }
      );

      const content = response.data.choices[0].message.content;
      const json = content.replace(/```json|```/g, "").trim();
      
      try {
        const result = JSON.parse(json);
        
        // Final sanity check for the output
        return {
          summary: result.summary || "Summary missing",
          entities: {
            names: Array.isArray(result.entities?.names) ? result.entities.names : [],
            dates: Array.isArray(result.entities?.dates) ? result.entities.dates : [],
            amounts: Array.isArray(result.entities?.amounts) ? result.entities.amounts : []
          },
          sentiment: ["positive", "negative", "neutral"].includes(result.sentiment?.toLowerCase()) 
            ? result.sentiment.toLowerCase() 
            : "neutral"
        };
      } catch (e) {
        console.warn(`JSON parse error with ${model}. Trying next one...`);
      }
    } catch (err) {
      console.warn(`AI fail with ${model}: ${err.message}`);
    }
  }

  // All models failed, use a blank template
  console.error("All AI attempts failed.");
  return config.fallback;
}

module.exports = { analyzeDocument };
