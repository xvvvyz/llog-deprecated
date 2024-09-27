'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
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
  isStarted: boolean;
  isView?: boolean;
  nextSessionOrder: number;
  order: number;
  protocolId: string;
  sessionId: string;
  subjectId: string;
}

const SessionMenu = ({
  highestPublishedOrder,
  isDraft,
  isList,
  isStarted,
  isView,
  nextSessionOrder,
  order,
  protocolId,
  sessionId,
  subjectId,
}: SessionMenuProps) => {
  const [isMoveLeftTransitioning, startMoveLeftTransition] = useTransition();
  const [isMoveRightTransitioning, startMoveRightTransition] = useTransition();
  const router = useRouter();

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        {isView ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group mr-1.5 flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2 sm:mr-6">
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Session menu</Drawer.Title>
          <Drawer.Description />
          {isStarted ? (
            <Drawer.Root>
              <Drawer.Trigger asChild>
                <Drawer.Button>
                  <PencilIcon className="w-5 text-fg-4" />
                  Edit
                </Drawer.Button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay />
                <Drawer.Content>
                  <Drawer.Title className="not-sr-only text-center text-2xl">
                    Are you sure?
                  </Drawer.Title>
                  <Drawer.Description className="not-sr-only mx-auto mt-4 max-w-xs px-4 text-center text-fg-4">
                    This session has completed modules. Are you sure you want to
                    edit it?
                  </Drawer.Description>
                  <div className="mt-16 flex flex-col-reverse gap-4">
                    <Drawer.Close asChild>
                      <Button
                        className="m-0 -mb-3 w-full justify-center p-0 py-3"
                        variant="link"
                      >
                        Cancel
                      </Button>
                    </Drawer.Close>
                    <Button
                      href={`/subjects/${subjectId}/protocols/${protocolId}/sessions/${sessionId}/edit`}
                    >
                      Edit session
                    </Button>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          ) : (
            <Drawer.Button
              href={`/subjects/${subjectId}/protocols/${protocolId}/sessions/${sessionId}/edit`}
            >
              <PencilIcon className="w-5 text-fg-4" />
              Edit
            </Drawer.Button>
          )}
          <Drawer.Button
            href={`/subjects/${subjectId}/protocols/${protocolId}/sessions/create/${nextSessionOrder}/from-session/${sessionId}`}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </Drawer.Button>
          <Drawer.Separator />
          <Drawer.Button
            href={`/templates/sessions/create/from-session/${sessionId}`}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </Drawer.Button>
          {isList && (
            <>
              <Drawer.Separator />
              <Drawer.Button
                disabled={!isDraft && order >= highestPublishedOrder}
                loading={isMoveRightTransitioning}
                loadingText="Moving…"
                onClick={() =>
                  startMoveRightTransition(() =>
                    moveSession({
                      currentOrder: order,
                      isDraft,
                      newOrder: order + 1,
                      protocolId: protocolId,
                      sessionId,
                    }),
                  )
                }
              >
                <ArrowUpIcon className="w-5 text-fg-4" />
                Move up
              </Drawer.Button>
              <Drawer.Button
                disabled={order < 1}
                loading={isMoveLeftTransitioning}
                loadingText="Moving…"
                onClick={() => {
                  startMoveLeftTransition(() =>
                    moveSession({
                      currentOrder: order,
                      isDraft,
                      newOrder: order - 1,
                      protocolId: protocolId,
                      sessionId,
                    }),
                  );
                }}
              >
                <ArrowDownIcon className="w-5 text-fg-4" />
                Move down
              </Drawer.Button>
            </>
          )}
          <Drawer.Separator />
          <DrawerDeleteButton
            confirmText="Delete session"
            onConfirm={async () => {
              await deleteSession({
                currentOrder: order,
                protocolId: protocolId,
                sessionId,
              });

              if (!isList) {
                router.replace(
                  `/subjects/${subjectId}/protocols/${protocolId}/sessions`,
                );
              }
            }}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default SessionMenu;
