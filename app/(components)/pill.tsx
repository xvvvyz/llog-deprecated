import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Box, { BoxProps } from './box';

interface PillProps extends BoxProps {
  values?: ReactNode[];
}

const Pill = ({ className, values, ...rest }: PillProps) => (
  <Box
    as="span"
    className={twMerge(
      'smallcaps -mx-[1px] inline-flex gap-1 truncate bg-alpha-1',
      className
    )}
    {...rest}
  >
    {values?.map((value, i) => (
      <span className="odd:text-fg-3" key={i}>
        {value}
      </span>
    ))}
  </Box>
);

export default Pill;
