import type { EffectivenessScore } from "../types";

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

export const analyzePromptEffectiveness = async (promptText: string): Promise<EffectivenessScore> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }

  if (!promptText || promptText.trim().length < 10) {
    throw new Error("Prompt must be at least 10 characters long for analysis");
  }

  // Optimized prompt for Flash-Lite - focused and concise
  const analysisPrompt = `Analyze this prompt's effectiveness (0-100 scale):

"${promptText}"

Rate each area (0-25 points):
• Specificity: How detailed and precise?
• Structure: Well-organized with clear flow?
• Context: Sufficient background information?
• Action Clarity: Clear expected outputs?

Return valid JSON only:
{
  "total_score": 85,
  "breakdown": {
    "specificity": {"score": 22, "reasoning": "Good detail level", "improvement": "Add examples"},
    "structure": {"score": 21, "reasoning": "Well organized", "improvement": "Use sections"},
    "context": {"score": 20, "reasoning": "Adequate context", "improvement": "More background"},
    "action_clarity": {"score": 22, "reasoning": "Clear outputs", "improvement": "Specify format"}
  },
  "overall_suggestions": ["Add specific examples", "Structure with clear sections"]
}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1, // Low temperature for consistent scoring
      maxOutputTokens: 600, // Reduced for faster response
      // Note: thinking is OFF by default for Flash-Lite (optimized for speed)
    }
  };

  // USE GEMINI 2.5 FLASH-LITE - Best rate limits and performance for your use case
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
  
  let response;
  let retryCount = 0;
  const maxRetries = 2;
  const baseDelay = 1000;

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempt ${retryCount + 1}: Using Gemini 2.5 Flash-Lite for analysis...`);
      
      response = await fetchWithTimeout(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }, 6000); // Shorter timeout for Flash-Lite's low latency

      console.log('Response status:', response.status);

      if (response.status === 429) {
        console.warn('Rate limited, retrying...');
        const delay = baseDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
      } else if (response.ok) {
        break;
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Analysis fetch error:", error);
      if (retryCount >= maxRetries - 1) {
        return getFallbackScore(promptText);
      }
      const delay = baseDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
  }

  if (!response || !response.ok) {
    console.warn("API failed, using fallback scoring");
    return getFallbackScore(promptText);
  }
  
  try {
    const result = await response.json();
    console.log('API Response received from 2.5 Flash-Lite');
    
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const jsonString = result.candidates[0].content.parts[0].text;
      const parsedResult = JSON.parse(jsonString);
      console.log('Analysis completed successfully');
      return parsedResult;
    } else {
      console.warn("Unexpected response format, using fallback");
      return getFallbackScore(promptText);
    }
  } catch (parseError) {
    console.error("JSON parsing error:", parseError);
    return getFallbackScore(promptText);
  }
};

// Enhanced fallback scoring with better heuristics
const getFallbackScore = (promptText: string): EffectivenessScore => {
  const wordCount = promptText.trim().split(/\s+/).length;
  const sentences = promptText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const hasQuestions = promptText.includes('?');
  const hasSpecificWords = /\b(specific|detailed|example|format|style|please|create|generate|write|explain|describe)\b/i.test(promptText);
  const hasStructure = /\b(first|then|next|finally|step|section|bullet|list)\b/i.test(promptText);
  const hasContext = /\b(context|background|scenario|situation|assume|given)\b/i.test(promptText);
  const hasOutput = /\b(output|result|response|answer|format|provide|return)\b/i.test(promptText);
  
  // Improved scoring algorithm
  let specificity = Math.min(25, Math.floor(wordCount / 3) + (hasSpecificWords ? 8 : 0) + (sentences > 2 ? 3 : 0));
  let structure = (hasStructure ? 20 : 12) + (sentences > 3 ? 5 : 0);
  let context = Math.min(25, (hasContext ? 18 : 10) + Math.floor(wordCount / 15));
  let actionClarity = (hasOutput ? 20 : 10) + (hasQuestions ? 5 : 0) + (hasSpecificWords ? 3 : 0);
  
  // Ensure realistic scoring
  specificity = Math.max(8, Math.min(25, specificity));
  structure = Math.max(8, Math.min(25, structure));
  context = Math.max(8, Math.min(25, context));
  actionClarity = Math.max(8, Math.min(25, actionClarity));
  
  return {
    total_score: specificity + structure + context + actionClarity,
    breakdown: {
      specificity: {
        score: specificity,
        reasoning: `Analysis based on ${wordCount} words and ${hasSpecificWords ? 'good' : 'limited'} specific terminology`,
        improvement: hasSpecificWords ? "Consider adding concrete examples" : "Add more specific details and examples"
      },
      structure: {
        score: structure,
        reasoning: hasStructure ? "Good structural indicators found" : `Basic structure with ${sentences} sentences`,
        improvement: hasStructure ? "Consider clearer section breaks" : "Organize with clear sections and logical flow"
      },
      context: {
        score: context,
        reasoning: hasContext ? "Context indicators present" : "Limited contextual information provided",
        improvement: hasContext ? "Expand background details" : "Provide more background information and constraints"
      },
      action_clarity: {
        score: actionClarity,
        reasoning: hasOutput ? "Clear output expectations" : "Action clarity needs improvement",
        improvement: hasOutput ? "Specify exact format desired" : "Clearly specify expected outputs and format"
      }
    },
    overall_suggestions: [
      wordCount < 20 ? "Expand your prompt with more details" : "Good length, consider organizing better",
      !hasSpecificWords ? "Use more specific and precise language" : "Add concrete examples",
      !hasOutput ? "Clearly specify what output format you want" : "Consider adding success criteria"
    ]
  };
};

// Usage tracking for 2.5 Flash-Lite
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();

export const getRemainingRequests = () => {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = today;
  }
  return Math.max(0, 1000 - dailyRequestCount); // 1000 RPD for Flash-Lite
};

export const incrementRequestCount = () => {
  dailyRequestCount++;
  console.log(`Requests used today: ${dailyRequestCount}/1000 (Flash-Lite)`);
};
