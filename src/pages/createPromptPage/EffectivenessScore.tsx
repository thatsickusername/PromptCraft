import type { EffectivenessScore } from "../../types";

interface EffectivenessScoreProps {
  score: EffectivenessScore | null;
  isAnalyzing: boolean;
  promptText: string;
}

export default function EffectivenessScore({ score, isAnalyzing, promptText }: EffectivenessScoreProps) {
  if (!promptText.trim() || promptText.trim().length < 10) {
    return null;
  }

  const getScoreColor = (totalScore: number) => {
    if (totalScore >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (totalScore >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getCategoryColor = (categoryScore: number) => {
    if (categoryScore >= 20) return "bg-green-500";
    if (categoryScore >= 15) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isAnalyzing) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          <span className="text-sm text-gray-600">Analyzing prompt effectiveness...</span>
        </div>
      </div>
    );
  }

  if (!score) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Overall Score */}
      <div className={`p-4 rounded-lg border-2 ${getScoreColor(score.total_score)}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Effectiveness Score</span>
          <span className="text-2xl font-bold">{score.total_score}/100</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              score.total_score >= 80 ? 'bg-green-500' : 
              score.total_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score.total_score}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(score.breakdown).map(([category, details]) => (
          <div key={category} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 capitalize">
                {category.replace('_', ' ')}
              </h4>
              <span className="text-lg font-semibold text-gray-900">
                {details.score}/25
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${getCategoryColor(details.score)}`}
                style={{ width: `${(details.score / 25) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mb-1">{details.reasoning}</p>
            {details.improvement && (
              <p className="text-xs text-indigo-600 italic">💡 {details.improvement}</p>
            )}
          </div>
        ))}
      </div>

      {/* Overall Suggestions */}
      {score.overall_suggestions && score.overall_suggestions.length > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Suggestions for Improvement</h4>
          <ul className="space-y-1">
            {score.overall_suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-700">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
