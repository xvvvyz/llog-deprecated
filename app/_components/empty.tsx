import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyProps {
  children?: ReactNode;
  className?: string;
}

const Empty = ({ children, className }: EmptyProps) => (
  <div
    className={twMerge(
      'flex flex-col items-center gap-6 border-y border-alpha-1 bg-bg-2 p-8 text-center text-fg-4 sm:rounded sm:border-x',
      className,
    )}
  >
    {children}
  </div>
);

export default Empty;
