import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

const Pill = ({ className, ...props }: BoxProps) => (
  <Box
    as="span"
    className={twMerge(
      'rounded border border-alpha-2 bg-alpha-1 px-2',
      className
    )}
    {...props}
  />
);

export default Pill;
