import type { Framework } from "../../types";

interface FrameworksListProps {
  frameworks: Framework[];
  selectedFramework: Framework | null;
  setSelectedFramework: (framework: Framework) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function FrameworksList({
  frameworks,
  selectedFramework,
  setSelectedFramework,
  searchTerm,
  setSearchTerm
}: FrameworksListProps) {
  // Filter frameworks by search term
  const filteredFrameworks = frameworks.filter(fw =>
    fw.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-shrink-0 w-full md:w-80 p-6 bg-white border-r border-gray-200 shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Saved Frameworks</h2>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title..."
          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Frameworks List */}
      {filteredFrameworks.length > 0 ? (
        <ul className="space-y-2">
          {filteredFrameworks.map((fw, index) => (
            <li key={index}>
              <button
                onClick={() => setSelectedFramework(fw)}
                className={`block w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                  selectedFramework === fw ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span className="block font-medium">{fw.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">
          {searchTerm ? `No frameworks found for "${searchTerm}"` : 'No frameworks saved yet. Go to the "Framework" tab to create one.'}
        </p>
      )}
    </div>
  );
}
