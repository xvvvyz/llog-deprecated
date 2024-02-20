import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Empty from '@/_components/empty';
import PageModalHeader from '@/_components/page-modal-header';
import SessionLinkListItemMenu from '@/_components/session-link-list-item-menu';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getMissionWithSessionsAndEvents from '@/_queries/get-mission-with-sessions-and-events';
import getPublicMissionWithSessionsAndEvents from '@/_queries/get-public-mission-with-sessions-and-events';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import getHighestPublishedOrder from '@/_utilities/get-highest-published-order';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { notFound } from 'next/navigation';

interface SessionsPageProps {
  back?: string;
  isPublic?: boolean;
  missionId: string;
  subjectId: string;
}

const SessionsPage = async ({
  back,
  isPublic,
  missionId,
  subjectId,
}: SessionsPageProps) => {
  if (!back) notFound();
  const user = await getCurrentUserFromSession();

  const { data: subject } = await (isPublic
    ? getPublicSubject(subjectId)
    : getSubject(subjectId));

  if (!subject) notFound();
  const isTeamMember = subject.team_id === user?.id;

  const { data: mission } = isPublic
    ? await getPublicMissionWithSessionsAndEvents(missionId)
    : await getMissionWithSessionsAndEvents(missionId, { draft: isTeamMember });

  if (!mission) notFound();

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

  const nextBack = encodeURIComponent(
    `/subjects/${subjectId}/training-plans/${missionId}/sessions?back=${back}`,
  );

  return (
    <>
      <PageModalHeader back={back} title={mission.name} />
      {!sessionsReversed.length && (
        <Empty className="rounded-none border-0 bg-transparent">
          <InformationCircleIcon className="w-7" />
          Schedule detailed training sessions
          <br />
          to be completed over time.
        </Empty>
      )}
      {!isPublic && isTeamMember && (
        <div className="px-4 py-8 sm:px-8">
          <Button
            className="w-full"
            colorScheme="transparent"
            href={`/subjects/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}?back=${nextBack}`}
            scroll={false}
          >
            <PlusIcon className="w-5" />
            Add session
          </Button>
        </div>
      )}
      {!!sessionsReversed.length && (
        <ul className="divide-y divide-alpha-1">
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
                  className="m-0 w-full justify-between gap-6 px-4 py-7 leading-snug sm:px-8"
                  href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${session.id}/${session.draft ? 'edit' : ''}?back=${nextBack}`}
                  scroll={false}
                  variant="link"
                >
                  <div>
                    <div className="smallcaps flex gap-4">
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
                    {session.title && (
                      <div className="mt-1.5">{session.title}</div>
                    )}
                  </div>
                  {!isTeamMember && (
                    <ArrowRightIcon className="mr-2 w-5 shrink-0" />
                  )}
                </Button>
                {!isPublic && isTeamMember && (
                  <SessionLinkListItemMenu
                    back={nextBack}
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
      <Button
        className="m-0 block w-full py-6 text-center"
        href={back}
        scroll={false}
        variant="link"
      >
        Close
      </Button>
    </>
  );
};

export default SessionsPage;
