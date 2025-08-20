import React, { useState } from 'react';

interface CollapsibleProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface CollapsibleChildProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Collapsible: React.FC<CollapsibleProps> = ({ children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div data-state={isOpen ? 'open' : 'closed'}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<CollapsibleChildProps>(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export default Collapsible;
