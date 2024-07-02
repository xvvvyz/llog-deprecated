'use client';

import Alert from '@/_components/alert';
import DropdownMenu from '@/_components/dropdown-menu';
import deleteSession from '@/_mutations/delete-session';
import moveSession from '@/_mutations/move-session';
import { GetMissionWithSessionsData } from '@/_queries/get-mission-with-sessions';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useTransition } from 'react';

interface SessionMenuProps {
  highestPublishedOrder: number;
  missionId: string;
  nextSessionOrder: number;
  session: NonNullable<GetMissionWithSessionsData>['sessions'][0];
  subjectId: string;
}

const SessionMenu = ({
  highestPublishedOrder,
  missionId,
  nextSessionOrder,
  session,
  subjectId,
}: SessionMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const [isMoveLeftTransitioning, startMoveLeftTransition] = useTransition();
  const [isMoveRightTransitioning, startMoveRightTransition] = useTransition();

  return (
    <>
      <DropdownMenu
        trigger={
          <div className="group mr-1.5 flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2 sm:mr-6">
            <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        }
      >
        <DropdownMenu.Content className="-mt-12 mr-1.5">
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${session.id}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </DropdownMenu.Button>
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}/from-session/${session.id}`}
            scroll={false}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </DropdownMenu.Button>
          <DropdownMenu.Separator />
          <DropdownMenu.Button
            disabled={!session.draft && session.order >= highestPublishedOrder}
            loading={isMoveRightTransitioning}
            loadingText="Moving…"
            onClick={(e) =>
              startMoveRightTransition(async () => {
                e.preventDefault();

                await moveSession({
                  currentOrder: session.order,
                  isDraft: session.draft,
                  missionId,
                  newOrder: session.order + 1,
                  sessionId: session.id,
                });
              })
            }
          >
            <ArrowUpIcon className="w-5 text-fg-4" />
            Move up
          </DropdownMenu.Button>
          <DropdownMenu.Button
            disabled={session.order < 1}
            loading={isMoveLeftTransitioning}
            loadingText="Moving…"
            onClick={(e) =>
              startMoveLeftTransition(async () => {
                e.preventDefault();

                await moveSession({
                  currentOrder: session.order,
                  isDraft: session.draft,
                  missionId,
                  newOrder: session.order - 1,
                  sessionId: session.id,
                });
              })
            }
          >
            <ArrowDownIcon className="w-5 text-fg-4" />
            Move down
          </DropdownMenu.Button>
          <DropdownMenu.Separator />
          <DropdownMenu.Button onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </DropdownMenu.Button>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Alert
        confirmText="Delete session"
        isConfirmingText="Deleting…"
        onConfirm={() =>
          deleteSession({
            currentOrder: session.order,
            missionId: missionId,
            sessionId: session.id,
          })
        }
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
      />
    </>
  );
};

export default SessionMenu;
