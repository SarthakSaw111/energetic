// Gemini API client with rate limiting and error handling
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;
let visionModel = null;

// Rate limiter
const rateLimiter = {
  calls: [],
  maxPerMinute: 14,
  maxPerDay: 1400,
  dailyCalls: 0,
  lastReset: new Date().toDateString(),
};

/**
 * Initialize Gemini with API key
 */
export function initGemini(apiKey) {
  if (!apiKey) {
    console.warn("No Gemini API key provided");
    return false;
  }
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    return true;
  } catch (err) {
    console.error("Failed to init Gemini:", err);
    return false;
  }
}

/**
 * Check if Gemini is initialized
 */
export function isGeminiReady() {
  return model !== null;
}

/**
 * Rate limit check
 */
function checkRateLimit() {
  const now = Date.now();
  const today = new Date().toDateString();

  // Reset daily counter
  if (rateLimiter.lastReset !== today) {
    rateLimiter.dailyCalls = 0;
    rateLimiter.lastReset = today;
  }

  // Check daily limit
  if (rateLimiter.dailyCalls >= rateLimiter.maxPerDay) {
    throw new Error("Daily API limit reached. The AI will be back tomorrow!");
  }

  // Clean old calls (older than 1 minute)
  rateLimiter.calls = rateLimiter.calls.filter((t) => now - t < 60000);

  // Check per-minute limit
  if (rateLimiter.calls.length >= rateLimiter.maxPerMinute) {
    throw new Error("Too many requests. Wait a moment and try again.");
  }

  rateLimiter.calls.push(now);
  rateLimiter.dailyCalls++;
}

/**
 * Send a text prompt to Gemini
 */
export async function sendPrompt(systemPrompt, userMessage, options = {}) {
  if (!model)
    throw new Error(
      "Gemini not initialized. Please add your API key in Profile.",
    );

  checkRateLimit();

  try {
    const fullPrompt = `${systemPrompt}\n\n---\nUser: ${userMessage}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        // maxOutputTokens: options.maxTokens || 1024,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw new Error(`AI error: ${err.message}`);
  }
}

/**
 * Send a chat conversation to Gemini (multi-turn)
 */
export async function sendChat(systemPrompt, messages, options = {}) {
  if (!model) throw new Error("Gemini not initialized");

  checkRateLimit();

  try {
    // Build conversation as a single prompt with history
    let fullPrompt = systemPrompt + "\n\n---\nConversation:\n";
    for (const msg of messages) {
      fullPrompt += `${msg.role === "user" ? "User" : "Coach"}: ${msg.content}\n`;
    }
    fullPrompt += "Coach:";

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.8,
        // maxOutputTokens: options.maxTokens || 1024,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini chat error:", err);
    throw new Error(`AI chat error: ${err.message}`);
  }
}

/**
 * Send a structured prompt expecting JSON response
 */
export async function sendStructuredPrompt(
  systemPrompt,
  userMessage,
  options = {},
) {
  if (!model) throw new Error("Gemini not initialized");

  checkRateLimit();

  try {
    const fullPrompt = `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanation outside JSON.\n\n---\nUser: ${userMessage}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.4,
        // maxOutputTokens: options.maxTokens || 2048,
      },
    });

    const response = await result.response;
    const text = response.text().trim();

    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini structured prompt error:", err);
    throw new Error(`AI parsing error: ${err.message}`);
  }
}

/**
 * Analyze an image with Gemini Vision (for progress photo verification)
 */
export async function analyzeImage(
  systemPrompt,
  imageBase64,
  mimeType = "image/jpeg",
) {
  if (!visionModel) throw new Error("Gemini Vision not initialized");

  checkRateLimit();

  try {
    const result = await visionModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { inlineData: { data: imageBase64, mimeType } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini Vision error:", err);
    throw new Error(`AI vision error: ${err.message}`);
  }
}

/**
 * Get current usage stats
 */
export function getUsageStats() {
  return {
    callsThisMinute: rateLimiter.calls.filter((t) => Date.now() - t < 60000)
      .length,
    callsToday: rateLimiter.dailyCalls,
    limitPerMinute: rateLimiter.maxPerMinute,
    limitPerDay: rateLimiter.maxPerDay,
  };
}
