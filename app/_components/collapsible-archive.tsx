'use client';

import Button from '@/_components/button';
import * as Collapsible from '@/_components/collapsible';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import { ReactNode, useState } from 'react';

interface CollapsibleArchiveProps {
  children: ReactNode;
}

const CollapsibleArchive = ({ children }: CollapsibleArchiveProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible.Root className="space-y-4" onOpenChange={setIsOpen}>
      <Collapsible.Content className="space-y-4">
        {children}
      </Collapsible.Content>
      <div className="mx-4 flex justify-end">
        <Collapsible.Trigger asChild>
          <Button className="mr-[0.35rem]" variant="link">
            {isOpen ? 'Hide' : 'Show'} archived
            {isOpen ? (
              <ChevronUpIcon className="w-5" />
            ) : (
              <ChevronDownIcon className="w-5" />
            )}
          </Button>
        </Collapsible.Trigger>
      </div>
    </Collapsible.Root>
  );
};

export default CollapsibleArchive;
