import { Menu as M } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const MenuItems = ({ className, ...rest }: Parameters<typeof M.Items>[0]) => (
  <M.Items
    className={twMerge(
      'absolute -right-px -top-px z-10 w-60 rounded border border-alpha-1 bg-bg-3 py-1 shadow-lg outline-none',
      className,
    )}
    {...rest}
  />
);

export default MenuItems;
