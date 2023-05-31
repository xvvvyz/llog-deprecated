import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => (
  <div
    className={twMerge(
      'my-16 flex h-8 items-center justify-between px-4',
      className
    )}
  >
    {children}
  </div>
);

export default Header;
