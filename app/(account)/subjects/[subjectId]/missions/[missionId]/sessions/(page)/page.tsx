import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getSubject from '@/_server/get-subject';
import forceArray from '@/_utilities/force-array';
import formatTitle from '@/_utilities/format-title';

import {
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import getMissionWithSessionsAndEvents, {
  GetMissionWithSessionsAndEventsData,
} from '@/_server/get-mission-with-sessions-and-events';

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

  if (!subject) return null;
  const isTeamMember = subject.team_id === teamId;

  const { data: mission } = await getMissionWithSessionsAndEvents(
    missionId,
    isTeamMember,
  );

  if (!mission) return null;
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
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href={`/subjects/${subjectId}`} />
        <Breadcrumbs
          className="text-center"
          items={[[subject.name, `/subjects/${subjectId}`], [mission.name]]}
        />
      </div>
      {isTeamMember && (
        <div className="-mt-3 mb-16 flex h-8 items-center justify-between gap-8 px-4">
          <h1 className="text-2xl">Sessions</h1>
          <Button
            href={`/subjects/${subjectId}/missions/${missionId}/sessions/create/${nextSessionOrder}`}
            size="sm"
          >
            Add session
          </Button>
        </div>
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
                    className="m-0 w-full gap-6 px-4 py-3 leading-snug hover:bg-alpha-1"
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
                      <div className="smallcaps pb-0.5 pt-1">
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
