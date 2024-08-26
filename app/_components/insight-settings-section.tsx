'use client';

import Button from '@/_components/button';
import * as Collapsible from '@/_components/collapsible';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import { ReactNode, useState } from 'react';

interface InsightSettingsSectionProps {
  children: ReactNode;
  className?: string;
  title: string;
}

const InsightSettingsSection = ({
  children,
  className,
  title,
}: InsightSettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible.Root onOpenChange={setIsOpen}>
      <Collapsible.Trigger asChild>
        <Button
          colorScheme="transparent"
          className="smallcaps m-0 -mt-3 w-full justify-between gap-6 border-b border-alpha-1 px-4"
          variant="link"
        >
          {title}
          {isOpen ? (
            <ChevronUpIcon className="w-5 shrink-0" />
          ) : (
            <ChevronDownIcon className="w-5 shrink-0" />
          )}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className={className}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default InsightSettingsSection;
