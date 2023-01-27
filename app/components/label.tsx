import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

const Label = ({ className, ...rest }: BoxProps) => (
  <Box
    as="label"
    className={twMerge('flex flex-col gap-2 text-fg-2', className)}
    {...rest}
  />
);

export default Label;
