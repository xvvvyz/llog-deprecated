import Box, { BoxProps } from '(components)/box';
import { twMerge } from 'tailwind-merge';

const Header = ({ className, ...rest }: BoxProps) => (
  <Box
    as="header"
    className={twMerge(
      'my-16 flex h-8 items-center justify-between',
      className
    )}
    {...rest}
  />
);

export default Header;
