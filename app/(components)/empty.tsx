import Box from '(components)/box';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyProps {
  children?: ReactNode;
  className?: string;
}

const Empty = ({ children, className }: EmptyProps) => (
  <Box
    as="p"
    className={twMerge(
      'mt-12 flex flex-wrap items-center justify-center gap-4 text-fg-2',
      className
    )}
  >
    {children}
  </Box>
);

export default Empty;
