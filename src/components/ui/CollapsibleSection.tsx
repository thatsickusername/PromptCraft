import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react'; 
import Collapsible from './Collapsible';
import CollapsibleTrigger from './CollapsibleTrigger';
import CollapsibleContent from './CollapsibleContent';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isDefaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  isDefaultOpen = false 
}) => (
  <Collapsible defaultOpen={isDefaultOpen}>
    <CollapsibleTrigger className="flex items-center gap-1 p-2 w-full rounded-md hover:bg-neutral-200/60 cursor-pointer transition-colors text-neutral-500 text-xs font-semibold">
      {({ isOpen }: { isOpen: boolean }) => (
        <>
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span>{title}</span>
        </>
      )}
    </CollapsibleTrigger>
    <CollapsibleContent>
      {children}
    </CollapsibleContent>
  </Collapsible>
);

export default CollapsibleSection;
