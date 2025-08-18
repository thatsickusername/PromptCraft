import type { VercelRequest, VercelResponse } from "@vercel/node";

interface EffectivenessScore {
  total_score: number;
  breakdown: {
    specificity: { score: number; reasoning: string; improvement: string };
    structure: { score: number; reasoning: string; improvement: string };
    context: { score: number; reasoning: string; improvement: string };
    action_clarity: { score: number; reasoning: string; improvement: string };
  };
  overall_suggestions: string[];
}

// --- Enhanced fallback scoring with better heuristics ---
const getFallbackScore = (promptText: string): EffectivenessScore => {
  const wordCount = promptText.trim().split(/\s+/).length;
  const sentences = promptText
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;
  const hasQuestions = promptText.includes("?");
  const hasSpecificWords = /\b(specific|detailed|example|format|style|please|create|generate|write|explain|describe)\b/i.test(
    promptText
  );
  const hasStructure = /\b(first|then|next|finally|step|section|bullet|list)\b/i.test(
    promptText
  );
  const hasContext = /\b(context|background|scenario|situation|assume|given)\b/i.test(
    promptText
  );
  const hasOutput = /\b(output|result|response|answer|format|provide|return)\b/i.test(
    promptText
  );

  let specificity = Math.min(
    25,
    Math.floor(wordCount / 3) +
      (hasSpecificWords ? 8 : 0) +
      (sentences > 2 ? 3 : 0)
  );
  let structure = (hasStructure ? 20 : 12) + (sentences > 3 ? 5 : 0);
  let context = Math.min(
    25,
    (hasContext ? 18 : 10) + Math.floor(wordCount / 15)
  );
  let actionClarity =
    (hasOutput ? 20 : 10) + (hasQuestions ? 5 : 0) + (hasSpecificWords ? 3 : 0);

  specificity = Math.max(8, Math.min(25, specificity));
  structure = Math.max(8, Math.min(25, structure));
  context = Math.max(8, Math.min(25, context));
  actionClarity = Math.max(8, Math.min(25, actionClarity));

  return {
    total_score: specificity + structure + context + actionClarity,
    breakdown: {
      specificity: {
        score: specificity,
        reasoning: `Analysis based on ${wordCount} words and ${
          hasSpecificWords ? "good" : "limited"
        } specific terminology`,
        improvement: hasSpecificWords
          ? "Consider adding concrete examples"
          : "Add more specific details and examples",
      },
      structure: {
        score: structure,
        reasoning: hasStructure
          ? "Good structural indicators found"
          : `Basic structure with ${sentences} sentences`,
        improvement: hasStructure
          ? "Consider clearer section breaks"
          : "Organize with clear sections and logical flow",
      },
      context: {
        score: context,
        reasoning: hasContext
          ? "Context indicators present"
          : "Limited contextual information provided",
        improvement: hasContext
          ? "Expand background details"
          : "Provide more background information and constraints",
      },
      action_clarity: {
        score: actionClarity,
        reasoning: hasOutput
          ? "Clear output expectations"
          : "Action clarity needs improvement",
        improvement: hasOutput
          ? "Specify exact format desired"
          : "Clearly specify expected outputs and format",
      },
    },
    overall_suggestions: [
      wordCount < 20
        ? "Expand your prompt with more details"
        : "Good length, consider organizing better",
      !hasSpecificWords
        ? "Use more specific and precise language"
        : "Add concrete examples",
      !hasOutput
        ? "Clearly specify what output format you want"
        : "Consider adding success criteria",
    ],
  };
};

// --- Usage tracking for 2.5 Flash-Lite ---
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();

const incrementRequestCount = () => {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = today;
  }
  dailyRequestCount++;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { promptText } = req.body;
  if (!promptText || promptText.trim().length < 10) {
    return res
      .status(400)
      .json({ error: "Prompt must be at least 10 characters long." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key not configured" });
  }

  incrementRequestCount();

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
      temperature: 0.1,
      maxOutputTokens: 600,
    },
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return res.status(200).json(getFallbackScore(promptText));
    }

    const result = await response.json();
    const jsonString =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!jsonString) {
      console.warn("Unexpected API response format, using fallback");
      return res.status(200).json(getFallbackScore(promptText));
    }

    const parsedResult: EffectivenessScore = JSON.parse(jsonString);
    return res.status(200).json(parsedResult);
  } catch (error) {
    console.error("Error during analysis:", error);
    return res.status(200).json(getFallbackScore(promptText));
  }
}
