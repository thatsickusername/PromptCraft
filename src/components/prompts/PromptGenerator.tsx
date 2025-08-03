import { useState, useEffect } from "react";
import FrameworksList from "./FrameworksList";
import { renderPreviewText } from "../../utils/textUtils";
import type { Framework } from "../../types";

interface PromptGeneratorProps {
  frameworks: Framework[];
  setAlertMessage: (message: string) => void;
}

export default function PromptGenerator({ frameworks, setAlertMessage }: PromptGeneratorProps) {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Update preview values with default values when a new framework is selected
  useEffect(() => {
    if (selectedFramework) {
      const initialPreviewValues: Record<string, string> = {};
      for (const varName in selectedFramework.variables) {
        initialPreviewValues[varName] = selectedFramework.variables[varName].defaultValue;
      }
      setPreviewValues(initialPreviewValues);
    }
  }, [selectedFramework]);
  
  // Renders the text for the preview popup, replacing variables with their values
  const getPreviewText = () => {
    if (!selectedFramework) return "Select a framework to begin.";
    return renderPreviewText(selectedFramework.text, selectedFramework.variables, previewValues);
  };
  
  const copyPromptToClipboard = () => {
    const generatedPrompt = getPreviewText();
    // Use the older document.execCommand for better iFrame compatibility
    const el = document.createElement('textarea');
    el.value = generatedPrompt;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setAlertMessage('Prompt copied to clipboard!'); 
  };

  return (
    <div className="flex w-full h-full overflow-hidden">
      <FrameworksList
        frameworks={frameworks}
        selectedFramework={selectedFramework}
        setSelectedFramework={setSelectedFramework}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main content area for generating the prompt */}
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{selectedFramework?.name || "Select a Framework"}</h2>
        
        {selectedFramework ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            {/* Variable inputs form */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold mb-2">Variables</h3>
              {Object.keys(selectedFramework.variables).map((varName) => (
                <div key={varName}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{varName}</label>
                  <input
                    type="text"
                    value={previewValues[varName] || ""}
                    onChange={(e) => setPreviewValues(prev => ({ ...prev, [varName]: e.target.value }))}
                    placeholder={selectedFramework.variables[varName].defaultValue}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {selectedFramework.variables[varName].hint && (
                    <p className="mt-1 text-sm text-gray-500 italic">{selectedFramework.variables[varName].hint}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Live preview area */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Generated Prompt</h3>
              <div className="flex-1 bg-gray-100 p-6 rounded-lg text-lg text-gray-800 leading-relaxed whitespace-pre-wrap overflow-auto">
                {getPreviewText()}
              </div>
              <button
                onClick={copyPromptToClipboard}
                className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                Copy Prompt
              </button>
            </div>
          </div>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                <p>Select a framework from the left to start generating a prompt.</p>
            </div>
        )}
      </div>
    </div>
  );
}
