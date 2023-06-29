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
  const isEdit = !!order || !!edit;

  const [{ data: subject }, { data: mission }, teamId] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
    getCurrentTeamId(),
  ]);

  if (!subject || !mission) notFound();

  const breadcrumbs = [
    [subject.name, `/subjects/${subjectId}/timeline`],
    [mission.name],
  ];

  if (isEdit) {
    breadcrumbs[1][1] = `/subjects/${subjectId}/missions/${missionId}/sessions`;
    breadcrumbs[2] = [order ? 'Add session' : 'Edit session'];
  }

  const sessions = forceArray(mission.sessions);

  const sessionIndex = order
    ? Math.max(0, Math.min(Number(order), sessions.length))
    : sessions.findIndex(({ id }) => id === sessionId);

  if (sessionIndex === -1) notFound();
  const previousSessionId = sessions[sessionIndex - 1]?.id;
  const nextSessionId = sessions[sessionIndex + (order ? 0 : 1)]?.id;
  const totalSessions = sessions.length + (order ? 1 : 0);
  const editSuffix = isEdit ? '/edit' : '';

  return (
    <>
      <Header>
        <BackButton
          href={
            isEdit
              ? `/subjects/${subjectId}/missions/${missionId}/sessions`
              : `/subjects/${subjectId}/timeline`
          }
        />
        <Breadcrumbs items={breadcrumbs} />
      </Header>
      <nav className="flex w-full items-center justify-between px-4">
        <IconButton
          disabled={!sessionIndex}
          href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${previousSessionId}${editSuffix}`}
          icon={<ChevronLeftIcon className="relative -left-2 w-7" />}
          label="Previous session"
          replace
        />
        <div className="flex items-center gap-6">
          <span className="text-fg-3">
            Session {sessionIndex + 1} of {totalSessions}
          </span>
          {subject.team_id === teamId &&
            (isEdit ? (
              <Button
                disabled={!!order}
                href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${sessionId}`}
                variant="link"
              >
                <EyeIcon className="w-5" />
                View
              </Button>
            ) : (
              <Button
                href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${sessionId}/edit`}
                variant="link"
              >
                <PencilIcon className="w-5" />
                Edit
              </Button>
            ))}
        </div>
        {isEdit && sessionIndex >= totalSessions - 1 ? (
          <IconButton
            disabled={!!order}
            href={`/subjects/${subjectId}/missions/${mission.id}/sessions/create/${sessions.length}`}
            icon={<PlusIcon className="relative -right-2 w-7" />}
            label="Add session"
            replace
          />
        ) : (
          <IconButton
            disabled={sessionIndex >= totalSessions - 1}
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
