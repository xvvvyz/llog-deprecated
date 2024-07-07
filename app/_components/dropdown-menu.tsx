'use client';

import ButtonPrimitive from '@/_components/button';
import * as Primitive from '@radix-ui/react-dropdown-menu';
import { useToggle } from '@uidotdev/usehooks';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef<
  React.ElementRef<typeof Primitive.Item>,
  React.ComponentPropsWithoutRef<typeof ButtonPrimitive>
>((props, ref) => (
  <Item asChild ref={ref}>
    <ButtonPrimitive colorScheme="transparent" {...props} />
  </Item>
));

Button.displayName = ButtonPrimitive.displayName;

const Content = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, ...props }, ref) => (
  <Primitive.Content
    align="end"
    ref={ref}
    sideOffset={4}
    className={twMerge(
      'z-10 w-60 rounded border border-alpha-1 bg-bg-3 py-1 drop-shadow-xl',
      className,
    )}
    {...props}
  />
));

Content.displayName = Primitive.Content.displayName;

const Item = React.forwardRef<
  React.ElementRef<typeof Primitive.Item>,
  React.ComponentPropsWithoutRef<typeof Primitive.Item>
>(({ className, ...props }, ref) => (
  <Primitive.Item
    ref={ref}
    className={twMerge(
      'h-10 w-full justify-start gap-4 rounded-none border-0 bg-transparent ring-transparent ring-offset-0 focus:bg-alpha-1 focus:text-fg-2',
      className,
    )}
    {...props}
  />
));

Item.displayName = Primitive.Item.displayName;

const Label = React.forwardRef<
  React.ElementRef<typeof Primitive.Label>,
  React.ComponentPropsWithoutRef<typeof Primitive.Label>
>(({ className, ...props }, ref) => (
  <Primitive.Label
    ref={ref}
    className={twMerge('smallcaps px-2 py-1.5', className)}
    {...props}
  />
));

Label.displayName = Primitive.Label.displayName;

const Root = React.forwardRef<
  React.ElementRef<typeof Primitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & {
    trigger: React.ReactNode;
  }
>(({ children, trigger, ...props }, ref) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <Primitive.Root
      modal={false}
      onOpenChange={toggleOpen}
      open={open}
      {...props}
    >
      <Primitive.Trigger
        asChild
        className="cursor-pointer outline-none"
        onClick={() => toggleOpen()}
        onPointerDown={(e) => e.preventDefault()}
        ref={ref}
      >
        {trigger}
      </Primitive.Trigger>
      {children}
    </Primitive.Root>
  );
});

Root.displayName = Primitive.Root.displayName;

const Separator = React.forwardRef<
  React.ElementRef<typeof Primitive.Separator>,
  React.ComponentPropsWithoutRef<typeof Primitive.Separator>
>(({ className, ...props }, ref) => (
  <Primitive.Separator
    ref={ref}
    className={twMerge('my-1 h-px bg-alpha-1', className)}
    {...props}
  />
));

Separator.displayName = Primitive.Separator.displayName;

export default Object.assign(Root, {
  Button,
  Content,
  Group: Primitive.Group,
  Item,
  Label,
  Portal: Primitive.Portal,
  Separator,
});
