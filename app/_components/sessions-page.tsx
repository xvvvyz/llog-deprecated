import BackIconButton from '@/_components/back-icon-button';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import SessionLinkListItemMenu from '@/_components/session-link-list-item-menu';
import getCurrentUser from '@/_queries/get-current-user';
import getMissionWithSessionsAndEvents from '@/_queries/get-mission-with-sessions-and-events';
import getPublicMissionWithSessionsAndEvents from '@/_queries/get-public-mission-with-sessions-and-events';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import getHighestPublishedOrder from '@/_utilities/get-highest-published-order';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { twMerge } from 'tailwind-merge';

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
    ? await getPublicMissionWithSessionsAndEvents(missionId)
    : await getMissionWithSessionsAndEvents(missionId, { draft: isTeamMember });

  if (!mission) return null;

  const { highestOrder, sessionsReversed } = mission.sessions.reduce(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session.order);

      acc.sessionsReversed.push(
        mission.sessions[mission.sessions.length - i - 1],
      );

      return acc;
    },
    { highestOrder: -1, sessionsReversed: [] as typeof mission.sessions },
  );

  const highestPublishedOrder = getHighestPublishedOrder(mission.sessions);
  const nextSessionOrder = highestOrder + 1;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <div className="px-4">
      <div className="my-16 flex h-8 items-center gap-6">
        <BackIconButton
          icon={<ArrowLeftIcon className="relative -left-[0.16em] w-7" />}
          label="Back"
        />
        <h1 className="truncate text-2xl">{mission.name}</h1>
      </div>
      {!isPublic && isTeamMember && (
        <Button
          className="mb-4 w-full"
          colorScheme="transparent"
          href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}`}
          scroll={false}
        >
          <PlusIcon className="w-5" />
          Create session
        </Button>
      )}
      {!sessionsReversed.length && (
        <Empty>
          <InformationCircleIcon className="w-7" />
          {isPublic ? (
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
        <ul className="m-0 divide-y divide-alpha-1 rounded border border-alpha-1 bg-bg-2 py-1">
          {sessionsReversed.map((session) => {
            const completedModules = session.modules.filter(
              (m) => m.event?.length,
            );

            return (
              <li
                className="flex items-stretch hover:bg-alpha-1"
                key={session.id}
              >
                <Button
                  className="m-0 w-full justify-between gap-6 p-4 leading-snug"
                  href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${session.id}/${session.draft ? 'edit' : ''}?fromSessions=1`}
                  scroll={false}
                  variant="link"
                >
                  <div>
                    {session.title && (
                      <div className="mb-2">{session.title}</div>
                    )}
                    <div
                      className={twMerge(
                        'smallcaps flex gap-4 pb-0.5',
                        !session.title && 'py-[0.187rem]',
                      )}
                    >
                      Session {session.order + 1}
                      <span className="text-fg-4">
                        {session.draft ? (
                          'Draft'
                        ) : new Date(session.scheduled_for ?? '') >
                          new Date() ? (
                          <DateTime
                            date={session.scheduled_for ?? ''}
                            formatter="date"
                          />
                        ) : completedModules.length ? (
                          `${completedModules.length} of ${session.modules.length} completed`
                        ) : (
                          'Not started'
                        )}
                      </span>
                    </div>
                  </div>
                  {!isTeamMember && (
                    <ArrowRightIcon className="mr-2 w-5 shrink-0" />
                  )}
                </Button>
                {!isPublic && isTeamMember && (
                  <SessionLinkListItemMenu
                    highestPublishedOrder={highestPublishedOrder}
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
    </div>
  );
};

export default SessionsPage;
