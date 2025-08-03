import { useState, useEffect } from "react";
import TabNavigation from "./components/ui/TabNavigation";
import CustomAlert from "./components/ui/CustomAlert";
import FrameworkEditor from "./components/framework/FrameworkEditor";
import PromptGenerator from "./components/prompts/PromptGenerator";
import type { Framework } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("framework");
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Effect to show and hide the custom alert message
  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Function to add a new framework to the state
  const addFramework = (newFramework: Framework) => {
    if (newFramework.name && newFramework.text) {
      setFrameworks((prev) => [...prev, newFramework]);
      setAlertMessage(`Framework "${newFramework.name}" saved successfully!`);
    } else {
      setAlertMessage("Framework could not be saved. Please provide a name and text.");
    }
    setActiveTab("prompts"); // Switch to the prompts tab after saving
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 font-sans text-gray-800">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "framework" ? (
          <FrameworkEditor onSave={addFramework} setAlertMessage={setAlertMessage} />
        ) : (
          <PromptGenerator frameworks={frameworks} setAlertMessage={setAlertMessage} />
        )}
      </div>

      <CustomAlert showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  );
}
