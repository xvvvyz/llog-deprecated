import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

const Pill = ({ className, ...props }: BoxProps) => (
  <Box
    as="span"
    className={twMerge(
      'rounded border border-alpha-1 bg-alpha-1 px-2 py-0.5 text-xs uppercase tracking-widest text-fg-3',
      className
    )}
    {...props}
  />
);

export default Pill;
