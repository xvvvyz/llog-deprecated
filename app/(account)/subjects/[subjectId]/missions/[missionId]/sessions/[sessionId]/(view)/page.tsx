import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getMissionWithSessions from '@/_server/get-mission-with-sessions';
import getSessionWithDetails from '@/_server/get-session-with-details';
import getSubject from '@/_server/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import forceArray from '@/_utilities/force-array';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    missionId: string;
    sessionId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
  ]);

  const sessions = forceArray(mission?.sessions);
  const sessionIndex = sessions.findIndex(({ id }) => id === sessionId);

  return {
    title: formatTitle([
      subject?.name,
      mission?.name,
      String(sessionIndex + 1),
    ]),
  };
};

export const revalidate = 0;

const Page = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: session },
    user,
    teamId,
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
    getSessionWithDetails(sessionId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject || !mission || !session || !user) {
    notFound();
  }

  if (session.scheduled_for && new Date(session.scheduled_for) > new Date()) {
    return (
      <Empty className="mt-10 block max-w-lg">
        Session will be available{' '}
        <DateTime
          className="inline"
          date={session.scheduled_for}
          formatter="date-time"
        />
      </Empty>
    );
  }

  return (
    <>
      {session.title && (
        <p className="mx-auto -mt-4 max-w-sm px-4 pb-8 text-center">
          {session.title}
        </p>
      )}
      {forceArray(session.modules).map((module) => {
        const event = firstIfArray(module.event);

        return (
          <EventCard
            event={event}
            eventType={module}
            isTeamMember={subject.team_id === teamId}
            key={module.id}
            mission={mission}
            subjectId={subjectId}
            userId={user.id}
          />
        );
      })}
    </>
  );
};

export default Page;
