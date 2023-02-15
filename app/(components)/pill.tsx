import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

interface PillProps extends BoxProps {
  values?: ReactNode[];
}

const Pill = ({ children, className, ...rest }: PillProps) => (
  <Box
    as="span"
    className={twMerge(
      'min-w-[2rem] rounded-sm bg-alpha-1 px-2 text-center text-fg-3',
      className
    )}
    {...rest}
  >
    {children}
  </Box>
);

export default Pill;
