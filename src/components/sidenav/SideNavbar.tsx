import { useState } from "react";
import Button from "../ui/Button";
import CollapsibleSection from "../ui/CollapsibleSection";
import SidebarLink from "./SidebarLink";
import { Search, User, Settings, Home, MessageCirclePlus, LayoutPanelTop, Bell, Globe, Lock, PanelLeftClose, PanelLeftOpen} from 'lucide-react';

interface SideNavbarProps {
  // activeTab and setActiveTab are no longer needed due to react-router-dom NavLink
}

// --- Mock Data ---
const topLevelNavItems = [
  { id: 'home', text: 'Home', icon: <Home className="h-4 w-4" />, to: '/' },
  { id: 'prompts', text: 'Prompts', icon: <MessageCirclePlus className="h-4 w-4" />, to: '/prompts' },
  { id: 'frameworks', text: 'Frameworks', icon: <LayoutPanelTop className="h-4 w-4" />, to: '/frameworks' },
  { id: 'search', text: 'Search', icon: <Search className="h-4 w-4" />, to: '/search' },
  { id: 'notifications', text: 'Notifications', icon: <Bell className="h-4 w-4" />, to: '/notifications' },
]

const collectionsItems = [
  { id: 'fav1', text: 'Engineering Wiki', icon: '📄', to: '/collections/fav1' },
  { id: 'fav2', text: 'Product Roadmap', icon: '🚀', to: '/collections/fav2' },
  { id: 'fav3', text: 'Meeting Notes', icon: '📝', to: '/collections/fav3' },
]

const PersonalLinks = [
  {id: 'published', text: 'Published', icon: <Globe className="h-4 w-4"/>, to: '/personal/published'},
  {id: 'private', text: 'Private', icon: <Lock className="h-4 w-4"/>, to: '/personal/private'}
]

export default function SideNavbar({}: SideNavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
      <aside className={` bg-neutral-100 flex flex-col border-r shadow-md transition-all duration-300 overflow-hidden ${isSidebarOpen ? "static p-2 w-56 h-full" : "absolute w-20 h-[40px] m-2 p-0 rounded-xl"}`}>
        {/* Workspace Switcher */}
        <Button variant="ghost" className={`w-full justify-between h-auto ${isSidebarOpen ? "p-2" : "p-0"}`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center font-bold text-sm text-white">P</div>
            <span className={`text-sm font-semibold text-neutral-800  ${isSidebarOpen ? "block" : "hidden"}`}>Prompt Craft</span>
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
                  to={item.to}
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
                  to={item.to}
              />
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Personal" isDefaultOpen={true}>
            {PersonalLinks.map(item => (
              <SidebarLink 
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  to={item.to}
              />
            ))}
          </CollapsibleSection>

        </nav>

        {/* Footer actions */}
        <div className={`mt-auto space-y-1 ${isSidebarOpen ? "block" : "hidden"}`}>
            <SidebarLink icon={<User className="h-4 w-4" />} text="Username" to="/profile" />
            <SidebarLink icon={<Settings className="h-4 w-4" />} text="Settings" to="/settings" />
        </div>
      </aside>
  );
}
