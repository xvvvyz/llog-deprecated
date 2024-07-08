'use client';

import Button from '@/_components/button';
import Popover from '@/_components/popover';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { PopoverContentProps } from '@radix-ui/react-popover';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TipProps extends PopoverContentProps {
  children: ReactNode;
  className?: string;
  tipClassName?: string;
}

const Tip = ({ children, className, tipClassName, ...rest }: TipProps) => (
  <Popover>
    <Popover.Trigger asChild>
      <Button className={className} variant="link">
        <InformationCircleIcon className="w-5" />
      </Button>
    </Popover.Trigger>
    <Popover.Content
      className={twMerge(
        'z-30 max-w-[20rem] rounded border border-alpha-2 bg-bg-3 px-6 py-4 text-center drop-shadow',
        tipClassName,
      )}
      sideOffset={0}
      {...rest}
    >
      {children}
    </Popover.Content>
  </Popover>
);

export default Tip;
