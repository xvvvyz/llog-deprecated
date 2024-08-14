'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const Modal = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Root {...props}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-10 overflow-y-auto bg-alpha-reverse-1 py-16 backdrop-blur">
        <div className="flex min-h-full items-start justify-center">
          <DialogPrimitive.Content
            ref={ref}
            className={twMerge(
              'relative z-20 w-full max-w-lg rounded border-y border-alpha-1 bg-bg-2 outline-none drop-shadow-2xl sm:border-x',
              className,
            )}
          >
            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
));

Modal.displayName = 'Modal';

export default Modal;
