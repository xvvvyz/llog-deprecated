'use client';

import IconButton from '@/_components/icon-button';
import * as Popover from '@/_components/popover';
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon';
import { PopoverContentProps } from '@radix-ui/react-popover';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TipProps extends PopoverContentProps {
  children: ReactNode;
  className?: string;
  tipClassName?: string;
}

const Tip = ({ children, className, tipClassName, ...rest }: TipProps) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <IconButton
        className={className}
        icon={<QuestionMarkCircleIcon className="w-5" />}
        label="Help"
      />
    </Popover.Trigger>
    <Popover.Content
      className={twMerge(
        'z-30 m-0 max-w-[20rem] rounded border border-alpha-2 bg-bg-3 px-6 py-4 text-center drop-shadow',
        tipClassName,
      )}
      {...rest}
    >
      {children}
    </Popover.Content>
  </Popover.Root>
);

export default Tip;
