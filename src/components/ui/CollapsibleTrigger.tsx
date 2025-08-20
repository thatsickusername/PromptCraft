import React from 'react';

interface CollapsibleTriggerProps {
  children: React.ReactNode | (({ isOpen }: { isOpen: boolean }) => React.ReactNode);
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ 
  children, 
  isOpen = false, 
  setIsOpen, 
  className 
}) => (
  <div onClick={() => setIsOpen?.(!isOpen)} className={className}>
    {typeof children === 'function' ? children({ isOpen }) : children}
  </div>
);

export default CollapsibleTrigger;
