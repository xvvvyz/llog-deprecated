import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PillProps {
  children?: ReactNode;
  className?: string;
  values?: ReactNode[];
}

const Pill = ({ children, className }: PillProps) => (
  <span
    className={twMerge(
      'min-w-[2rem] rounded-sm bg-alpha-1 px-2 text-center leading-snug text-fg-3',
      className
    )}
  >
    {children}
  </span>
);

export default Pill;
