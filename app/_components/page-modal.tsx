'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalProps {
  children: ReactNode;
  className?: string;
}

const PageModal = ({ children, className }: PageModalProps) => {
  const router = useRouter();
  const scrollContainer = useRef<HTMLDivElement>(null);

  return (
    <Dialog initialFocus={scrollContainer} onClose={router.back} open>
      <div className="fixed inset-0 z-10 bg-alpha-reverse-1 backdrop-blur" />
      <div
        className="fixed left-0 top-0 z-20 h-dvh w-dvw overflow-y-auto py-16"
        ref={scrollContainer}
      >
        <div className="flex min-h-full items-start justify-center">
          <DialogPanel
            className={twMerge(
              'relative w-full max-w-lg rounded border-y border-alpha-1 bg-bg-2 drop-shadow-2xl sm:border-x',
              className,
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PageModal;
