import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import * as Modal from '@/_components/modal';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import SessionMenu from '@/_components/session-menu';
import TrainingPlanMenu from '@/_components/training-plan-menu';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getPublicTrainingPlanWithSessionsAndEvents from '@/_queries/get-public-training-plan-with-sessions-and-events';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessionsAndEvents from '@/_queries/get-training-plan-with-sessions-and-events';
import firstIfArray from '@/_utilities/first-if-array';
import parseSessions from '@/_utilities/parse-sessions';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

interface SessionsPageProps {
  isPublic?: boolean;
  subjectId: string;
  trainingPlanId: string;
}

const SessionsPage = async ({
  isPublic,
  subjectId,
  trainingPlanId,
}: SessionsPageProps) => {
  const [{ data: subject }, user] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    getCurrentUser(),
  ]);

  if (!subject) return null;
  const isTeamMember = !!user && subject.team_id === user.id;

  const { data: trainingPlan } = isPublic
    ? await getPublicTrainingPlanWithSessionsAndEvents(trainingPlanId)
    : await getTrainingPlanWithSessionsAndEvents(trainingPlanId, {
        draft: isTeamMember,
      });

  if (!trainingPlan) return null;

  const { highestOrder, highestPublishedOrder, sessionsReversed } =
    parseSessions({ sessions: trainingPlan.sessions });

  const nextSessionOrder = highestOrder + 1;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          isTeamMember && (
            <TrainingPlanMenu
              isModal
              subjectId={subjectId}
              trainingPlanId={trainingPlan.id}
            />
          )
        }
        title={trainingPlan.name}
      />
      {!isPublic && !subject.archived && isTeamMember && (
        <div className="px-4 pb-8 sm:px-8">
          <Button
            colorScheme="transparent"
            className="w-full"
            href={`/subjects/${subjectId}/training-plans/${trainingPlanId}/sessions/create/${nextSessionOrder}`}
            scroll={false}
          >
            <PlusIcon className="w-5" />
            New session
          </Button>
        </div>
      )}
      {!sessionsReversed.length && (
        <Empty className="border-0">
          <InformationCircleIcon className="w-7" />
          {isPublic || subject.archived ? (
            'No training sessions.'
          ) : (
            <>
              Schedule detailed training sessions
              <br />
              to be completed over time.
            </>
          )}
        </Empty>
      )}
      {!!sessionsReversed.length && (
        <ul className="border-y border-alpha-1 py-4">
          {sessionsReversed.map((session) => {
            const completedModules = session.modules.filter(
              (m) => m.event?.length,
            );

            const latestCompletedEvent = firstIfArray(
              completedModules[completedModules.length - 1]?.event,
            );

            return (
              <li
                className="flex items-stretch gap-2 transition-colors hover:bg-alpha-1"
                key={session.id}
              >
                <Button
                  className="m-0 w-full min-w-0 justify-between gap-6 py-3 pl-4 pr-0 sm:pl-8"
                  href={`/${shareOrSubjects}/${subjectId}/training-plans/${trainingPlanId}/sessions/${session.id}/${session.draft ? 'edit' : ''}`}
                  scroll={false}
                  variant="link"
                >
                  <div className="min-w-0">
                    <div className="truncate leading-snug">
                      Session {session.order + 1}
                      {session.title && `: ${session.title}`}
                    </div>
                    <div className="smallcaps flex gap-2 pb-0.5 pt-1.5 text-fg-4">
                      {session.draft ? (
                        'Draft'
                      ) : new Date(session.scheduled_for ?? '') > new Date() ? (
                        <>
                          <DateTime
                            date={session.scheduled_for ?? ''}
                            formatter="date-time"
                          />
                          &#8226;
                          <div>Scheduled</div>
                        </>
                      ) : completedModules.length ? (
                        <>
                          <DateTime
                            date={latestCompletedEvent.created_at}
                            formatter="date-time"
                          />
                          &#8226;
                          <div>
                            {completedModules.length} of{' '}
                            {session.modules.length} completed
                          </div>
                        </>
                      ) : (
                        'Not started'
                      )}
                    </div>
                  </div>
                  {(subject.archived || !isTeamMember) && (
                    <ArrowUpRightIcon className="-my-1 mr-6 w-5 shrink-0 sm:mr-10" />
                  )}
                </Button>
                {!isPublic && !subject.archived && isTeamMember && (
                  <SessionMenu
                    highestPublishedOrder={highestPublishedOrder}
                    isDraft={session.draft}
                    isList
                    trainingPlanId={trainingPlanId}
                    nextSessionOrder={nextSessionOrder}
                    order={session.order}
                    sessionId={session.id}
                    subjectId={subjectId}
                  />
                )}
              </li>
            );
          })}
        </ul>
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

export default SessionsPage;
