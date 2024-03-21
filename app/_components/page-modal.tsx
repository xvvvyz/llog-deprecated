'use client';

import { Dialog } from '@headlessui/react';
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
      <Dialog.Backdrop className="fixed inset-0 z-10 bg-alpha-reverse-1 backdrop-blur-sm" />
      <div
        className="fixed inset-0 z-20 overflow-y-auto py-16"
        ref={scrollContainer}
      >
        <div className="flex min-h-full items-start justify-center">
          <Dialog.Panel
            className={twMerge(
              'relative w-full max-w-lg divide-y divide-alpha-1 rounded border-y border-alpha-1 bg-bg-2 shadow-lg sm:border-x',
              className,
            )}
          >
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default PageModal;
