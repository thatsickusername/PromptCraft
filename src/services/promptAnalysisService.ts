import type { EffectivenessScore } from "../types";

export async function analyzePromptEffectiveness(
  promptText: string
): Promise<EffectivenessScore> {
  if (!promptText || promptText.trim().length < 10) {
    throw new Error("Prompt must be at least 10 characters long.");
  }

  try {
    const response = await fetch("/api/analyzePrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data: EffectivenessScore = await response.json();
    return data;
  } catch (err) {
    console.error("Frontend service error:", err);
    throw new Error("Failed to analyze prompt. Please try again.");
  }
}
