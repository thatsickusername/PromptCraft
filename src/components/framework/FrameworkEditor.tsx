import React, { useState, useRef, useEffect } from "react";
import FrameworkSidebar from "./FrameworkSidebar";
import { generateVariables } from "../../services/generateVariablesService";
import { renderHighlightedText, processTextInput } from "../../utils/textUtils";
import type { Framework, Variable, EditingVariable, SuggestedVariable } from "../../types";

interface FrameworkEditorProps {
  onSave: (framework: Framework) => void;
  setAlertMessage: (message: string) => void;
}

export default function FrameworkEditor({ onSave, setAlertMessage }: FrameworkEditorProps) {
  const [text, setText] = useState(
    "Add your amazing prompt here and select a word or phrase to create a variable"
  );
  const [selectedWord, setSelectedWord] = useState("");
  const [variableName, setVariableName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [hint, setHint] = useState("");
  const [variables, setVariables] = useState<Record<string, Variable>>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [frameworkName, setFrameworkName] = useState("");
  const [editingVariable, setEditingVariable] = useState<EditingVariable | null>(null);
  const [suggestedVariables, setSuggestedVariables] = useState<SuggestedVariable[]>([]);
  const [isGeneratingVariables, setIsGeneratingVariables] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // This effect synchronizes the DOM content with the 'text' state and highlights variables
  useEffect(() => {
    if (editorRef.current) {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = renderHighlightedText(text, variables);
      if (editorRef.current.innerHTML !== tempElement.innerHTML) {
        editorRef.current.innerHTML = tempElement.innerHTML;
      }
    }
  }, [text, variables]);

  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText) {
      const parentSpan = selection?.anchorNode?.parentNode as HTMLElement;
      const isVariableSpan = parentSpan?.classList?.contains('cursor-pointer');

      if (isVariableSpan) {
        // If an existing variable is selected, enter edit mode
        const varName = parentSpan.getAttribute('data-variable-name');
        if (varName && variables[varName]) {
          setEditingVariable({
            name: varName,
            word: variables[varName].word,
            defaultValue: variables[varName].defaultValue,
            hint: variables[varName].hint
          });
          setSelectedWord(""); // Clear selected word for creating new
          setShowSidebar(true);
        }
      } else {
        // If a new word is selected, enter create mode
        setSelectedWord(selectedText);
        setEditingVariable(null); // Clear editing state
        setShowSidebar(true);
      }
    } else {
      setSelectedWord("");
      setEditingVariable(null);
      setShowSidebar(false);
    }
  };

  const createVariable = () => {
    if (!variableName || !selectedWord) return;

    if (variables[variableName]) {
      setAlertMessage("Variable name already exists! Please choose another one.");
      return;
    }
    
    setVariables((prev) => ({
      ...prev,
      [variableName]: { word: selectedWord, defaultValue: defaultValue || selectedWord, hint: hint || "" }
    }));

    setVariableName("");
    setSelectedWord("");
    setDefaultValue("");
    setHint("");
    setShowSidebar(false);
  };
  
  const addSuggestedVariable = (suggestion: SuggestedVariable, index: number) => {
    if (variables[suggestion.variableName]) {
      setAlertMessage(`Variable name "${suggestion.variableName}" already exists!`);
      return;
    }
    
    setVariables((prev) => ({
      ...prev,
      [suggestion.variableName]: {
        word: suggestion.originalText,
        defaultValue: suggestion.defaultValue,
        hint: suggestion.hint
      }
    }));
    
    // Remove the added suggestion from the list
    setSuggestedVariables(prev => prev.filter((_, i) => i !== index));
    setAlertMessage(`Variable "${suggestion.variableName}" added!`);
  };

  const handleEditVariable = () => {
    if (!editingVariable) return;
    
    const newVariables = { ...variables };
    newVariables[editingVariable.name] = {
      ...newVariables[editingVariable.name],
      defaultValue: editingVariable.defaultValue,
      hint: editingVariable.hint
    };
    
    setVariables(newVariables);
    setEditingVariable(null);
    setShowSidebar(false);
  };
  
  const handleDeleteVariable = () => {
    if (!editingVariable) return;
    
    const newVariables = { ...variables };
    const originalWord = newVariables[editingVariable.name].word;
    delete newVariables[editingVariable.name];
    
    setVariables(newVariables);
    // Replace the variable placeholder with the original word in the text
    const newText = text.replace(new RegExp(`\\{${editingVariable.name}\\}`, 'g'), originalWord);
    setText(newText);
    setEditingVariable(null);
    setShowSidebar(false);
  };
  
  const handleSave = async () => {
    if (!frameworkName.trim()) {
      setAlertMessage("Please provide a name for your framework.");
      return;
    }
    if (!text.trim()) {
        setAlertMessage("Please provide text for your framework.");
        return;
    }
    if (Object.keys(variables).length === 0) {
        setAlertMessage("Please add at least one variable to your framework.");
        return;
    }
    
    setIsSaving(true);
    setAlertMessage("Saving framework...");
    
    // Save the framework without tags
    onSave({ name: frameworkName, text, variables });
    setIsSaving(false);
  };
  
  const handleGenerateVariables = async () => {
    setIsGeneratingVariables(true);
    setSuggestedVariables([]);
    setAlertMessage("Generating variables...");
  
    try {
      const suggestions = await generateVariables(text);
      setSuggestedVariables(suggestions);
      setAlertMessage("Variables generated successfully!");
    } catch (error) {
      console.error("Error generating variables:", error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("API key not found")) {
          setAlertMessage("API key configuration error. Please check your environment setup.");
        } else if (error.message.includes("Rate limit")) {
          setAlertMessage("API rate limit exceeded. Please try again in a moment.");
        } else {
          setAlertMessage(`Failed to generate variables: ${error.message}`);
        }
      } else {
        setAlertMessage("Failed to generate variables. Please try again.");
      }
    } finally {
      setIsGeneratingVariables(false);
    }
  };
  

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    const processedText = processTextInput(newText, variables);
    setText(processedText);
  };
  
  return (
    <div className="flex w-full h-full">
      {/* Editor Area */}
      <div className="flex flex-1 items-center justify-center min-h-screen p-4 md:p-8">
        <div className="border border-gray-200 bg-neutral-100 rounded-xl shadow-md w-2/3 overflow-hidden">
          <header className="px-4 py-2 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-800">Create a new Framework</h2>
          </header>
          
          {/* <div
            contentEditable
            className="flex-1 px-6 pt-6 text-xl md:text-lg bg-white resize-none outline-none focus:outline-none transition-all duration-300"
            style={{ fontFamily: 'Inter, sans-serif', minHeight: '28px', fontSize: '28px', fontWeight: 'bold'}}
          /> */}

          <input
            type="text"
            value={frameworkName}
            onChange={(e) => setFrameworkName(e.target.value)}
            placeholder="Name your framework"
            className="flex-1 px-6 pt-6 w-full min-h-[28px] text-2xl font-bold md:text-2xl bg-white resize-none outline-none focus:outline-none "
          />


          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            className="flex-1 p-6 text-sm md:text-lg bg-white resize-none overflow-auto outline-none focus:outline-none transition-all duration-300"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px ', minHeight: '300px', maxHeight: '300px' }}
          />
          {selectedWord && !showSidebar && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-3 bg-indigo-600 text-white rounded-lg shadow-xl text-sm md:text-base">
              <p>Selected phrase: <strong>{selectedWord}</strong>. To create a variable, click on it and use the sidebar.</p>
            </div>
          )}

          <footer className="p-4 border-t border-gray-200 bg-neutral-100 flex justify-end space-x-4">
            <button
              onClick={handleSave}
              disabled={Object.keys(variables).length === 0 || !frameworkName.trim() || !text.trim() || isSaving}
              className="px-6 py-2 rounded-lg font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSaving ? "Saving..." : "Save Framework"}
            </button>
            <button className="px-6 py-2 rounded-lg font-semibold text-sm transition-colors bg-blue-500 text-white hover:bg-blue-600">
              Publish
            </button>
          </footer>
        </div>
      </div>

      <FrameworkSidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        selectedWord={selectedWord}
        variableName={variableName}
        setVariableName={setVariableName}
        defaultValue={defaultValue}
        setDefaultValue={setDefaultValue}
        hint={hint}
        setHint={setHint}
        editingVariable={editingVariable}
        setEditingVariable={setEditingVariable}
        onCreateVariable={createVariable}
        onEditVariable={handleEditVariable}
        onDeleteVariable={handleDeleteVariable}
        suggestedVariables={suggestedVariables}
        isGeneratingVariables={isGeneratingVariables}
        onGenerateVariables={handleGenerateVariables}
        onAddSuggestedVariable={addSuggestedVariable}
        text={text}
        frameworkName={frameworkName}
        setFrameworkName={setFrameworkName}
        onSave={handleSave}
        isSaving={isSaving}
        variablesCount={Object.keys(variables).length}
      />
    </div>
  );
}
