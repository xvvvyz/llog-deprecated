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
    <Popover.Trigger className={twMerge('-m-3 p-3', className)}>
      <InformationCircleIcon className="w-5 text-fg-3" />
    </Popover.Trigger>
    <Popover.Content
      className={twMerge(
        'z-30 max-w-[20rem] rounded border border-alpha-1 bg-bg-3 px-6 py-4 text-fg-1 shadow-lg',
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
