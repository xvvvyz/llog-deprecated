import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import EventCard from '@/_components/event-card';
import SessionLayout from '@/_components/session-layout';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getMissionWithSessions from '@/_server/get-mission-with-sessions';
import getPublicMissionWithSessions from '@/_server/get-public-mission-with-sessions';
import getPublicSessionWithDetails from '@/_server/get-public-session-with-details';
import getPublicSubject from '@/_server/get-public-subject';
import getSessionWithDetails from '@/_server/get-session-with-details';
import getSubject from '@/_server/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import forceArray from '@/_utilities/force-array';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

interface SubjectMissionSessionPageProps {
  isPublic?: boolean;
  missionId: string;
  sessionId: string;
  subjectId: string;
}

const Page = async ({
  isPublic,
  missionId,
  sessionId,
  subjectId,
}: SubjectMissionSessionPageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: session },
    user,
    teamId,
  ] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    isPublic
      ? getPublicMissionWithSessions(missionId)
      : getMissionWithSessions(missionId),
    isPublic
      ? getPublicSessionWithDetails(sessionId)
      : getSessionWithDetails(sessionId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject || !mission || !session) notFound();
  const isTeamMember = !!teamId && subject.team_id === teamId;

  return (
    <SessionLayout
      isPublic={isPublic}
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
                isPublic={isPublic}
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
