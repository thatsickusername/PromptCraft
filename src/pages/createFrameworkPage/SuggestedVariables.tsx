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
        className={`w-full px-4 py-2 text-white font-semibold rounded-lg
            relative inline-flex items-center justify-center
            text-lg 
            ${!isGeneratingVariables 
              ? "bg-gradient-to-br from-green-600 via-green-400 to-lime-400"  
              : "bg-gradient-to-br from-green-700 via-green-500 to-lime-600"
            }
            bg-[size:400%_400%]
            hover:shadow-xl hover:shadow-green-400/30
            transition-shadow duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        `}
        style={{ animation: 'liquid-flow 4s ease infinite' }}
      >
        {isGeneratingVariables ? "Generating..." : "Suggest Variables"}
      </button>
      
      {suggestedVariables.length > 0 && (
        <div className="mt-4 space-y-4">
          {suggestedVariables.map((suggestion, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
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
                className="mt-2 w-full px-4 py-2 text-sm bg-green-200 text-green-700 font-semibold rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
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
