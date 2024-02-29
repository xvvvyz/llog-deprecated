'use client';

import deleteSession from '@/_actions/delete-session';
import moveSession from '@/_actions/move-session';
import Alert from '@/_components/alert';
import Menu from '@/_components/menu';
import MenuButton from '@/_components/menu-button';
import MenuItem from '@/_components/menu-item';
import MenuItems from '@/_components/menu-items';
import { GetMissionWithSessionsData } from '@/_queries/get-mission-with-sessions';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useTransition } from 'react';

interface SessionLinkListItemMenuProps {
  highestPublishedOrder: number;
  missionId: string;
  nextSessionOrder: number;
  session: NonNullable<GetMissionWithSessionsData>['sessions'][0];
  subjectId: string;
}

const SessionLinkListItemMenu = ({
  highestPublishedOrder,
  missionId,
  nextSessionOrder,
  session,
  subjectId,
}: SessionLinkListItemMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const [isMoveLeftTransitioning, startMoveLeftTransition] = useTransition();
  const [isMoveRightTransitioning, startMoveRightTransition] = useTransition();

  return (
    <>
      <Menu className="shrink-0">
        <MenuButton className="group flex h-full items-center justify-center pr-4 text-fg-3 hover:text-fg-2 sm:pr-8">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </MenuButton>
        <MenuItems className="mr-2 mt-2">
          <MenuItem
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${session.id}/edit`}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </MenuItem>
          <MenuItem
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}/from-session/${session.id}`}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </MenuItem>
          <MenuItem
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
          </MenuItem>
          <MenuItem
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
          </MenuItem>
          <MenuItem onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </MenuItem>
        </MenuItems>
      </Menu>
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

export default SessionLinkListItemMenu;
