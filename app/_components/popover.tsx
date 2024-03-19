'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      className={twMerge(
        'rounded border border-alpha-1 bg-bg-3 shadow-lg',
        className,
      )}
      sideOffset={8}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const Popover = Object.assign(PopoverPrimitive.Root, {
  Close: PopoverPrimitive.Close,
  Content: PopoverContent,
  Trigger: PopoverPrimitive.Trigger,
});

export default Popover;
