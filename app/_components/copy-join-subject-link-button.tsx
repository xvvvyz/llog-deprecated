'use client';

import createShareCode from '@/_actions/create-share-code';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon';
import { useCopyToClipboard, useToggle } from '@uidotdev/usehooks';
import { useRef, useTransition } from 'react';
import Button from './button';

interface CopyJoinSubjectLinkButton {
  shareCode: string | null;
  subjectId: string;
}

const CopyJoinSubjectLinkButton = ({
  shareCode,
  subjectId,
}: CopyJoinSubjectLinkButton) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedToClipboard, toggleHasCopiedToClipboard] = useToggle(false);
  const [isTransitioning, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>();

  return (
    <Button
      className="whitespace-nowrap"
      loading={isTransitioning}
      loadingText="Generating link…"
      onClick={() =>
        startTransition(async () => {
          clearTimeout(timeoutRef.current);

          if (!shareCode) {
            const { data } = await createShareCode(subjectId);
            shareCode = data?.share_code as string;
          }

          await copyToClipboard(
            `${location.origin}/subjects/${subjectId}/join/${shareCode}`,
          );

          toggleHasCopiedToClipboard(true);

          timeoutRef.current = setTimeout(
            () => toggleHasCopiedToClipboard(false),
            2000,
          );
        })
      }
      variant="link"
    >
      {hasCopiedToClipboard ? (
        <>
          <CheckIcon className="w-5" />
          Copied, share it!
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="w-5" />
          Copy client link
        </>
      )}
    </Button>
  );
};

export default CopyJoinSubjectLinkButton;
