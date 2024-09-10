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
  nextSessionOrder: number;
  order: number;
  sessionId: string;
  subjectId: string;
  trainingPlanId: string;
}

const SessionMenu = ({
  highestPublishedOrder,
  isDraft,
  isList,
  isView,
  nextSessionOrder,
  order,
  sessionId,
  subjectId,
  trainingPlanId,
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
          <div className="group mr-1.5 flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2 sm:mr-6">
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${trainingPlanId}/sessions/${sessionId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </DropdownMenu.Button>
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${trainingPlanId}/sessions/create/${nextSessionOrder}/from-session/${sessionId}`}
            scroll={false}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </DropdownMenu.Button>
          {isList && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Button
                disabled={!isDraft && order >= highestPublishedOrder}
                loading={isMoveRightTransitioning}
                loadingText="Moving…"
                onClick={() =>
                  startMoveRightTransition(() =>
                    moveSession({
                      currentOrder: order,
                      isDraft,
                      newOrder: order + 1,
                      sessionId,
                      trainingPlanId: trainingPlanId,
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
                      newOrder: order - 1,
                      sessionId,
                      trainingPlanId: trainingPlanId,
                    }),
                  );
                }}
              >
                <ArrowDownIcon className="w-5 text-fg-4" />
                Move down
              </DropdownMenu.Button>
            </>
          )}
          <DropdownMenu.Separator />
          <DropdownMenu.Button
            href={`/templates/sessions/create/from-session/${sessionId}`}
            scroll={false}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </DropdownMenu.Button>
          <DropdownMenu.Separator />
          <DropdownMenuDeleteItem
            confirmText="Delete session"
            onConfirm={async () => {
              await deleteSession({
                currentOrder: order,
                sessionId,
                trainingPlanId: trainingPlanId,
              });

              if (!isList) {
                router.replace(
                  `/subjects/${subjectId}/training-plans/${trainingPlanId}/sessions`,
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
