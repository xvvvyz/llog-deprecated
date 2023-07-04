import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import DateTime from '@/(account)/_components/date-time';
import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import IconButton from '@/(account)/_components/icon-button';
import getMissionWithSessionsAndEvents, {
  GetMissionWithSessionsAndEventsData,
} from '@/(account)/_server/get-mission-with-sessions-and-events';
import getSubject from '@/(account)/_server/get-subject';
import forceArray from '@/(account)/_utilities/force-array';
import formatTitle from '@/(account)/_utilities/format-title';
import Button from '@/_components/button';
import { PencilIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessionsAndEvents(missionId),
  ]);

  return {
    title: formatTitle([subject?.name, mission?.name, 'Sessions']),
  };
};

export const revalidate = 0;

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessionsAndEvents(missionId),
  ]);

  if (!subject || !mission) notFound();
  const sessions = forceArray(mission.sessions);

  const { highestOrder, sessionsReversed } = sessions.reduce(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session.order);
      acc.sessionsReversed.push(sessions[sessions.length - i - 1]);
      return acc;
    },
    { highestOrder: -1, sessionsReversed: [] }
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
        <IconButton
          href={`/subjects/${subjectId}/missions/${missionId}/edit`}
          icon={<PencilIcon className="relative -left-[0.16em] w-7" />}
          label="Edit"
        />
      </Header>
      <Header className="-mt-3">
        <h1 className="text-2xl">Sessions</h1>
        <Button
          href={`/subjects/${subjectId}/missions/${missionId}/sessions/create/${nextSessionOrder}`}
          size="sm"
        >
          Add session
        </Button>
      </Header>
      {sessionsReversed.length ? (
        <ul className="mx-4 divide-y divide-alpha-1 rounded border border-alpha-1 bg-bg-2 leading-snug">
          {sessionsReversed.map(
            (session: GetMissionWithSessionsAndEventsData['sessions'][0]) => {
              const modules = forceArray(session.modules);
              const completedModules = modules.filter((m) => m.events.length);

              return (
                <li key={session.id}>
                  <Button
                    className="m-0 w-full justify-between gap-6 px-4 py-3"
                    href={`/subjects/${subjectId}/missions/${missionId}/sessions/${session.id}/edit`}
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
                      <div className="smallcaps pb-1 pt-2 text-fg-3">
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
                    <PencilIcon className="w-5 shrink-0" />
                  </Button>
                </li>
              );
            }
          )}
        </ul>
      ) : (
        <Empty>No sessions</Empty>
      )}
    </>
  );
};

export default Page;
