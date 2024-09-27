'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import Tip from '@/_components/tip';
import deleteInsight from '@/_mutations/delete-insight';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { useCopyToClipboard, useToggle } from '@uidotdev/usehooks';
import { useRef } from 'react';

interface InsightMenuProps {
  insightId: string;
  subjectId: string;
}

const InsightMenu = ({ insightId, subjectId }: InsightMenuProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedLink, toggleHasCopiedLink] = useToggle(false);
  const linkTimeoutRef = useRef<NodeJS.Timeout>();

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <div className="group flex items-center justify-center px-1.5 text-fg-3 transition-colors hover:text-fg-2">
          <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Insight menu</Drawer.Title>
          <Drawer.Description />
          <Drawer.Button
            href={`/subjects/${subjectId}/insights/${insightId}/edit`}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </Drawer.Button>
          <div className="relative">
            <Drawer.Button
              className="w-full"
              onClick={async () => {
                clearTimeout(linkTimeoutRef.current);

                void copyToClipboard(
                  `${location.origin}/subjects/${subjectId}/insights/${insightId}`,
                );

                linkTimeoutRef.current = setTimeout(
                  () => toggleHasCopiedLink(false),
                  2000,
                );

                toggleHasCopiedLink(true);
              }}
            >
              {hasCopiedLink ? (
                <>
                  <CheckIcon className="w-5 text-fg-4" />
                  Copied, share it!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-5 text-fg-4" />
                  Copy link
                </>
              )}
            </Drawer.Button>
            <Tip align="end" className="absolute right-3 top-2.5">
              Clients and team members have permission to view this insight.
            </Tip>
          </div>
          <DrawerDeleteButton
            confirmText="Delete insight"
            onConfirm={() => deleteInsight(insightId)}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default InsightMenu;
