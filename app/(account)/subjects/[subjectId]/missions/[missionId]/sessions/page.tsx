import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import DateTime from '@/(account)/_components/date-time';
import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import forceArray from '@/(account)/_utilities/force-array';
import formatTitle from '@/(account)/_utilities/format-title';
import Button from '@/_components/button';
import { notFound } from 'next/navigation';

import {
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import getMissionWithSessionsAndEvents, {
  GetMissionWithSessionsAndEventsData,
} from '@/(account)/_server/get-mission-with-sessions-and-events';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, teamId] = await Promise.all([
    getSubject(subjectId),
    getCurrentTeamId(),
  ]);

  const isTeamMember = subject?.team_id === teamId;

  const { data: mission } = await getMissionWithSessionsAndEvents(
    missionId,
    isTeamMember,
  );

  return {
    title: formatTitle([subject?.name, mission?.name]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, teamId] = await Promise.all([
    getSubject(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject) notFound();
  const isTeamMember = subject.team_id === teamId;

  const { data: mission } = await getMissionWithSessionsAndEvents(
    missionId,
    isTeamMember,
  );

  if (!mission) notFound();
  const sessions = forceArray(mission.sessions);

  const { highestOrder, sessionsReversed } = sessions.reduce(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session.order);
      acc.sessionsReversed.push(sessions[sessions.length - i - 1]);
      return acc;
    },
    { highestOrder: -1, sessionsReversed: [] },
  );

  const nextSessionOrder = highestOrder + 1;

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          className="text-center"
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [mission.name],
          ]}
        />
      </Header>
      {isTeamMember && (
        <Header className="-mt-3">
          <h1 className="text-2xl">Sessions</h1>
          <Button
            href={`/subjects/${subjectId}/missions/${missionId}/sessions/create/${nextSessionOrder}`}
            size="sm"
          >
            Add session
          </Button>
        </Header>
      )}
      {sessionsReversed.length ? (
        <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
          {sessionsReversed.map(
            (session: GetMissionWithSessionsAndEventsData['sessions'][0]) => {
              const modules = forceArray(session.modules);
              const completedModules = modules.filter((m) => m.event.length);

              return (
                <li key={session.id}>
                  <Button
                    className="m-0 flex w-full gap-4 px-4 py-3 leading-snug [overflow-wrap:anywhere] hover:bg-alpha-1"
                    href={
                      isTeamMember
                        ? `/subjects/${subjectId}/missions/${missionId}/sessions/${session.id}/edit`
                        : `/subjects/${subjectId}/missions/${missionId}/sessions/${session.id}`
                    }
                    variant="link"
                  >
                    <div>
                      <span className="font-mono">
                        Session {session.order + 1}
                      </span>
                      {session.title && (
                        <span className="before:px-3 before:text-alpha-4 before:content-['/']">
                          {session.title}
                        </span>
                      )}
                      <div className="smallcaps pb-1 pt-1 text-fg-4">
                        {session.draft ? (
                          'Draft'
                        ) : new Date(session.scheduled_for ?? '') >
                          new Date() ? (
                          <DateTime
                            date={session.scheduled_for ?? ''}
                            formatter="date"
                          />
                        ) : completedModules.length ? (
                          `${completedModules.length} of ${modules.length} completed`
                        ) : (
                          'Not started'
                        )}
                      </div>
                    </div>
                    <ArrowRightIcon className="ml-auto w-5 shrink-0" />
                  </Button>
                </li>
              );
            },
          )}
        </ul>
      ) : (
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Schedule detailed training sessions
          <br />
          to be completed over time.
        </Empty>
      )}
    </>
  );
};

export default Page;
