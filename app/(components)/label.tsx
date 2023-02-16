import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

const Label = ({ className, ...rest }: BoxProps) => (
  <Box
    as="label"
    className={twMerge('flex flex-col gap-2', className)}
    {...rest}
  />
);

const LabelSpan = ({ className, ...rest }: BoxProps) => (
  <span
    className={twMerge('block max-w-xs px-2 text-fg-2', className)}
    {...rest}
  />
);

export { LabelSpan };
export default Label;
