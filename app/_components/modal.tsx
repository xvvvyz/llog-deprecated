'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Close = DialogPrimitive.Close;

const Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={twMerge(
      'relative w-full max-w-lg rounded border-y border-alpha-1 bg-bg-2 outline-none drop-shadow-2xl sm:border-x',
      className,
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));

Content.displayName = DialogPrimitive.Content.displayName;

const Description = DialogPrimitive.Description;

const Overlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={twMerge(
      'fixed left-0 top-0 z-10 h-dvh w-dvw overflow-y-auto bg-alpha-reverse-1 py-16 backdrop-blur',
      className,
    )}
    {...props}
  >
    <div className="flex min-h-full items-start justify-center">{children}</div>
  </DialogPrimitive.Overlay>
));

Overlay.displayName = DialogPrimitive.Overlay.displayName;

const Portal = DialogPrimitive.Portal;

const Root = DialogPrimitive.Root;

const Title = DialogPrimitive.Title;

const Trigger = DialogPrimitive.Trigger;

export { Close, Content, Description, Overlay, Portal, Root, Title, Trigger };
