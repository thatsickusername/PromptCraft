import { Outlet } from "react-router-dom";
import SideNavbar from "../components/sidenav/SideNavbar";
import CustomAlert from "../components/ui/CustomAlert";

interface MainLayoutProps {
  alertMessage: string;
  showAlert: boolean;
}

export default function MainLayout({ alertMessage, showAlert }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 relative">
      <SideNavbar />
     
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Outlet /> {/* This is where your routed components will render */}
      </div>

      <CustomAlert showAlert={showAlert} alertMessage={alertMessage} />
    </div>
  );
}
