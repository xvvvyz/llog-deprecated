'use client';

import { Menu as M } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const Menu = ({ className, ...rest }: Parameters<typeof M>[0]) => (
  <M as="div" className={twMerge('relative', className)} {...rest} />
);

export default Menu;
