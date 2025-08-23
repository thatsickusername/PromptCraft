import VariableForm from "./VariableForm";
import SuggestedVariables from "./SuggestedVariables";
import type { SuggestedVariable, EditingVariable } from "../../types";

interface FrameworkSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  selectedWord: string;
  variableName: string;
  setVariableName: (name: string) => void;
  defaultValue: string;
  setDefaultValue: (value: string) => void;
  hint: string;
  setHint: (hint: string) => void;
  editingVariable: EditingVariable | null;
  setEditingVariable: (variable: EditingVariable | null) => void;
  onCreateVariable: () => void;
  onEditVariable: () => void;
  onDeleteVariable: () => void;
  suggestedVariables: SuggestedVariable[];
  isGeneratingVariables: boolean;
  onGenerateVariables: () => void;
  onAddSuggestedVariable: (suggestion: SuggestedVariable, index: number) => void;
  text: string;
  frameworkName: string;
  setFrameworkName: (name: string) => void;
  onSave: () => void;
  isSaving: boolean;
  variablesCount: number;
}

export default function FrameworkSidebar({
  showSidebar,
  setShowSidebar,
  selectedWord,
  variableName,
  setVariableName,
  defaultValue,
  setDefaultValue,
  hint,
  setHint,
  editingVariable,
  setEditingVariable,
  onCreateVariable,
  onEditVariable,
  onDeleteVariable,
  suggestedVariables,
  isGeneratingVariables,
  onGenerateVariables,
  onAddSuggestedVariable,
  text,
}: FrameworkSidebarProps) {
  return (
    <div
      className={`flex-shrink-0 w-full md:w-80 p-6 bg-neutral-100 border-l border-gray-200 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out z-10 
        ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} 
        ${!showSidebar ? 'fixed right-0 top-0 h-full md:relative' : 'fixed right-0 top-0 h-full md:relative'}
      `}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-700">{editingVariable ? "Edit Variable" : "Create Variable"}</h2>
        <button onClick={() => setShowSidebar(false)} className="md:hidden p-1 text-gray-500 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <VariableForm
        selectedWord={selectedWord}
        variableName={variableName}
        setVariableName={setVariableName}
        defaultValue={defaultValue}
        setDefaultValue={setDefaultValue}
        hint={hint}
        setHint={setHint}
        editingVariable={editingVariable}
        setEditingVariable={setEditingVariable}
        onCreateVariable={onCreateVariable}
        onEditVariable={onEditVariable}
        onDeleteVariable={onDeleteVariable}
      />

      <hr className="my-6 border-gray-200" />
      
      <SuggestedVariables
        suggestedVariables={suggestedVariables}
        isGeneratingVariables={isGeneratingVariables}
        onGenerateVariables={onGenerateVariables}
        onAddSuggestedVariable={onAddSuggestedVariable}
        text={text}
      />
    </div>
  );
}
