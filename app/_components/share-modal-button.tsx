'use client';

import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Switch from '@/_components/switch';
import { Dialog } from '@headlessui/react';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon';
import ShareIcon from '@heroicons/react/24/outline/ShareIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCopyToClipboard, useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useOptimistic, useRef } from 'react';

interface ShareModalButtonProps {
  isPublic: boolean;
  subjectId: string;
}

const ShareModalButton = ({ isPublic, subjectId }: ShareModalButtonProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [enabled, toggleEnabled] = useOptimistic(isPublic, (state) => !state);
  const [hasCopiedToClipboard, toggleHasCopiedToClipboard] = useToggle(false);
  const [modal, toggleModal] = useToggle(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();

  return (
    <>
      <Button onClick={() => toggleModal(true)} variant="link">
        <ShareIcon className="w-5" />
        Share
      </Button>
      <Dialog className="relative z-10" onClose={toggleModal} open={modal}>
        <Dialog.Backdrop className="fixed inset-0 bg-alpha-reverse-3 backdrop-blur-sm" />
        <div className="fixed inset-4 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm transform rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-2xl">Share</Dialog.Title>
                <IconButton
                  icon={<XMarkIcon className="relative -right-[0.16em] w-7" />}
                  onClick={() => toggleModal(false)}
                />
              </div>
              <form
                action={async () => {
                  toggleEnabled(null);

                  await createClientComponentClient()
                    .from('subjects')
                    .update({ public: !enabled })
                    .eq('id', subjectId);

                  router.refresh();
                }}
                className="pt-8"
                ref={formRef}
              >
                <Switch
                  checked={enabled}
                  description={
                    <>
                      Anyone with the link can access.
                      <br />
                      Clients are anonymized.
                    </>
                  }
                  label="Public read-only profile"
                  name="share"
                  onCheckedChange={() => formRef.current?.requestSubmit()}
                />
              </form>
              {enabled && (
                <div className="mt-10 space-y-4">
                  <Button
                    className="w-full justify-between"
                    colorScheme="transparent"
                    href={`/share/${subjectId}`}
                    target="_blank"
                  >
                    Preview public profile
                    <ArrowTopRightOnSquareIcon className="w-5" />
                  </Button>
                  <Button
                    className="w-full justify-between"
                    colorScheme="transparent"
                    onClick={async () => {
                      clearTimeout(timeoutRef.current);
                      void copyToClipboard(
                        `${location.origin}/share/${subjectId}`,
                      );

                      timeoutRef.current = setTimeout(
                        () => toggleHasCopiedToClipboard(false),
                        2000,
                      );

                      toggleHasCopiedToClipboard(true);
                    }}
                  >
                    {hasCopiedToClipboard ? (
                      <>
                        Copied, share it!
                        <CheckIcon className="w-5" />
                      </>
                    ) : (
                      <>
                        Copy share link
                        <ClipboardDocumentIcon className="w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ShareModalButton;
