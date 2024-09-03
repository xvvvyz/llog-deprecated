import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import ModuleCard from '@/_components/module-card';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import SessionMenu from '@/_components/session-menu';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSessionWithDetails from '@/_queries/get-public-session-with-details';
import getPublicSubject from '@/_queries/get-public-subject';
import getPublicTrainingPlanWithSessions from '@/_queries/get-public-training-plan-with-sessions';
import getSessionWithDetails from '@/_queries/get-session-with-details';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessions from '@/_queries/get-training-plan-with-sessions';
import firstIfArray from '@/_utilities/first-if-array';
import parseSessions from '@/_utilities/parse-sessions';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';

interface SessionPageProps {
  isPublic?: boolean;
  sessionId: string;
  subjectId: string;
  trainingPlanId: string;
}

const SessionPage = async ({
  isPublic,
  sessionId,
  subjectId,
  trainingPlanId,
}: SessionPageProps) => {
  const [{ data: subject }, { data: trainingPlan }, { data: session }, user] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic
        ? getPublicTrainingPlanWithSessions(trainingPlanId)
        : getTrainingPlanWithSessions(trainingPlanId),
      isPublic
        ? getPublicSessionWithDetails(sessionId)
        : getSessionWithDetails(sessionId),
      getCurrentUser(),
    ]);

  if (!subject || !trainingPlan || !session) return null;
  const currentSession = trainingPlan.sessions.find((s) => s.id === sessionId);
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
    sessions: trainingPlan.sessions,
  });

  if (
    trainingPlan.sessions.length > 0 &&
    !previousSessionId &&
    !nextSessionId
  ) {
    trainingPlan.sessions.some((session) => {
      if (session.order < currentSession.order) {
        previousSessionId = session.id;
      } else if (session.order > currentSession.order) {
        nextSessionId = session.id;
        return true;
      }
    });
  }

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          isTeamMember && (
            <SessionMenu
              highestPublishedOrder={highestPublishedOrder}
              isDraft={session.draft}
              isView
              nextSessionOrder={highestOrder + 1}
              order={session.order}
              sessionId={sessionId}
              subjectId={subjectId}
              trainingPlanId={trainingPlanId}
            />
          )
        }
        subtitle={
          <Button
            className="pt-4"
            href={`/${shareOrSubjects}/${subjectId}/training-plans/${trainingPlanId}/sessions`}
            scroll={false}
            variant="link"
          >
            View all sessions
            <ArrowUpRightIcon className="w-5" />
          </Button>
        }
        title={trainingPlan.name}
      />
      <nav className="flex w-full items-center justify-between px-4 sm:px-8">
        <IconButton
          disabled={!previousSessionId}
          href={`/${shareOrSubjects}/${subjectId}/training-plans/${trainingPlanId}/sessions/${previousSessionId}`}
          icon={<ChevronLeftIcon className="relative left-1 w-7" />}
          label="Previous session"
          replace
          scroll={false}
        />
        <div className="flex items-baseline gap-4">
          <span className="smallcaps text-fg-4">
            Session {currentSession.order + 1} of {highestOrder + 1}
          </span>
          {currentSession.draft && (
            <span className="smallcaps text-fg-4">Draft</span>
          )}
        </div>
        <IconButton
          disabled={!nextSessionId}
          href={`/${shareOrSubjects}/${subjectId}/training-plans/${trainingPlanId}/sessions/${nextSessionId}`}
          icon={<ChevronRightIcon className="relative right-1 w-7" />}
          label="Next session"
          replace
          scroll={false}
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
          {session.title && (
            <p className="mx-auto max-w-xs px-4 text-center">{session.title}</p>
          )}
          <ul className="mt-8 space-y-4 border-y border-alpha-1 bg-alpha-reverse-2 py-4">
            {session.modules.map((module, i) => {
              const event = firstIfArray(module.event);
              const previousModuleEvent = session.modules[i - 1]?.event;

              return (
                <li className="border-y border-alpha-1 bg-bg-2" key={module.id}>
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
                    trainingPlan={trainingPlan}
                    user={user}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
      <PageModalBackButton
        className="m-0 block w-full py-6 text-center"
        variant="link"
      >
        Close
      </PageModalBackButton>
    </Modal.Content>
  );
};

export default SessionPage;
