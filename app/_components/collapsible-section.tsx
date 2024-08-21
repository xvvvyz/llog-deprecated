'use client';

import Button from '@/_components/button';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon';
import * as Primitive from '@radix-ui/react-collapsible';
import { CollapsibleProps } from '@radix-ui/react-collapsible';
import { ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapsibleSectionProps extends Omit<CollapsibleProps, 'title'> {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  titleClassName?: string;
}

const CollapsibleSection = ({
  children,
  className,
  title,
  titleClassName,
  ...rest
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = <div className={className}>{children}</div>;
  if (!title) return content;

  return (
    <Primitive.Collapsible onOpenChange={setIsOpen} {...rest}>
      <Primitive.CollapsibleTrigger asChild>
        <Button
          colorScheme="transparent"
          className={twMerge(
            'm-0 w-full justify-between gap-6 px-4',
            titleClassName,
          )}
          variant="link"
        >
          {title}
          {isOpen ? (
            <ChevronUpIcon className="w-5 shrink-0" />
          ) : (
            <ChevronDownIcon className="w-5 shrink-0" />
          )}
        </Button>
      </Primitive.CollapsibleTrigger>
      <Primitive.CollapsibleContent>{content}</Primitive.CollapsibleContent>
    </Primitive.Collapsible>
  );
};

export default CollapsibleSection;
