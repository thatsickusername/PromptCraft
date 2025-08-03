import type { SuggestedVariable } from "../../types";

interface SuggestedVariablesProps {
  suggestedVariables: SuggestedVariable[];
  isGeneratingVariables: boolean;
  onGenerateVariables: () => void;
  onAddSuggestedVariable: (suggestion: SuggestedVariable, index: number) => void;
  text: string;
}

export default function SuggestedVariables({
  suggestedVariables,
  isGeneratingVariables,
  onGenerateVariables,
  onAddSuggestedVariable,
  text
}: SuggestedVariablesProps) {
  return (
    <>
      <h3 className="text-lg font-bold text-gray-900 mb-2">AI Variable Suggestions</h3>
      <button
        onClick={onGenerateVariables}
        disabled={isGeneratingVariables || !text.trim()}
        className="w-full px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isGeneratingVariables ? "Generating..." : "Suggest Variables"}
      </button>
      
      {suggestedVariables.length > 0 && (
        <div className="mt-4 space-y-4">
          {suggestedVariables.map((suggestion, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-gray-800">
                <span className="text-sm text-gray-500">Var:</span> {suggestion.variableName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="text-gray-500">Original:</span> "{suggestion.originalText}"
              </p>
              <p className="text-sm text-gray-600">
                <span className="text-gray-500">Default:</span> "{suggestion.defaultValue}"
              </p>
              <p className="text-sm text-gray-600 italic">
                <span className="text-gray-500">Hint:</span> {suggestion.hint}
              </p>
              <button
                onClick={() => onAddSuggestedVariable(suggestion, index)}
                className="mt-2 w-full px-4 py-2 text-sm bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                Add Variable
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
