import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import ModuleCard from '@/_components/module-card';
import PageModalHeader from '@/_components/page-modal-header';
import SessionMenu from '@/_components/session-menu';
import getCurrentUser from '@/_queries/get-current-user';
import getProtocolWithSessions from '@/_queries/get-protocol-with-sessions';
import getPublicProtocolWithSessions from '@/_queries/get-public-protocol-with-sessions';
import getPublicSessionWithDetails from '@/_queries/get-public-session-with-details';
import getPublicSubject from '@/_queries/get-public-subject';
import getSessionWithDetails from '@/_queries/get-session-with-details';
import getSubject from '@/_queries/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import getDurationFromTimestamps from '@/_utilities/get-duration-from-timestamps';
import parseSessions from '@/_utilities/parse-sessions';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';

interface SessionPageProps {
  isPublic?: boolean;
  sessionId: string;
  subjectId: string;
  protocolId: string;
}

const SessionPage = async ({
  isPublic,
  sessionId,
  subjectId,
  protocolId,
}: SessionPageProps) => {
  const [{ data: subject }, { data: protocol }, { data: session }, user] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic
        ? getPublicProtocolWithSessions(protocolId)
        : getProtocolWithSessions(protocolId),
      isPublic
        ? getPublicSessionWithDetails(sessionId)
        : getSessionWithDetails(sessionId),
      getCurrentUser(),
    ]);

  if (!subject || !protocol || !session) return null;
  const currentSession = protocol.sessions.find((s) => s.id === sessionId);
  if (!currentSession) return null;

  const isTeamMember = !!user && subject.team_id === user.id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  let {
    // eslint-disable-next-line prefer-const
    highestOrder,
    // eslint-disable-next-line prefer-const
    highestPublishedOrder,
    nextSessionId,
    previousSessionId,
  } = parseSessions({
    currentSession: session,
    sessionOrder: session.order,
    sessions: protocol.sessions,
  });

  if (protocol.sessions.length > 0 && !previousSessionId && !nextSessionId) {
    protocol.sessions.some((session) => {
      if (session.order < currentSession.order) {
        previousSessionId = session.id;
      } else if (session.order > currentSession.order) {
        nextSessionId = session.id;
        return true;
      }
    });
  }

  const completedModules = session.modules.filter((m) => m.event?.length);

  const firstCompletedEvent = firstIfArray(completedModules[0]?.event);

  const lastCompletedEvent = firstIfArray(
    completedModules[completedModules.length - 1]?.event,
  );

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          isTeamMember && (
            <SessionMenu
              highestPublishedOrder={highestPublishedOrder}
              isDraft={session.draft}
              isStarted={!!completedModules.length}
              isView
              nextSessionOrder={highestOrder + 1}
              order={session.order}
              protocolId={protocolId}
              sessionId={sessionId}
              subjectId={subjectId}
            />
          )
        }
        subtitle={
          <Button
            className="pt-4"
            href={`/${shareOrSubjects}/${subjectId}/protocols/${protocolId}/sessions`}
            variant="link"
          >
            View all sessions
            <ArrowUpRightIcon className="w-5" />
          </Button>
        }
        title={protocol.name}
      />
      <nav className="flex w-full items-center justify-between gap-4 px-4 sm:px-8">
        <IconButton
          disabled={!previousSessionId}
          href={`/${shareOrSubjects}/${subjectId}/protocols/${protocolId}/sessions/${previousSessionId}`}
          icon={<ChevronLeftIcon className="relative left-1 w-7" />}
          label="Previous session"
          replace
        />
        <div className="flex min-w-0 items-baseline gap-4">
          <div className="min-w-0">
            <div className="truncate">
              Session {currentSession.order + 1}
              {session.title ? `: ${session.title}` : ''}
            </div>
          </div>
          {currentSession.draft && (
            <span className="smallcaps text-fg-4">Draft</span>
          )}
        </div>
        <IconButton
          disabled={!nextSessionId}
          href={`/${shareOrSubjects}/${subjectId}/protocols/${protocolId}/sessions/${nextSessionId}`}
          icon={<ChevronRightIcon className="relative right-1 w-7" />}
          label="Next session"
          replace
        />
      </nav>
      {session.scheduled_for && new Date(session.scheduled_for) > new Date() ? (
        <Empty className="mt-6 border-0">
          <CalendarDaysIcon className="w-7" />
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
          <div className="smallcaps mt-1.5 flex justify-center gap-2 text-fg-4">
            {completedModules.length ? (
              <>
                <div>
                  {completedModules.length} of {session.modules.length}{' '}
                  completed
                </div>
                {firstCompletedEvent.created_at !==
                  lastCompletedEvent.created_at && (
                  <>
                    &#8226;
                    <div>
                      {getDurationFromTimestamps(
                        firstCompletedEvent.created_at,
                        lastCompletedEvent.created_at,
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              'Not started'
            )}
          </div>
          <ul className="mt-8 space-y-4 border-y border-alpha-0 bg-alpha-reverse-2 py-4">
            {session.modules.map((module, i) => {
              const event = firstIfArray(module.event);
              const previousModuleEvent = session.modules[i - 1]?.event;

              return (
                <li className="border-y border-alpha-0 bg-bg-2" key={module.id}>
                  <ModuleCard
                    event={event}
                    eventType={module}
                    isArchived={subject.archived}
                    isPreviousModulePending={
                      previousModuleEvent && !previousModuleEvent.length
                    }
                    isPublic={isPublic}
                    isTeamMember={isTeamMember}
                    subjectId={subjectId}
                    protocol={protocol}
                    user={user}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
      <Modal.Close asChild>
        <Button className="m-0 block w-full py-6 text-center" variant="link">
          Close
        </Button>
      </Modal.Close>
    </Modal.Content>
  );
};

export default SessionPage;
