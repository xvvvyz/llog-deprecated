'use client';

import { Dialog } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';

interface PageModalProps {
  // hack to work around: https://github.com/vercel/next.js/issues/61336
  back?: string;
  children: ReactNode;
  temporary_forcePath?: string;
}

const PageModal = ({ back, children, temporary_forcePath }: PageModalProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const scrollContainer = useRef<HTMLDivElement>(null);

  // hack to work around: https://github.com/vercel/next.js/issues/59502
  if (temporary_forcePath && pathname !== temporary_forcePath) return null;

  return (
    <Dialog
      initialFocus={scrollContainer}
      onClose={() => back && router.push(back, { scroll: false })}
      open
    >
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
