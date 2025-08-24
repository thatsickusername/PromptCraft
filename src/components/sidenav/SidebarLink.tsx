import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button'; 

interface SidebarLinkProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  icon, 
  text, 
  to 
}) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `w-full h-auto text-sm justify-start cursor-pointer flex items-center 
        ${isActive ? "bg-neutral-200/80 text-neutral-800 font-bold" : "text-neutral-600 font-normal"}`
      }
    >
      <Button 
        variant="ghost" 
        className="w-full gap-2 p-2 h-auto text-sm justify-start cursor-pointer"
      >
        <span className="text-base">{icon}</span>
        <span className="truncate flex-1 text-left">{text}</span>
      </Button>
    </NavLink>
  );
};

export default SidebarLink;
