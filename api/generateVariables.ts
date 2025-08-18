import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing text input' });
    }

    const prompt = `Based on the following text, suggest a list of 3-5 high-quality variables. For each variable, provide a descriptive variable name (camelCase), the original phrase or word it replaces, a short default value, and a hint explaining its purpose. Ensure the variables are meaningful and capture key concepts or changeable elements.
    Text: "${text}"`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    return res.status(200).json(result);

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
