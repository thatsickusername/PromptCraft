import type { SuggestedVariable } from "../types";

export const generateVariables = async (text: string): Promise<SuggestedVariable[]> => {
  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Validate API key exists
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }

  const prompt = `Based on the following text, suggest a list of 3-5 high-quality variables. For each variable, provide a descriptive variable name (camelCase), the original phrase or word it replaces, a short default value, and a hint explaining its purpose. Ensure the variables are meaningful and capture key concepts or changeable elements.
  Text: "${text}"`;

  const chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });
  
  const payload = {
    contents: chatHistory,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            "variableName": { "type": "STRING" },
            "originalText": { "type": "STRING" },
            "defaultValue": { "type": "STRING" },
            "hint": { "type": "STRING" }
          },
          "propertyOrdering": ["variableName", "originalText", "defaultValue", "hint"]
        }
      }
    }
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  
  let response;
  let retryCount = 0;
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second

  while (retryCount < maxRetries) {
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add additional security headers if needed
          'User-Agent': 'FrameworkApp/1.0'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
      } else if (response.ok) {
        break; // Success, exit the loop
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (retryCount >= maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
  }

  if (!response || !response.ok) {
    throw new Error("Failed to fetch response from API after multiple retries.");
  }
  
  const result = await response.json();
  
  if (result.candidates && result.candidates.length > 0 &&
      result.candidates[0].content && result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0) {
    const jsonString = result.candidates[0].content.parts[0].text;
    return JSON.parse(jsonString);
  } else {
    throw new Error("Unexpected API response format or no content.");
  }
};
