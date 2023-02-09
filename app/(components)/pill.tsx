import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

interface PillProps extends BoxProps {
  k?: string;
  v?: ReactNode;
}

const Pill = ({ className, k, v, ...rest }: PillProps) => (
  <Box
    as="span"
    className={twMerge(
      'smallcaps inline-flex shrink-0 gap-1 rounded border border-alpha-1 bg-alpha-1 px-2 py-0.5',
      className
    )}
    {...rest}
  >
    {k && <span className="text-fg-3">{k}</span>}
    {v && <span className="text-fg-2">{v}</span>}
  </Box>
);

export default Pill;
