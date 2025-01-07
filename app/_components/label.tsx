import ButtonPrimitive from '@/_components/button';
import TipPrimitive from '@/_components/tip';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef<
  React.ComponentRef<typeof ButtonPrimitive>,
  React.ComponentPropsWithoutRef<typeof ButtonPrimitive>
>(({ children, className, ...props }, ref) => (
  <ButtonPrimitive
    className={twMerge('absolute right-4 top-0', className)}
    ref={ref}
    variant="link"
    {...props}
  >
    {children}
  </ButtonPrimitive>
));

Button.displayName = 'Button';

const Root = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    className={twMerge('label', className)}
    ref={ref}
    {...props}
  />
));

Root.displayName = 'Root';

const Tip = ({ children }: React.ComponentProps<typeof TipPrimitive>) => (
  <TipPrimitive className="absolute right-2 top-0" side="left">
    {children}
  </TipPrimitive>
);

export { Button, Root, Tip };
