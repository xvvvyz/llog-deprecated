import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyProps {
  children?: ReactNode;
  className?: string;
}

const Empty = ({ children, className }: EmptyProps) => (
  <p
    className={twMerge(
      'mt-16 flex flex-wrap items-center justify-center gap-4 text-fg-3',
      className
    )}
  >
    {children}
  </p>
);

export default Empty;
