import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import PageModalHeader from '@/_components/page-modal-header';
import SessionMenu from '@/_components/session-menu';
import TrainingPlanMenu from '@/_components/training-plan-menu';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getPublicTrainingPlanWithSessionsAndEvents from '@/_queries/get-public-training-plan-with-sessions-and-events';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessionsAndEvents from '@/_queries/get-training-plan-with-sessions-and-events';
import parseSessions from '@/_utilities/parse-sessions';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

interface SessionsPageProps {
  isPublic?: boolean;
  missionId: string;
  subjectId: string;
}

const SessionsPage = async ({
  isPublic,
  missionId,
  subjectId,
}: SessionsPageProps) => {
  const [{ data: subject }, user] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    getCurrentUser(),
  ]);

  if (!subject) return null;
  const isTeamMember = !!user && subject.team_id === user.id;

  const { data: mission } = isPublic
    ? await getPublicTrainingPlanWithSessionsAndEvents(missionId)
    : await getTrainingPlanWithSessionsAndEvents(missionId, {
        draft: isTeamMember,
      });

  if (!mission) return null;

  const { highestOrder, highestPublishedOrder, sessionsReversed } =
    parseSessions({ sessions: mission.sessions });

  const nextSessionOrder = highestOrder + 1;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <>
      <PageModalHeader
        menu={
          isTeamMember && (
            <TrainingPlanMenu
              isView
              missionId={mission.id}
              subjectId={subjectId}
            />
          )
        }
        title={mission.name}
      />
      {!isPublic && !subject.archived && isTeamMember && (
        <div className="px-4 pb-8 sm:px-8">
          <Button
            colorScheme="transparent"
            className="w-full"
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}`}
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

            return (
              <li
                className="flex items-stretch gap-2 hover:bg-alpha-1 active:bg-alpha-1"
                key={session.id}
              >
                <Button
                  className="m-0 w-full min-w-0 justify-between gap-6 py-3 pl-4 pr-0 sm:pl-8"
                  href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${session.id}/${session.draft ? 'edit' : ''}?fromSessions=1`}
                  scroll={false}
                  variant="link"
                >
                  <div className="min-w-0">
                    <div className="truncate leading-snug">
                      Session {session.order + 1}
                      {session.title && `: ${session.title}`}
                    </div>
                    <div className="smallcaps pb-0.5 pt-1.5 text-fg-4">
                      {session.draft ? (
                        'Draft'
                      ) : new Date(session.scheduled_for ?? '') > new Date() ? (
                        <DateTime
                          date={session.scheduled_for ?? ''}
                          formatter="date"
                        />
                      ) : completedModules.length ? (
                        `${completedModules.length} of ${session.modules.length} completed`
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
                    isList
                    missionId={missionId}
                    nextSessionOrder={nextSessionOrder}
                    session={session}
                    subjectId={subjectId}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
      <BackButton className="m-0 block w-full py-6 text-center" variant="link">
        Close
      </BackButton>
    </>
  );
};

export default SessionsPage;
