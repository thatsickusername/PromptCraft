import React from 'react';
import Button from '../ui/Button'; 
interface SidebarLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  icon, 
  text, 
  isActive = false, 
  ...props 
}) => {
  const activeClasses = isActive ? "bg-neutral-200/80 text-neutral-800 font-bold" : "text-neutral-600 font-normal";
  
  return (
    <Button 
      variant="ghost" 
      className={`w-full gap-2 p-2 h-auto text-sm justify-start cursor-pointer ${activeClasses}`}
      {...props}
    >
      <span className="text-base">{icon}</span>
      <span className="truncate flex-1 text-left">{text}</span>
    </Button>
  );
};

export default SidebarLink;
