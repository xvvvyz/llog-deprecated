'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import deleteSession from '@/_mutations/delete-session';
import moveSession from '@/_mutations/move-session';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface SessionMenuProps {
  highestPublishedOrder: number;
  isDraft: boolean;
  isList?: boolean;
  isView?: boolean;
  missionId: string;
  nextSessionOrder: number;
  order: number;
  sessionId: string;
  subjectId: string;
}

const SessionMenu = ({
  highestPublishedOrder,
  isDraft,
  isList,
  isView,
  missionId,
  nextSessionOrder,
  order,
  sessionId,
  subjectId,
}: SessionMenuProps) => {
  const [isMoveLeftTransitioning, startMoveLeftTransition] = useTransition();
  const [isMoveRightTransitioning, startMoveRightTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {isView ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group mr-1.5 flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 sm:mr-6">
            <div className="rounded-full p-2 group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mx-2" sideOffset={-2}>
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${sessionId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </DropdownMenu.Button>
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}/from-session/${sessionId}`}
            scroll={false}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </DropdownMenu.Button>
          <DropdownMenu.Button
            href={`/templates/sessions/create/from-session/${sessionId}`}
            scroll={false}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </DropdownMenu.Button>
          {isList && (
            <>
              <DropdownMenu.Button
                disabled={!isDraft && order >= highestPublishedOrder}
                loading={isMoveRightTransitioning}
                loadingText="Moving…"
                onClick={() =>
                  startMoveRightTransition(() =>
                    moveSession({
                      currentOrder: order,
                      isDraft,
                      missionId,
                      newOrder: order + 1,
                      sessionId,
                    }),
                  )
                }
              >
                <ArrowUpIcon className="w-5 text-fg-4" />
                Move up
              </DropdownMenu.Button>
              <DropdownMenu.Button
                disabled={order < 1}
                loading={isMoveLeftTransitioning}
                loadingText="Moving…"
                onClick={() => {
                  startMoveLeftTransition(() =>
                    moveSession({
                      currentOrder: order,
                      isDraft,
                      missionId,
                      newOrder: order - 1,
                      sessionId,
                    }),
                  );
                }}
              >
                <ArrowDownIcon className="w-5 text-fg-4" />
                Move down
              </DropdownMenu.Button>
            </>
          )}
          <DropdownMenuDeleteItem
            confirmText="Delete session"
            onConfirm={async () => {
              await deleteSession({
                currentOrder: order,
                missionId: missionId,
                sessionId,
              });

              if (!isList) {
                router.replace(
                  `/subjects/${subjectId}/training-plans/${missionId}/sessions`,
                );
              }
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SessionMenu;
