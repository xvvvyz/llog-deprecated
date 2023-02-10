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
              'm-0 h-full w-full gap-4 px-4 py-2',
              active && 'text-fg-1',
              className
            )}
            variant="link"
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
          'absolute -right-2 -bottom-8 z-10 w-56 origin-top-right rounded bg-bg-1 shadow-md outline-none sm:bg-bg-2',
          className
        )}
        {...rest}
      >
        <div className="divide-y divide-alpha-1 rounded border border-alpha-2 bg-alpha-2">
          {children}
        </div>
      </M.Items>
    ),
  }
);

export default Menu;
