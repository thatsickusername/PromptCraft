export interface Variable {
    word: string;
    defaultValue: string;
    hint: string;
  }
  
  export interface Framework {
    name: string;
    text: string;
    variables: Record<string, Variable>;
  }
  
  export interface SuggestedVariable {
    variableName: string;
    originalText: string;
    defaultValue: string;
    hint: string;
  }
  
  export interface EditingVariable {
    name: string;
    word: string;
    defaultValue: string;
    hint: string;
  }

export interface EffectivenessScore {
  total_score: number;
  breakdown: {
    specificity: ScoreDetail;
    structure: ScoreDetail;
    context: ScoreDetail;
    action_clarity: ScoreDetail;
  };
  overall_suggestions: string[];
}

export interface ScoreDetail {
  score: number;
  reasoning: string;
  improvement: string;
}
