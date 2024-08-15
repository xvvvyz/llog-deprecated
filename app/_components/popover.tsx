'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Close = PopoverPrimitive.Close;

const Content = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      className={twMerge(
        'rounded border border-alpha-2 bg-bg-3 drop-shadow',
        className,
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      sideOffset={8}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

Content.displayName = PopoverPrimitive.Content.displayName;

const Root = PopoverPrimitive.Root;

const Trigger = PopoverPrimitive.Trigger;

export { Close, Content, Root, Trigger };
