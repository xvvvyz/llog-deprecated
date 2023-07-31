import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import IconButton from '@/(account)/_components/icon-button';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getMissionWithSessions from '@/(account)/_server/get-mission-with-sessions';
import getSubject from '@/(account)/_server/get-subject';
import forceArray from '@/(account)/_utilities/force-array';
import Button from '@/_components/button';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface LayoutLayoutProps {
  children: ReactNode;
  params: {
    edit?: string;
    missionId: string;
    order?: string;
    sessionId?: string;
    subjectId: string;
  };
}

const SessionLayout = async ({
  children,
  params: { edit, missionId, order, sessionId, subjectId },
}: LayoutLayoutProps) => {
  if ((edit && edit !== 'edit') || (order && isNaN(Number(order)))) notFound();
  const isEditOrCreate = !!order || !!edit;

  const [{ data: subject }, { data: mission }, teamId] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, isEditOrCreate),
    getCurrentTeamId(),
  ]);

  if (!subject || !mission) notFound();

  const breadcrumbs = [
    [subject.name, `/subjects/${subjectId}/timeline`],
    [mission.name],
  ];

  if (isEditOrCreate) {
    breadcrumbs[1][1] = `/subjects/${subjectId}/missions/${missionId}/sessions`;
    breadcrumbs[2] = [order ? 'Add session' : 'Edit session'];
  }

  const sessions = forceArray(mission.sessions);
  const currentSession = sessions.find(({ id }) => id === sessionId);
  const sessionOrder = order ? Number(order) : currentSession?.order;
  if (typeof sessionOrder === 'undefined') notFound();

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
    { highestOrder: -1, nextSessionId: null, previousSessionId: null },
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
      <Header>
        <BackButton
          href={
            isEditOrCreate
              ? `/subjects/${subjectId}/missions/${missionId}/sessions`
              : `/subjects/${subjectId}/timeline`
          }
        />
        <Breadcrumbs items={breadcrumbs} />
      </Header>
      <nav className="flex w-full items-center justify-between px-4">
        <IconButton
          disabled={!previousSessionId}
          href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${previousSessionId}${editSuffix}`}
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
            subject.team_id === teamId &&
            (isEditOrCreate ? (
              <Button
                className="-my-4 items-baseline"
                href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${sessionId}`}
                variant="link"
              >
                <EyeIcon className="relative top-1 w-5" />
                View
              </Button>
            ) : (
              <Button
                className="-my-4 items-baseline"
                href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${sessionId}/edit`}
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
            disabled={!!order}
            href={`/subjects/${subjectId}/missions/${mission.id}/sessions/create/${nextSessionOrder}`}
            icon={<PlusIcon className="relative -right-2 w-7" />}
            label="Add session"
            replace
          />
        ) : (
          <IconButton
            disabled={!nextSessionId}
            href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${nextSessionId}${editSuffix}`}
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
