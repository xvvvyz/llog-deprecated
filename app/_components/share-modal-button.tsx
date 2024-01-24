'use client';

import updateSubject from '@/_actions/update-subject';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Switch from '@/_components/switch';
import { Dialog } from '@headlessui/react';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon';
import ShareIcon from '@heroicons/react/24/outline/ShareIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useCopyToClipboard, useToggle } from '@uidotdev/usehooks';
import { useOptimistic, useRef, useTransition } from 'react';

interface ShareModalButtonProps {
  isPublic: boolean;
  subjectId: string;
}

const ShareModalButton = ({ isPublic, subjectId }: ShareModalButtonProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [, startTransition] = useTransition();
  const [enabled, toggleEnabled] = useOptimistic(isPublic, (state) => !state);
  const [hasCopiedToClipboard, toggleHasCopiedToClipboard] = useToggle(false);
  const [modal, toggleModal] = useToggle(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return (
    <>
      <Button onClick={() => toggleModal(true)} variant="link">
        <ShareIcon className="w-5" />
        Share
      </Button>
      <Dialog className="relative z-10" onClose={toggleModal} open={modal}>
        <Dialog.Backdrop className="fixed inset-0 bg-alpha-reverse-1 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm rounded border border-alpha-1 bg-bg-2 p-8 pt-5 shadow-lg">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-2xl">Share</Dialog.Title>
                <IconButton
                  icon={<XMarkIcon className="relative -right-[0.16em] w-7" />}
                  onClick={() => toggleModal(false)}
                />
              </div>
              <div className="pt-8">
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
                  onCheckedChange={() =>
                    startTransition(() => {
                      toggleEnabled(null);
                      void updateSubject({ id: subjectId, public: !enabled });
                    })
                  }
                />
              </div>
              {enabled && (
                <div className="mt-10 space-y-4">
                  <Button
                    className="w-full justify-between"
                    colorScheme="transparent"
                    href={`/share/${subjectId}`}
                    target="_blank"
                  >
                    View public profile
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
