import React from 'react';

interface CollapsibleContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({ 
  children, 
  isOpen = false 
}) => (
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
    {isOpen && <div className="mt-1">{children}</div>}
  </div>
);

export default CollapsibleContent;
