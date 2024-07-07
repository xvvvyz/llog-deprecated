'use client';

import * as Primitive from '@radix-ui/react-popover';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const PopoverContent = forwardRef<
  ElementRef<typeof Primitive.Content>,
  ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, align = 'center', ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content
      ref={ref}
      align={align}
      className={twMerge(
        'rounded border border-alpha-1 bg-bg-3 drop-shadow',
        className,
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      sideOffset={8}
      {...props}
    />
  </Primitive.Portal>
));

PopoverContent.displayName = Primitive.Content.displayName;

const Popover = Object.assign(Primitive.Root, {
  Close: Primitive.Close,
  Content: PopoverContent,
  Trigger: Primitive.Trigger,
});

export default Popover;
