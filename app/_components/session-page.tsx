import BackButton from '@/_components/back-button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import EventCard from '@/_components/event-card';
import PageModalHeader from '@/_components/page-modal-header';
import SessionLayout from '@/_components/session-layout';
import ViewAllSessionsButton from '@/_components/view-all-sessions-button';
import getCurrentUser from '@/_queries/get-current-user';
import getMissionWithSessions from '@/_queries/get-mission-with-sessions';
import getPublicMissionWithSessions from '@/_queries/get-public-mission-with-sessions';
import getPublicSessionWithDetails from '@/_queries/get-public-session-with-details';
import getPublicSubject from '@/_queries/get-public-subject';
import getSessionWithDetails from '@/_queries/get-session-with-details';
import getSubject from '@/_queries/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon';

interface SessionPageProps {
  isPublic?: boolean;
  missionId: string;
  sessionId: string;
  subjectId: string;
}

const SessionPage = async ({
  isPublic,
  missionId,
  sessionId,
  subjectId,
}: SessionPageProps) => {
  const [{ data: subject }, { data: mission }, { data: session }, user] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic
        ? getPublicMissionWithSessions(missionId)
        : getMissionWithSessions(missionId),
      isPublic
        ? getPublicSessionWithDetails(sessionId)
        : getSessionWithDetails(sessionId),
      getCurrentUser(),
    ]);

  if (!subject || !mission || !session) return null;
  const isTeamMember = !!user && subject.team_id === user.id;

  return (
    <>
      <PageModalHeader
        link={
          isTeamMember && (
            <ViewAllSessionsButton
              isPublic={isPublic}
              missionId={missionId}
              subjectId={subjectId}
            />
          )
        }
        title={mission.name}
      />
      <SessionLayout
        isArchived={subject.archived}
        isPublic={isPublic}
        isTeamMember={isTeamMember}
        missionId={missionId}
        sessionId={sessionId}
        sessions={mission.sessions}
        subjectId={subjectId}
      >
        {session.scheduled_for &&
        new Date(session.scheduled_for) > new Date() ? (
          <Empty className="mt-7 rounded-none border-0">
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
            <div className="!border-b !border-t-0 border-alpha-1 pb-7">
              {session.title && (
                <div className="px-4 pt-3">
                  <p className="mx-auto max-w-sm text-center">
                    {session.title}
                  </p>
                </div>
              )}
            </div>
            <ul className="space-y-4 !border-t-0 bg-alpha-reverse-2 py-4">
              {session.modules.map((module, i) => {
                const event = firstIfArray(module.event);
                const previousModule = session.modules[i - 1];

                return (
                  <li
                    className="border-y border-alpha-1 bg-bg-2"
                    key={module.id}
                  >
                    <EventCard
                      disabled={
                        !!previousModule && !previousModule.event.length
                      }
                      event={event}
                      eventType={module}
                      isArchived={subject.archived}
                      isPublic={isPublic}
                      isTeamMember={isTeamMember}
                      mission={mission}
                      subjectId={subjectId}
                      user={user}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </SessionLayout>
      <BackButton className="m-0 block w-full py-6 text-center" variant="link">
        Close
      </BackButton>
    </>
  );
};

export default SessionPage;
