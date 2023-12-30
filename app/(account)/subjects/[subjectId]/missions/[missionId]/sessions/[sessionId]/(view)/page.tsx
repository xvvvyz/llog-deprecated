import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import SessionLayout from '@/(account)/subjects/[subjectId]/missions/[missionId]/sessions/_components/session-layout';
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
import { CalendarIcon } from '@heroicons/react/24/outline';

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

  if (!subject || !mission || !session || !user) return null;
  const isTeamMember = subject.team_id === teamId;

  return (
    <SessionLayout
      isTeamMember={isTeamMember}
      missionId={missionId}
      missionName={mission.name}
      sessionId={sessionId}
      sessions={mission.sessions}
      subjectId={subjectId}
      subjectName={subject.name}
    >
      {session.scheduled_for && new Date(session.scheduled_for) > new Date() ? (
        <Empty className="max-w-lg rounded-none border-x-0 sm:rounded sm:border-x">
          <CalendarIcon className="w-7" />
          <p>
            Scheduled for{' '}
            <DateTime
              className="inline"
              date={session.scheduled_for}
              formatter="date-time"
            />
          </p>
        </Empty>
      ) : (
        <>
          {session.title && (
            <p className="mx-auto -mt-4 max-w-sm px-4 pb-8 text-center print:hidden">
              {session.title}
            </p>
          )}
          {forceArray(session.modules).map((module, i) => {
            const event = firstIfArray(module.event);
            const previousModule = forceArray(session.modules)[i - 1];

            return (
              <EventCard
                disabled={!!previousModule && !previousModule.event.length}
                event={event}
                eventType={module}
                isTeamMember={isTeamMember}
                key={module.id}
                mission={mission}
                subjectId={subjectId}
                user={user}
              />
            );
          })}
        </>
      )}
    </SessionLayout>
  );
};

export default Page;
