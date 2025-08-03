import type { EditingVariable } from "../../types";

interface VariableFormProps {
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
}

export default function VariableForm({
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
  onDeleteVariable
}: VariableFormProps) {
  return (
    <>
      {editingVariable ? (
        // Edit Variable UI
        <>
          <div className="p-4 mb-6 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Variable Name:</p>
            <em className="text-lg font-semibold text-indigo-600">{editingVariable.name}</em>
          </div>
          
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Original Phrase</span>
            <p className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2 shadow-sm text-sm text-gray-500">{editingVariable.word}</p>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Default Value</span>
            <input
              type="text"
              value={editingVariable.defaultValue}
              onChange={(e) => setEditingVariable({ ...editingVariable, defaultValue: e.target.value })}
              placeholder="This value will be used if none provied"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </label>
          
          <label className="block mb-6">
            <span className="text-sm font-medium text-gray-700">Hint</span>
            <input
              type="text"
              value={editingVariable.hint}
              onChange={(e) => setEditingVariable({ ...editingVariable, hint: e.target.value })}
              placeholder="This hint will be displayed to the user"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </label>
          
          <button
            onClick={onEditVariable}
            className="w-full px-4 py-2 mb-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            Save Changes
          </button>
          
          <button
            onClick={onDeleteVariable}
            className="w-full px-4 py-2 text-sm text-red-600 font-semibold rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
          >
            Delete Variable
          </button>
        </>
      ) : (
        // Create Variable UI
        <>
          {selectedWord && (
            <div className="p-4 mb-6 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Selected Phrase:</p>
              <em className="text-lg font-semibold text-indigo-600">{selectedWord}</em>
            </div>
          )}
          
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Variable Name</span>
            <input
              type="text"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              placeholder="Name will used for variable"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </label>
          
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Default Value (Optional)</span>
            <input
              type="text"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Value will be used if none provied"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </label>
          
          <label className="block mb-6">
            <span className="text-sm font-medium text-gray-700">Hint (Optional)</span>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Hint will be shown to the user"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </label>
          
          <button
            onClick={onCreateVariable}
            disabled={!variableName || !selectedWord}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            Create Variable
          </button>
        </>
      )}
    </>
  );
}
