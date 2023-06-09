'use client';

import IconButton from '@/(account)/_components/icon-button';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';

interface SessionModalProps {
  children: ReactNode;
  nav: ReactNode;
  subjectId: string;
  title: string;
}

const SessionModal = ({
  children,
  nav,
  subjectId,
  title,
}: SessionModalProps) => {
  const router = useRouter();
  const ref = useRef(null);

  return (
    <Dialog
      className="relative z-10"
      initialFocus={ref}
      onClose={() => router.push(`/subjects/${subjectId}/timeline`)}
      open
    >
      <div className="fixed inset-0 bg-alpha-reverse-2 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center py-16">
          <Dialog.Panel
            className="min-h-full w-full max-w-lg space-y-4"
            ref={ref}
          >
            <div className="rounded border border-alpha-1 bg-bg-2 shadow-lg">
              <div className="space-y-8 rounded bg-alpha-reverse-1 px-4 py-8 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <Dialog.Title className="text-2xl">{title}</Dialog.Title>
                  <IconButton
                    href={`/subjects/${subjectId}/timeline`}
                    icon={<XMarkIcon className="relative -right-1.5 w-7" />}
                    label="Close"
                  />
                </div>
                {nav}
              </div>
            </div>
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default SessionModal;
