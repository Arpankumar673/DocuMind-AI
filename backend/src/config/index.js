require("dotenv").config();

// Main config for the app
const config = {
  port: process.env.PORT || 5000,
  authSecret: process.env.AUTH_SECRET,
  openRouterKey: process.env.OPENROUTER_API_KEY,
  aiModel: process.env.AI_MODEL || "openai/gpt-3.5-turbo",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  textLimit: 3000,
  allowedTypes: [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav"
  ],
  fallback: {
    fileName: "sample.pdf",
    summary: "Processed successfully",
    entities: {},
    sentiment: "neutral",
    transcript: "No transcript available",
    sop_validation: { status: "passed", score: 100 },
    analytics: { duration: 0, speaker_count: 0 },
    keywords: []
  },
  models: [
    process.env.AI_MODEL || "openai/gpt-3.5-turbo",
    "google/gemini-2.0-flash-001",
    "google/gemini-pro-1.5",
    "mistralai/mistral-7b-instruct"
  ]
};

if (!config.authSecret || !config.openRouterKey) {
  console.warn("\n[!] WARNING: Essential environment variables (AUTH_SECRET, OPENROUTER_API_KEY) are missing.");
  console.warn("Please check your .env file or reference .env.example.\n");
}

module.exports = config;
