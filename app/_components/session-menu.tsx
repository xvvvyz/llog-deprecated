'use client';

import Alert from '@/_components/alert';
import DropdownMenu from '@/_components/dropdown-menu';
import IconButton from '@/_components/icon-button';
import deleteSession from '@/_mutations/delete-session';
import moveSession from '@/_mutations/move-session';
import { GetSessionWithDetailsData } from '@/_queries/get-session-with-details';
import { GetTrainingPlanWithSessionsData } from '@/_queries/get-training-plan-with-sessions';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface SessionMenuProps<T extends FieldValues> {
  form?: UseFormReturn<T>;
  highestPublishedOrder: number;
  isDraft?: boolean;
  isList?: boolean;
  isView?: boolean;
  missionId: string;
  nextSessionOrder: number;
  session:
    | NonNullable<GetTrainingPlanWithSessionsData>['sessions'][0]
    | NonNullable<GetSessionWithDetailsData>;
  subjectId: string;
}

const SessionMenu = <T extends FieldValues>({
  form,
  highestPublishedOrder,
  isDraft,
  isList,
  isView,
  missionId,
  nextSessionOrder,
  session,
  subjectId,
}: SessionMenuProps<T>) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const [isMoveLeftTransitioning, startMoveLeftTransition] = useTransition();
  const [isMoveRightTransitioning, startMoveRightTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <DropdownMenu
        trigger={
          form || isView ? (
            <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
          ) : (
            <div className="group mr-1.5 flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2 sm:mr-6">
              <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
                <EllipsisVerticalIcon className="w-5" />
              </div>
            </div>
          )
        }
      >
        <DropdownMenu.Content
          className={form || isView ? '-mr-[3.7rem] -mt-14' : '-mt-12 mr-1.5'}
        >
          {form ? (
            !isDraft && (
              <DropdownMenu.ForwardSearchParamsButton
                href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${session.id}`}
                scroll={false}
              >
                <EyeIcon className="w-5 text-fg-4" />
                View
              </DropdownMenu.ForwardSearchParamsButton>
            )
          ) : (
            <DropdownMenu.ForwardSearchParamsButton
              href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${session.id}/edit${isList ? '?fromSessions=1' : ''}`}
              scroll={false}
            >
              <PencilIcon className="w-5 text-fg-4" />
              Edit
            </DropdownMenu.ForwardSearchParamsButton>
          )}
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
        onConfirm={() => {
          void deleteSession({
            currentOrder: session.order,
            missionId: missionId,
            sessionId: session.id,
          });

          if (form || isView) {
            router.replace(
              `/subjects/${subjectId}/training-plans/${missionId}`,
            );
          }
        }}
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
      />
    </>
  );
};

export default SessionMenu;
