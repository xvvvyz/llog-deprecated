'use client';

import { Menu as M } from '@headlessui/react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Button, { ButtonProps } from './button';

const Menu = Object.assign(
  ({ className, ...rest }: Parameters<typeof M>[0]) => (
    <M as="div" className={twMerge('relative', className)} {...rest} />
  ),
  {
    Button: ({ className, ...rest }: Parameters<typeof M.Button>[0]) => (
      <M.Button
        className={twMerge(
          'flex items-center justify-center text-fg-2 outline-none transition-colors hover:text-fg-1',
          className
        )}
        {...rest}
      />
    ),
    Item: ({ className, ...rest }: ButtonProps) => (
      <M.Item>
        {({ active }) => (
          <Button
            className={twMerge(
              'w-full justify-start gap-4 rounded-none border-t-0 ring-transparent ring-offset-0 first:rounded-t first:border-t last:rounded-b hover:border-alpha-1',
              active && 'bg-alpha-4 text-fg-1',
              className
            )}
            colorScheme="transparent"
            {...rest}
          />
        )}
      </M.Item>
    ),
    Items: ({
      className,
      children,
      ...rest
    }: Parameters<typeof M.Items>[0] & { children: ReactNode }) => (
      <M.Items
        className={twMerge(
          'absolute -right-px -top-px z-10 w-56 origin-top-right rounded bg-bg-2 shadow-md outline-none',
          className
        )}
        {...rest}
      >
        {children}
      </M.Items>
    ),
  }
);

export default Menu;
