import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import { GetMissionWithSessionsData } from '@/_server/get-mission-with-sessions';
import { ReactNode } from 'react';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface SessionLayoutProps {
  children: ReactNode;
  isCreate?: boolean;
  isEdit?: boolean;
  isTeamMember: boolean;
  missionId: string;
  missionName: string;
  order?: string;
  sessionId?: string;
  sessions: NonNullable<GetMissionWithSessionsData>['sessions'];
  subjectId: string;
  subjectName: string;
}

const SessionLayout = async ({
  children,
  isCreate,
  isEdit,
  isTeamMember,
  missionId,
  missionName,
  order,
  sessionId,
  sessions,
  subjectId,
  subjectName,
}: SessionLayoutProps) => {
  const isEditOrCreate = isCreate || isEdit;
  const currentSession = sessions.find(({ id }) => id === sessionId);
  const sessionOrder = order ? Number(order) : currentSession?.order;
  if (typeof sessionOrder === 'undefined') return null;

  const breadcrumbs = [
    [subjectName, `/subjects/${subjectId}`],
    [missionName, `/subjects/${subjectId}/missions/${missionId}/sessions`],
    [`${sessionOrder + 1}`],
  ];

  if (isEditOrCreate) {
    breadcrumbs[3] = ['Edit'];

    if (isEdit && !currentSession?.draft) {
      breadcrumbs[2][1] = `/subjects/${subjectId}/missions/${missionId}/sessions/${sessionId}`;
    }
  }

  // eslint-disable-next-line prefer-const
  let { highestOrder, nextSessionId, previousSessionId } = sessions.reduce(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session.order);

      if (currentSession) {
        if (currentSession.id === session.id) {
          acc.nextSessionId = sessions[i + 1]?.id;
          acc.previousSessionId = sessions[i - 1]?.id;
        }
      } else {
        if (session.order === sessionOrder) {
          acc.nextSessionId = sessions[i + 1]?.id;
          acc.previousSessionId = sessions[i]?.id;
        }
      }

      return acc;
    },
    { highestOrder: -1, nextSessionId: null, previousSessionId: null } as {
      highestOrder: number;
      nextSessionId: string | null;
      previousSessionId: string | null;
    },
  );

  if (
    isEditOrCreate &&
    sessions.length > 0 &&
    !previousSessionId &&
    !nextSessionId
  ) {
    sessions.some((session) => {
      if (session.order < sessionOrder) {
        previousSessionId = session.id;
      } else if (session.order > sessionOrder) {
        nextSessionId = session.id;
        return true;
      }
    });
  }

  const editSuffix = isEditOrCreate ? '/edit' : '';
  const nextSessionOrder = highestOrder + 1;

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton
          href={
            isEditOrCreate
              ? `/subjects/${subjectId}/missions/${missionId}/sessions`
              : `/subjects/${subjectId}`
          }
        />
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <nav className="flex w-full items-center justify-between px-4">
        <IconButton
          disabled={!previousSessionId}
          href={`/subjects/${subjectId}/missions/${missionId}/sessions/${previousSessionId}${editSuffix}`}
          icon={<ChevronLeftIcon className="relative -left-2 w-7" />}
          label="Previous session"
          replace
        />
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-fg-4">
            Session {sessionOrder + 1}
            {!isEditOrCreate && <> of {highestOrder + 1}</>}
          </span>
          {currentSession?.draft || order ? (
            <span className="smallcaps">Draft</span>
          ) : (
            isTeamMember &&
            (isEditOrCreate ? (
              <Button
                className="-my-4 items-baseline"
                href={`/subjects/${subjectId}/missions/${missionId}/sessions/${sessionId}`}
                variant="link"
              >
                <EyeIcon className="relative top-1 w-5" />
                View
              </Button>
            ) : (
              <Button
                className="-my-4 items-baseline"
                href={`/subjects/${subjectId}/missions/${missionId}/sessions/${sessionId}/edit`}
                variant="link"
              >
                <PencilIcon className="relative top-1 w-5" />
                Edit
              </Button>
            ))
          )}
        </div>
        {isEditOrCreate && !nextSessionId ? (
          <IconButton
            disabled={isCreate}
            href={`/subjects/${subjectId}/missions/${missionId}/sessions/create/${nextSessionOrder}`}
            icon={<PlusIcon className="relative -right-2 w-7" />}
            label="Add session"
            replace
          />
        ) : (
          <IconButton
            disabled={!nextSessionId}
            href={`/subjects/${subjectId}/missions/${missionId}/sessions/${nextSessionId}${editSuffix}`}
            icon={<ChevronRightIcon className="relative -right-2 w-7" />}
            label="Next session"
            replace
          />
        )}
      </nav>
      <div className="mt-8 flex flex-col gap-4">{children}</div>
    </>
  );
};

export default SessionLayout;
