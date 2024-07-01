'use client';
import Button from '@/_components/button';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ReactNode, useState } from 'react';

interface CollapsibleArchiveProps {
  children: ReactNode;
}

const CollapsibleArchive = ({ children }: CollapsibleArchiveProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible.Collapsible className="space-y-4" onOpenChange={setIsOpen}>
      <Collapsible.CollapsibleContent className="space-y-4">
        {children}
      </Collapsible.CollapsibleContent>
      <div className="mx-4 flex justify-end">
        <Collapsible.CollapsibleTrigger asChild>
          <Button className="mr-[0.35rem]" variant="link">
            {isOpen ? 'Hide' : 'Show'} archived
            {isOpen ? (
              <ChevronUpIcon className="w-5" />
            ) : (
              <ChevronDownIcon className="w-5" />
            )}
          </Button>
        </Collapsible.CollapsibleTrigger>
      </div>
    </Collapsible.Collapsible>
  );
};
export default CollapsibleArchive;
