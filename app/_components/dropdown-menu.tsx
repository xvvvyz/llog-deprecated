'use client';

import ButtonPrimitive from '@/_components/button';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ButtonPrimitive>
>((props, ref) => (
  <Item asChild ref={ref}>
    <ButtonPrimitive colorScheme="transparent" {...props} />
  </Item>
));

Button.displayName = ButtonPrimitive.displayName;

const Content = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Content
    align="end"
    ref={ref}
    sideOffset={4}
    className={twMerge(
      'z-10 w-60 overflow-hidden rounded border border-alpha-2 bg-bg-3 py-1 drop-shadow',
      className,
    )}
    {...props}
  />
));

Content.displayName = DropdownMenuPrimitive.Content.displayName;

const Item = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={twMerge(
      'h-10 w-full justify-start gap-4 rounded-none border-0 bg-transparent ring-transparent ring-offset-0 focus:bg-alpha-1 focus:text-fg-2',
      className,
    )}
    onSelect={(e) => e.preventDefault()}
    {...props}
  />
));

Item.displayName = DropdownMenuPrimitive.Item.displayName;

const Label = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={twMerge('smallcaps px-2 py-1.5', className)}
    {...props}
  />
));

Label.displayName = DropdownMenuPrimitive.Label.displayName;

const Portal = DropdownMenuPrimitive.Portal;

const Root = (props: DropdownMenuProps) => (
  <DropdownMenuPrimitive.Root modal={false} {...props} />
);

const Separator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={twMerge('my-1 h-px bg-alpha-1', className)}
    {...props}
  />
));

Separator.displayName = DropdownMenuPrimitive.Separator.displayName;

const Trigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    asChild
    className={twMerge('cursor-pointer outline-none', className)}
    ref={ref}
    {...props}
  />
));

Trigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

export { Button, Content, Item, Label, Portal, Root, Separator, Trigger };
