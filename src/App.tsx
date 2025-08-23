import { useState, useEffect } from "react";
import CustomAlert from "./components/ui/CustomAlert";
import FrameworkEditor from "./components/framework/FrameworkEditor";
import PromptGenerator from "./components/prompts/PromptGenerator";
import type { Framework } from "./types";
import SideNavbar from "./components/sidenav/SideNavbar";

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

  const renderContent = () => {
    switch (activeTab) {
      case "prompts":
        return <PromptGenerator frameworks={frameworks} setAlertMessage={setAlertMessage} />
      case "frameworks":
        return <FrameworkEditor onSave={addFramework} setAlertMessage={setAlertMessage} />
      case "search":
        return <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800">Search</h1>
          <p className="text-neutral-600 mt-2">This is the search page. You can search for content across your workspace here.</p>
        </div>;
      case "notifications":
        return <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800">Notifications</h1>
          <p className="text-neutral-600 mt-2">This is the notifications page. Stay up to date with your workspace.</p>
        </div>;
      default:
        return <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800">Main Content Area</h1>
          <p className="text-neutral-600 mt-2">This is where your page content would go. The sidebar is fixed on the left.</p>
        </div>;
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 relative">
      <SideNavbar activeTab={activeTab} setActiveTab={setActiveTab}/>
     
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {renderContent()}
      </div>

      <CustomAlert showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  );
}
