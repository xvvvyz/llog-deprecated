'use client';

import Button from '@/_components/button';
import useSupabase from '@/_hooks/use-supabase';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { useBoolean, useCopyToClipboard, useToggle } from 'usehooks-ts';

interface CopyJoinSubjectLinkButton {
  shareCode: string | null;
  subjectId: string;
}

const CopyJoinSubjectLinkButton = ({
  shareCode,
  subjectId,
}: CopyJoinSubjectLinkButton) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopyingToClipboard, toggleCopyingToClipboard] = useToggle();
  const hasCopied = useBoolean();
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
          `${location.origin}/subjects/${subjectId}/join/${shareCode}`
        );

        toggleCopyingToClipboard();
        timeoutRef.current = setTimeout(hasCopied.setFalse, 2000);
        hasCopied.setTrue();
      }}
      variant="link"
    >
      {hasCopied.value ? (
        <>
          <CheckIcon className="w-5" />
          Link copied&hellip;
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
