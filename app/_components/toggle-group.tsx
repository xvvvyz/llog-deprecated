'use client';

import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Item = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    className={twMerge(
      'group relative flex w-full items-center gap-2.5 py-2 pl-4 pr-2 leading-tight text-fg-4 transition-colors focus-within:bg-alpha-2 focus-within:outline-none hover:bg-alpha-1 data-[state=on]:text-fg-2',
      className,
    )}
    ref={ref}
    {...props}
  >
    <div className="-ml-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-alpha-1 bg-alpha-1 transition-colors group-data-[state=on]:bg-accent-1">
      <CheckIcon className="hidden w-4 stroke-bg-1 stroke-2 group-data-[state=on]:block" />
    </div>
    {children}
  </ToggleGroupPrimitive.Item>
));

Item.displayName = ToggleGroupPrimitive.Item.displayName;

const Root = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ children, className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    className={twMerge(
      'divide-y divide-alpha-1 rounded border border-alpha-1 bg-alpha-1 focus-within:ring-1 focus-within:ring-accent-2',
      className,
    )}
    ref={ref}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

Root.displayName = ToggleGroupPrimitive.Root.displayName;

export { Item, Root };
