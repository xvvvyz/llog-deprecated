import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyProps {
  children?: ReactNode;
  className?: string;
}

const Empty = ({ children, className }: EmptyProps) => (
  <p
    className={twMerge(
      'mx-auto mt-16 max-w-xs px-4 text-center text-fg-4',
      className,
    )}
  >
    {children}
  </p>
);

export default Empty;
