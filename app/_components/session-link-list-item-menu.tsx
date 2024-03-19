'use client';

import Alert from '@/_components/alert';
import Menu from '@/_components/menu';
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
        <Menu.Button className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </Menu.Button>
        <Menu.Items className="mr-2 mt-2">
          <Menu.Item
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${session.id}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </Menu.Item>
          <Menu.Item
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}/from-session/${session.id}`}
            scroll={false}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </Menu.Item>
          <Menu.Item
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
          </Menu.Item>
          <Menu.Item
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
          </Menu.Item>
          <Menu.Item onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </Menu.Item>
        </Menu.Items>
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
