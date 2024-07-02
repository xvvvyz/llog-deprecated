'use client';

import Button from '@/_components/button';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import * as Primitive from '@radix-ui/react-collapsible';
import { ReactNode, useState } from 'react';

interface CollapsibleArchiveProps {
  children: ReactNode;
}

const CollapsibleArchive = ({ children }: CollapsibleArchiveProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Primitive.Collapsible className="space-y-4" onOpenChange={setIsOpen}>
      <Primitive.CollapsibleContent className="space-y-4">
        {children}
      </Primitive.CollapsibleContent>
      <div className="mx-4 flex justify-end">
        <Primitive.CollapsibleTrigger asChild>
          <Button className="mr-[0.35rem]" variant="link">
            {isOpen ? 'Hide' : 'Show'} archived
            {isOpen ? (
              <ChevronUpIcon className="w-5" />
            ) : (
              <ChevronDownIcon className="w-5" />
            )}
          </Button>
        </Primitive.CollapsibleTrigger>
      </div>
    </Primitive.Collapsible>
  );
};

export default CollapsibleArchive;
