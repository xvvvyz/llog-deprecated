'use client';

import Disclosure from '@/(account)/subjects/[subjectId]/_components/disclosure';
import IconButton from '@/_components/icon-button';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface EventModalProps {
  children: ReactNode;
  content?: string;
  subjectId: string;
  title: string;
}

const EventModal = ({
  children,
  content,
  subjectId,
  title,
}: EventModalProps) => {
  const ref = useRef(null);
  const router = useRouter();

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
            className="min-h-full w-full max-w-lg rounded border border-alpha-1 bg-bg-2 shadow-lg"
            ref={ref}
          >
            <div className="border-b border-alpha-1 bg-alpha-reverse-1">
              <div
                className={twMerge(
                  'flex items-center justify-between gap-4 px-4 pt-8 sm:px-8',
                  !content && 'pb-8'
                )}
              >
                <Dialog.Title className="text-2xl">{title}</Dialog.Title>
                <IconButton
                  href={`/subjects/${subjectId}/timeline`}
                  icon={<XMarkIcon className="w-7" />}
                  label="Close"
                />
              </div>
              {!!content && (
                <Disclosure className="px-4 sm:px-8">{content}</Disclosure>
              )}
            </div>
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default EventModal;
