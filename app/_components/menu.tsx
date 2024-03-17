'use client';

import Button, { ButtonProps } from '@/_components/button';
import { Menu as MenuPrimitive } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const Menu = Object.assign(
  ({ className, ...rest }: Parameters<typeof MenuPrimitive>[0]) => (
    <MenuPrimitive
      as="div"
      className={twMerge('relative', className)}
      {...rest}
    />
  ),
  {
    Button: ({
      className,
      ...rest
    }: Parameters<typeof MenuPrimitive.Button>[0]) => (
      <MenuPrimitive.Button
        className={twMerge(
          'flex items-center justify-center text-fg-3 outline-none transition-colors hover:text-fg-2',
          className,
        )}
        {...rest}
      />
    ),
    Item: ({ className, ...rest }: ButtonProps) => (
      <MenuPrimitive.Item>
        {({ active }) => (
          <Button
            className={twMerge(
              'h-10 w-full justify-start gap-4 rounded-none border-0 bg-transparent ring-transparent ring-offset-0 hover:bg-alpha-1',
              active && 'bg-alpha-1 text-fg-2',
              className,
            )}
            colorScheme="transparent"
            {...rest}
          />
        )}
      </MenuPrimitive.Item>
    ),
    Items: ({
      className,
      ...rest
    }: Parameters<typeof MenuPrimitive.Items>[0]) => (
      <MenuPrimitive.Items
        className={twMerge(
          'absolute -right-px -top-px z-10 w-60 rounded border border-alpha-1 bg-bg-3 py-1 shadow-lg outline-none',
          className,
        )}
        {...rest}
      />
    ),
  },
);

export default Menu;
