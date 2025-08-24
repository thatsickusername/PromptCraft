import type { Variable } from "../types";

export const renderHighlightedText = (text: string, variables: Record<string, Variable>): string => {
  let htmlContent = text;
  const sortedVariables = Object.entries(variables).sort(([, a], [, b]) => b.word.length - a.word.length);
  
  for (const [varName, { word, defaultValue }] of sortedVariables) {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    htmlContent = htmlContent.replace(
      regex,
      `<span class="bg-green-200 text-green-800 font-semibold px-1 rounded-md cursor-pointer" data-variable-name="${varName}" title="Original: '${word}', Default: '${defaultValue}'">{${varName}}</span>`
    );
  }
  return htmlContent;
};

export const processTextInput = (text: string, variables: Record<string, Variable>): string => {
  let newText = text;
  const sortedVariables = Object.entries(variables).sort(([, a], [, b]) => b.word.length - a.word.length);
  
  for (const [varName, { word }] of sortedVariables) {
    const regex = new RegExp(`\\{${varName}\\}`, 'g');
    newText = newText.replace(regex, word);
  }
  return newText;
};

export const renderPreviewText = (
  text: string, 
  variables: Record<string, Variable>, 
  previewValues: Record<string, string>
): string => {
  let previewContent = text;
  const sortedVariables = Object.entries(variables).sort(([, a], [, b]) => b.word.length - a.word.length);
  
  for (const [varName, { word }] of sortedVariables) {
    const value = previewValues[varName] !== undefined ? previewValues[varName] : variables[varName].defaultValue;
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    previewContent = previewContent.replace(regex, value);
  }
  return previewContent;
};
