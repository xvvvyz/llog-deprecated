import * as SwitchPrimitives from '@radix-ui/react-switch';
import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    description?: ReactNode;
    label: ReactNode;
  }
>(({ className, description, label, ...props }, ref) => (
  <label
    className={twMerge(
      'input block select-none bg-transparent py-4 text-left hover:bg-alpha-1',
      className,
    )}
  >
    <div className="flex items-center justify-between gap-4">
      <span className="label p-0">{label}</span>
      <SwitchPrimitives.Root
        {...props}
        className="box-content h-6 w-10 shrink-0 cursor-pointer rounded border border-alpha-2 bg-alpha-3 transition-colors data-[state=checked]:bg-accent-1"
        ref={ref}
      >
        <SwitchPrimitives.Thumb className="block h-6 w-6 rounded bg-bg-2 shadow-sm transition-transform data-[state=checked]:translate-x-4" />
      </SwitchPrimitives.Root>
    </div>
    {description && (
      <span className="label mt-6 p-0 text-fg-4">{description}</span>
    )}
  </label>
));

Switch.displayName = 'Switch';
export default Switch;
