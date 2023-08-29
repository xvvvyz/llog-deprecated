import { Menu as M } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const MenuButton = ({ className, ...rest }: Parameters<typeof M.Button>[0]) => (
  <M.Button
    className={twMerge(
      'flex items-center justify-center text-fg-3 outline-none transition-colors hover:text-fg-2',
      className,
    )}
    {...rest}
  />
);

export default MenuButton;
