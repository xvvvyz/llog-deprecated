'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import deleteSession from '@/_mutations/delete-session';
import moveSession from '@/_mutations/move-session';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface SessionMenuProps {
  highestPublishedOrder: number;
  isDraft: boolean;
  isDuplicate?: boolean;
  isEdit?: boolean;
  isList?: boolean;
  isView?: boolean;
  missionId: string;
  nextSessionOrder: number;
  order: number;
  sessionId?: string;
  subjectId: string;
}

const SessionMenu = ({
  highestPublishedOrder,
  isDraft,
  isDuplicate,
  isEdit,
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
        {isView || isEdit ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group mr-1.5 flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2 sm:mr-6">
            <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={isView || isEdit ? '-mr-[3.7rem]' : 'mr-2'}
        >
          {isEdit && !isDraft && (
            <DropdownMenu.Button
              href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${sessionId}`}
              scroll={false}
            >
              <EyeIcon className="w-5 text-fg-4" />
              View
            </DropdownMenu.Button>
          )}
          {(isList || isView) && (
            <DropdownMenu.Button
              href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${sessionId}/edit`}
              scroll={false}
            >
              <PencilIcon className="w-5 text-fg-4" />
              Edit
            </DropdownMenu.Button>
          )}
          {sessionId && !isDuplicate ? (
            <>
              <DropdownMenu.Button
                href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}/from-session/${sessionId}`}
                scroll={false}
              >
                <DocumentDuplicateIcon className="w-5 text-fg-4" />
                Duplicate
              </DropdownMenu.Button>
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
                {isList ? (
                  <>
                    <ArrowUpIcon className="w-5 text-fg-4" />
                    Move up
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="w-5 text-fg-4" />
                    Move right
                  </>
                )}
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
                {isList ? (
                  <>
                    <ArrowDownIcon className="w-5 text-fg-4" />
                    Move down
                  </>
                ) : (
                  <>
                    <ArrowLeftIcon className="w-5 text-fg-4" />
                    Move left
                  </>
                )}
              </DropdownMenu.Button>
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
            </>
          ) : (
            <>
              <DropdownMenu.Button
                disabled={order < 1}
                href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${order - 1}${isDuplicate ? `/from-session/${sessionId}` : ''}`}
                replace
                scroll={false}
              >
                <ArrowLeftIcon className="w-5 text-fg-4" />
                Move left
              </DropdownMenu.Button>
              <DropdownMenu.Button
                href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${order + 1}${isDuplicate ? `/from-session/${sessionId}` : ''}`}
                replace
                scroll={false}
              >
                <ArrowRightIcon className="w-5 text-fg-4" />
                Move right
              </DropdownMenu.Button>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SessionMenu;
