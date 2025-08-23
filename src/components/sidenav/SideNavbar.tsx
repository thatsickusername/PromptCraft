import { useState } from "react";
import Button from "../ui/Button";
import CollapsibleSection from "../ui/CollapsibleSection";
import SidebarLink from "./SidebarLink";
import { Search, User, Settings, MessageCirclePlus, LayoutPanelTop, Bell, Globe, Lock, PanelLeftClose, PanelLeftOpen} from 'lucide-react';

interface SideNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// --- Mock Data ---
const topLevelNavItems = [
  { id: 'prompts', text: 'Prompts', icon: <MessageCirclePlus className="h-4 w-4" /> },
  { id: 'frameworks', text: 'Frameworks', icon: <LayoutPanelTop className="h-4 w-4" /> },
  { id: 'search', text: 'Search', icon: <Search className="h-4 w-4" /> },
  { id: 'notifications', text: 'Notifications', icon: <Bell className="h-4 w-4" /> },
]

const collectionsItems = [
  { id: 'fav1', text: 'Engineering Wiki', icon: '📄' },
  { id: 'fav2', text: 'Product Roadmap', icon: '🚀' },
  { id: 'fav3', text: 'Meeting Notes', icon: '📝' },
]

const PersonalLinks = [
  {id: 'published', text: 'Published', icon: <Globe className="h-4 w-4"/>},
  {id: 'private', text: 'Private', icon: <Lock className="h-4 w-4"/>}
]

export default function SideNavbar({ activeTab, setActiveTab }: SideNavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
      <aside className={`w-64 h-full bg-neutral-100 flex flex-col border-r shadow-md ${isSidebarOpen ? "static p-2" : "absolute w-56 h-[40px] m-2 p-0 rounded-xl"}`}>
        {/* Workspace Switcher */}
        <Button variant="ghost" className={`w-full justify-between h-auto ${isSidebarOpen ? "p-2" : "p-0"}`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center font-bold text-sm text-white">P</div>
            <span className="text-sm font-semibold text-neutral-800">Prompt Craft</span>
          </div>
          <div className="cursor-pointer" onClick={() => setIsSidebarOpen(prev => !prev)}>
            {isSidebarOpen ? <PanelLeftClose className=" text-neutral-600 h-4 w-4"/> : <PanelLeftOpen className=" text-neutral-600 h-4 w-4"/>}
          </div>
        </Button>

        <nav className={`flex-1 mt-4 ${isSidebarOpen ? "block" : "hidden"}`}>
          {/* Top-level navigation items */}
          {topLevelNavItems.map(item => (
              <SidebarLink 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
              />
          ))}

          <div className="h-3"></div>

          {/* Collections Section */}
          <CollapsibleSection title="Collections" isDefaultOpen={true}>
            {collectionsItems.map(item => (
              <SidebarLink 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
              />
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Personal" isDefaultOpen={true}>
            {PersonalLinks.map(item => (
              <SidebarLink 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
              />
            ))}
          </CollapsibleSection>

        </nav>

        {/* Footer actions */}
        <div className={`mt-auto space-y-1 ${isSidebarOpen ? "block" : "hidden"}`}>
            <SidebarLink icon={<User className="h-4 w-4" />} text="Username" />
            <SidebarLink icon={<Settings className="h-4 w-4" />} text="Settings" />
        </div>
      </aside>
  );
}
