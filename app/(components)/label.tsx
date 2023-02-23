import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelProps {
  children: ReactNode;
  className?: string;
}

const Label = ({ children, className }: LabelProps) => (
  <label className={twMerge('flex flex-col gap-2', className)}>
    {children}
  </label>
);

const LabelSpan = ({ children, className }: LabelProps) => (
  <span className={twMerge('block max-w-xs px-2 text-fg-2', className)}>
    {children}
  </span>
);

export { LabelSpan };
export default Label;
