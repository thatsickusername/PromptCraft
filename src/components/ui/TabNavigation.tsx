
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="flex max-w-7xl mx-auto px-4 md:px-8">
        <button
          className={`py-3 px-6 text-lg font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "framework"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("framework")}
        >
          Framework
        </button>
        <button
          className={`py-3 px-6 text-lg font-medium border-b-2 transition-colors duration-200 ${
            activeTab === "prompts"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("prompts")}
        >
          Prompts
        </button>
      </div>
    </div>
  );
}
