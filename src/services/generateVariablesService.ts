import type { SuggestedVariable } from "../types";

export const generateVariables = async (text: string): Promise<SuggestedVariable[]> => {
  const res = await fetch('/api/generateVariables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`API call failed: ${res.statusText}`);
  }

  const result = await res.json();

  if (
    result.candidates &&
    result.candidates[0]?.content?.parts?.[0]?.text
  ) {
    const jsonString = result.candidates[0].content.parts[0].text;
    return JSON.parse(jsonString);
  } else {
    throw new Error("Unexpected API response format or no content.");
  }
};
