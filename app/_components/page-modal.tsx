'use client';

import { Dialog } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';

interface PageModalProps {
  children: ReactNode;
}

const PageModal = ({ children }: PageModalProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const scrollContainer = useRef<HTMLDivElement>(null);

  // hack: https://github.com/vercel/next.js/issues/62948
  if (pathname.endsWith('/sessions')) return null;

  return (
    <Dialog initialFocus={scrollContainer} onClose={router.back} open>
      <Dialog.Backdrop className="fixed inset-0 z-10 bg-alpha-reverse-1 backdrop-blur-sm" />
      <div
        className="fixed inset-0 z-20 overflow-y-auto py-16"
        ref={scrollContainer}
      >
        <div className="flex min-h-full items-start justify-center">
          <Dialog.Panel className="relative w-full max-w-lg divide-y divide-alpha-1 rounded border-y border-alpha-1 bg-bg-2 shadow-lg sm:border-x">
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default PageModal;
