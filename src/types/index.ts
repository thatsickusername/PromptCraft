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
  