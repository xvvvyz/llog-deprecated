'use client';

import useSupabase from '@/_hooks/use-supabase';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useCopyToClipboard, useToggle } from '@uidotdev/usehooks';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
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
  const [isCopyingToClipboard, toggleCopyingToClipboard] = useToggle(false);
  const supabase = useSupabase();
  const timeoutRef = useRef<NodeJS.Timeout>();

  return (
    <Button
      className="whitespace-nowrap"
      loading={isCopyingToClipboard}
      loadingText="Generating link…"
      onClick={async () => {
        clearTimeout(timeoutRef.current);
        toggleCopyingToClipboard();

        if (!shareCode) {
          shareCode = nanoid(8);

          const { error: subjectError } = await supabase
            .from('subjects')
            .update({ share_code: shareCode })
            .eq('id', subjectId);

          if (subjectError) {
            alert(subjectError.message);
            toggleCopyingToClipboard();
            return;
          }
        }

        await copyToClipboard(
          `${location.origin}/subjects/${subjectId}/join/${shareCode}`,
        );

        toggleCopyingToClipboard();

        timeoutRef.current = setTimeout(
          () => toggleHasCopiedToClipboard(false),
          2000,
        );

        toggleHasCopiedToClipboard(true);
      }}
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
